package com.pharmacy.controller;

import com.pharmacy.entity.User;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.service.InventoryService;
import com.pharmacy.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacist")
@PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
public class PharmacistController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/inventory/alerts")
    public ResponseEntity<Map<String, Object>> getAlerts() {
        return ResponseEntity.ok(inventoryService.getAlerts());
    }

    @PostMapping("/inventory/restock")
    public ResponseEntity<?> restock(@RequestBody Map<String, Object> body, Authentication auth) {
        Long medicineId = Long.valueOf(body.get("medicineId").toString());
        Integer quantity = Integer.valueOf(body.get("quantity").toString());
        String notes = body.getOrDefault("notes", "").toString();
        User pharmacist = userRepository.findByEmail(auth.getName()).orElseThrow();
        inventoryService.restockMedicine(medicineId, quantity, pharmacist.getId(), notes);
        return ResponseEntity.ok("Restock successful.");
    }

    @GetMapping("/inventory/logs/{medicineId}")
    public ResponseEntity<List<Map<String, Object>>> getLogs(@PathVariable Long medicineId) {
        return ResponseEntity.ok(inventoryService.getInventoryLogs(medicineId));
    }
}
