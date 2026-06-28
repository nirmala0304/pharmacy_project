package com.pharmacy.controller;

import com.pharmacy.dto.PrescriptionDTO;
import com.pharmacy.entity.User;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<PrescriptionDTO> uploadPrescription(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "doctorName", required = false) String doctorName,
            @RequestParam(value = "patientName", required = false) String patientName,
            @RequestParam(value = "notes", required = false) String notes,
            Authentication authentication) throws java.io.IOException {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        PrescriptionDTO dto = prescriptionService.uploadPrescription(user.getId(), file, doctorName, patientName, notes);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/my")
    public ResponseEntity<List<PrescriptionDTO>> getMyPrescriptions(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByUser(user.getId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<List<PrescriptionDTO>> getPending() {
        return ResponseEntity.ok(prescriptionService.getPendingPrescriptions());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<PrescriptionDTO> approve(@PathVariable Long id, Authentication authentication) {
        User pharmacist = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(prescriptionService.approvePrescription(id, pharmacist.getId()));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<PrescriptionDTO> reject(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        User pharmacist = userRepository.findByEmail(authentication.getName()).orElseThrow();
        String reason = body.getOrDefault("reason", "");
        return ResponseEntity.ok(prescriptionService.rejectPrescription(id, pharmacist.getId(), reason));
    }
}
