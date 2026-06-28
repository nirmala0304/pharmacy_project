package com.pharmacy.controller;

import com.pharmacy.dto.AddressDTO;
import com.pharmacy.entity.Address;
import com.pharmacy.entity.User;
import com.pharmacy.repository.AddressRepository;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.service.GeocodingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired private AddressRepository addressRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private GeocodingService geocodingService;

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private AddressDTO toDTO(Address a) {
        return new AddressDTO(
            a.getId(), a.getFullName(), a.getStreet(), a.getCity(),
            a.getState(), a.getZipCode(), a.getCountry(), a.getPhone(),
            a.isDefault(), a.getLatitude(), a.getLongitude()
        );
    }

    @GetMapping
    public ResponseEntity<List<AddressDTO>> getUserAddresses(Authentication auth) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(
            addressRepository.findByUserId(user.getId())
                .stream().map(this::toDTO).collect(Collectors.toList())
        );
    }

    @PostMapping
    public ResponseEntity<AddressDTO> createAddress(@RequestBody AddressDTO dto, Authentication auth) {
        User user = getCurrentUser(auth);
        Address address = buildAddress(dto, new Address());
        address.setUser(user);
        geocodeAndSet(address, dto);
        return ResponseEntity.status(201).body(toDTO(addressRepository.save(address)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressDTO> getById(@PathVariable Long id, Authentication auth) {
        User user = getCurrentUser(auth);
        Optional<Address> opt = addressRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getUser().getId().equals(user.getId()))
            return ResponseEntity.status(403).build();
        return ResponseEntity.ok(toDTO(opt.get()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Long id,
                                                     @RequestBody AddressDTO dto,
                                                     Authentication auth) {
        User user = getCurrentUser(auth);
        Optional<Address> opt = addressRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getUser().getId().equals(user.getId()))
            return ResponseEntity.status(403).build();

        Address address = buildAddress(dto, opt.get());

        // Re-geocode only if address text changed or lat/lng missing
        boolean needsGeocode = address.getLatitude() == null || address.getLongitude() == null;
        if (needsGeocode) geocodeAndSet(address, dto);

        return ResponseEntity.ok(toDTO(addressRepository.save(address)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id, Authentication auth) {
        User user = getCurrentUser(auth);
        Optional<Address> opt = addressRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getUser().getId().equals(user.getId()))
            return ResponseEntity.status(403).build();
        addressRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /** GET /api/addresses/{id}/geocode — force re-geocode a saved address */
    @PostMapping("/{id}/geocode")
    public ResponseEntity<AddressDTO> forceGeocode(@PathVariable Long id, Authentication auth) {
        User user = getCurrentUser(auth);
        Optional<Address> opt = addressRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getUser().getId().equals(user.getId()))
            return ResponseEntity.status(403).build();
        Address address = opt.get();
        double[] coords = geocodingService.geocodeAddress(
            address.getStreet(), address.getCity(),
            address.getState(), address.getZipCode(),
            address.getCountry() != null ? address.getCountry() : "India"
        );
        address.setLatitude(coords[0]);
        address.setLongitude(coords[1]);
        return ResponseEntity.ok(toDTO(addressRepository.save(address)));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Address buildAddress(AddressDTO dto, Address target) {
        target.setFullName(dto.getFullName());
        target.setStreet(dto.getStreet());
        target.setCity(dto.getCity());
        target.setState(dto.getState());
        target.setZipCode(dto.getZipCode());
        target.setCountry(dto.getCountry() != null ? dto.getCountry() : "India");
        target.setPhone(dto.getPhone());
        target.setDefault(dto.isDefault());
        // Preserve frontend-provided coords if present (from map picker)
        if (dto.getLatitude() != null)  target.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) target.setLongitude(dto.getLongitude());
        return target;
    }

    private void geocodeAndSet(Address address, AddressDTO dto) {
        // If frontend already sent coordinates (map picker), use them directly
        if (dto.getLatitude() != null && dto.getLongitude() != null) {
            address.setLatitude(dto.getLatitude());
            address.setLongitude(dto.getLongitude());
            return;
        }
        // Otherwise call Nominatim
        double[] coords = geocodingService.geocodeAddress(
            address.getStreet(), address.getCity(),
            address.getState(), address.getZipCode(),
            address.getCountry() != null ? address.getCountry() : "India"
        );
        address.setLatitude(coords[0]);
        address.setLongitude(coords[1]);
    }
}
