package com.pharmacy.controller;

import com.pharmacy.dto.MedicineDTO;
import com.pharmacy.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @GetMapping
    public ResponseEntity<List<MedicineDTO>> getAllMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {

        if (search != null && !search.isBlank() && categoryId != null) {
            return ResponseEntity.ok(medicineService.searchMedicinesInCategory(search, categoryId));
        }
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(medicineService.searchMedicines(search));
        }
        if (categoryId != null) {
            return ResponseEntity.ok(medicineService.getMedicinesByCategory(categoryId));
        }
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineDTO> getMedicineById(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<MedicineDTO> createMedicine(@RequestBody MedicineDTO dto) {
        return ResponseEntity.ok(medicineService.createMedicine(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<MedicineDTO> updateMedicine(@PathVariable Long id, @RequestBody MedicineDTO dto) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok("Medicine deactivated.");
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<MedicineDTO> uploadMedicineImage(@PathVariable Long id,
                                                            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(medicineService.uploadMedicineImage(id, file));
    }
}
