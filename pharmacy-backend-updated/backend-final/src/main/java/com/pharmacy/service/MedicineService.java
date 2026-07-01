package com.pharmacy.service;

import com.pharmacy.dto.MedicineDTO;
import com.pharmacy.entity.Category;
import com.pharmacy.entity.Medicine;
import com.pharmacy.repository.CategoryRepository;
import com.pharmacy.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Value("${file.medicine-image-dir:uploads/medicines}")
    private String medicineImageDir;

    private static final List<String> ALLOWED_IMAGE_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp"
    );
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = List.of(
            ".jpg", ".jpeg", ".png", ".webp"
    );

    public List<MedicineDTO> getAllMedicines() {
        return medicineRepository.findByIsActiveTrue()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<MedicineDTO> searchMedicines(String keyword) {
        return medicineRepository.searchMedicines(keyword)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<MedicineDTO> getMedicinesByCategory(Long categoryId) {
        return medicineRepository.findByCategoryIdAndIsActiveTrue(categoryId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<MedicineDTO> searchMedicinesInCategory(String keyword, Long categoryId) {
        return medicineRepository.searchMedicinesInCategory(keyword, categoryId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MedicineDTO getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        return toDTO(medicine);
    }

    public MedicineDTO createMedicine(MedicineDTO dto) {
        Medicine medicine = fromDTO(dto);
        return toDTO(medicineRepository.save(medicine));
    }

    public MedicineDTO updateMedicine(Long id, MedicineDTO dto) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        medicine.setName(dto.getName());
        medicine.setBrand(dto.getBrand());
        medicine.setDescription(dto.getDescription());
        medicine.setDosage(dto.getDosage());
        medicine.setPrice(dto.getPrice());
        medicine.setDiscountPercentage(dto.getDiscountPercentage());
        medicine.setDiscountPrice(dto.getDiscountPrice());
        medicine.setStockQuantity(dto.getStockQuantity());
        medicine.setMinStockLevel(dto.getMinStockLevel());
        medicine.setExpiryDate(dto.getExpiryDate());
        medicine.setRequiresPrescription(dto.isRequiresPrescription());
        medicine.setActive(dto.isActive());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            medicine.setCategory(category);
        }
        return toDTO(medicineRepository.save(medicine));
    }

    public void deleteMedicine(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        medicine.setActive(false);
        medicineRepository.save(medicine);
    }

    public List<MedicineDTO> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<MedicineDTO> getExpiringMedicines(int daysAhead) {
        LocalDate thresholdDate = LocalDate.now().plusDays(daysAhead);
        return medicineRepository.findExpiringMedicines(thresholdDate)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MedicineDTO uploadMedicineImage(Long id, MultipartFile file) throws IOException {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new RuntimeException("Invalid file type. Only JPEG, PNG, and WebP images are allowed.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String lowerName = originalFilename.toLowerCase();
            boolean validExt = ALLOWED_IMAGE_EXTENSIONS.stream().anyMatch(lowerName::endsWith);
            if (!validExt) {
                throw new RuntimeException("Invalid file extension. Only .jpg, .jpeg, .png, and .webp are allowed.");
            }
        }

        Path uploadPath = Paths.get(medicineImageDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = UUID.randomUUID() + "_" + originalFilename;
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        medicine.setImageUrl("/uploads/medicines/" + filename);
        return toDTO(medicineRepository.save(medicine));
    }

    public MedicineDTO toDTO(Medicine m) {
        MedicineDTO dto = new MedicineDTO();
        dto.setId(m.getId());
        dto.setName(m.getName());
        dto.setBrand(m.getBrand());
        dto.setDescription(m.getDescription());
        dto.setDosage(m.getDosage());
        dto.setPrice(m.getPrice());
        dto.setDiscountPercentage(m.getDiscountPercentage());
        dto.setDiscountPrice(m.getDiscountPrice());
        dto.setStockQuantity(m.getStockQuantity());
        dto.setMinStockLevel(m.getMinStockLevel());
        dto.setExpiryDate(m.getExpiryDate());
        dto.setRequiresPrescription(m.isRequiresPrescription());
        dto.setImageUrl(m.getImageUrl());
        dto.setUrl(m.getUrl());
        dto.setActive(m.isActive());
        if (m.getCategory() != null) {
            dto.setCategoryId(m.getCategory().getId());
            dto.setCategoryName(m.getCategory().getName());
        }
        return dto;
    }

    private Medicine fromDTO(MedicineDTO dto) {
        Medicine medicine = new Medicine();
        medicine.setName(dto.getName());
        medicine.setBrand(dto.getBrand());
        medicine.setDescription(dto.getDescription());
        medicine.setDosage(dto.getDosage());
        medicine.setPrice(dto.getPrice());
        medicine.setDiscountPercentage(dto.getDiscountPercentage() != null ? dto.getDiscountPercentage() : java.math.BigDecimal.ZERO);
        medicine.setDiscountPrice(dto.getDiscountPrice());
        medicine.setStockQuantity(dto.getStockQuantity());
        medicine.setExpiryDate(dto.getExpiryDate());
        medicine.setRequiresPrescription(dto.isRequiresPrescription());
        medicine.setImageUrl(dto.getImageUrl());
        medicine.setUrl(dto.getUrl());
        medicine.setActive(true);
        if (dto.getCategoryId() != null) {
            categoryRepository.findById(dto.getCategoryId()).ifPresent(medicine::setCategory);
        }
        return medicine;
    }
}
