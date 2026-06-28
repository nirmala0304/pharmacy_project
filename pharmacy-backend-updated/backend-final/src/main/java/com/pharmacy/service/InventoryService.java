package com.pharmacy.service;

import com.pharmacy.dto.MedicineDTO;
import com.pharmacy.entity.Inventory;
import com.pharmacy.entity.Medicine;
import com.pharmacy.entity.User;
import com.pharmacy.repository.InventoryRepository;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineService medicineService;

    public Map<String, Object> getAlerts() {
        List<MedicineDTO> lowStock = medicineService.getLowStockMedicines();
        List<MedicineDTO> expiring30 = medicineService.getExpiringMedicines(30);
        List<MedicineDTO> expiring7 = medicineService.getExpiringMedicines(7);

        Map<String, Object> alerts = new HashMap<>();
        alerts.put("lowStock", lowStock);
        alerts.put("expiringSoon", expiring30);
        alerts.put("expiringCritical", expiring7);
        alerts.put("lowStockCount", lowStock.size());
        alerts.put("expiringSoonCount", expiring30.size());
        return alerts;
    }

    public void restockMedicine(Long medicineId, Integer quantity, Long pharmacistId, String notes) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        User pharmacist = userRepository.findById(pharmacistId).orElseThrow();

        int before = medicine.getStockQuantity();
        medicine.setStockQuantity(before + quantity);
        medicineRepository.save(medicine);

        Inventory log = new Inventory();
        log.setMedicine(medicine);
        log.setActionType(Inventory.ActionType.RESTOCK);
        log.setQuantityChanged(quantity);
        log.setQuantityAfter(medicine.getStockQuantity());
        log.setNotes(notes);
        log.setPerformedBy(pharmacist);
        inventoryRepository.save(log);
    }

    public List<Map<String, Object>> getInventoryLogs(Long medicineId) {
        return inventoryRepository.findByMedicineIdOrderByCreatedAtDesc(medicineId)
                .stream().map(log -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", log.getId());
                    map.put("actionType", log.getActionType());
                    map.put("quantityChanged", log.getQuantityChanged());
                    map.put("quantityAfter", log.getQuantityAfter());
                    map.put("notes", log.getNotes());
                    map.put("createdAt", log.getCreatedAt());
                    if (log.getPerformedBy() != null) {
                        map.put("performedBy", log.getPerformedBy().getName());
                    }
                    return map;
                }).collect(Collectors.toList());
    }

    // Run every day at 8 AM - log alert summary
    @Scheduled(cron = "0 0 8 * * *")
    public void dailyAlertCheck() {
        List<Medicine> lowStock = medicineRepository.findLowStockMedicines();
        List<Medicine> expiring = medicineRepository.findExpiringMedicines(LocalDate.now().plusDays(30));
        System.out.println("[ALERT] Low stock medicines: " + lowStock.size());
        System.out.println("[ALERT] Expiring within 30 days: " + expiring.size());
    }
}
