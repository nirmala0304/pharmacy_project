package com.pharmacy.service;

import com.pharmacy.dto.PrescriptionDTO;
import com.pharmacy.entity.Prescription;
import com.pharmacy.entity.User;
import com.pharmacy.repository.PrescriptionRepository;
import com.pharmacy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"
    );
    private static final List<String> ALLOWED_EXTENSIONS = List.of(
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"
    );

    public PrescriptionDTO uploadPrescription(Long userId, MultipartFile file,
                                               String doctorName, String patientName, String notes) throws IOException {
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new RuntimeException("Invalid file type. Only images (JPEG, PNG, GIF, WebP) and PDF are allowed.");
        }

        // Validate file extension as secondary check
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String lowerName = originalFilename.toLowerCase();
            boolean validExt = ALLOWED_EXTENSIONS.stream().anyMatch(lowerName::endsWith);
            if (!validExt) {
                throw new RuntimeException("Invalid file extension. Only .jpg, .jpeg, .png, .gif, .webp, and .pdf are allowed.");
            }
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Prescription prescription = new Prescription();
        prescription.setUser(user);
        prescription.setImagePath(filename);
        prescription.setDoctorName(doctorName);
        prescription.setPatientName(patientName);
        prescription.setNotes(notes);

        return toDTO(prescriptionRepository.save(prescription));
    }

    public List<PrescriptionDTO> getPrescriptionsByUser(Long userId) {
        return prescriptionRepository.findByUserIdOrderByUploadedAtDesc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PrescriptionDTO> getAllPrescriptions() {
        return prescriptionRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PrescriptionDTO> getPendingPrescriptions() {
        return prescriptionRepository.findByStatus(Prescription.Status.PENDING)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PrescriptionDTO approvePrescription(Long prescriptionId, Long pharmacistId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        User pharmacist = userRepository.findById(pharmacistId).orElseThrow();

        prescription.setStatus(Prescription.Status.APPROVED);
        prescription.setReviewedBy(pharmacist);
        prescription.setReviewedAt(LocalDateTime.now());
        return toDTO(prescriptionRepository.save(prescription));
    }

    public PrescriptionDTO rejectPrescription(Long prescriptionId, Long pharmacistId, String reason) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        User pharmacist = userRepository.findById(pharmacistId).orElseThrow();

        prescription.setStatus(Prescription.Status.REJECTED);
        prescription.setReviewedBy(pharmacist);
        prescription.setReviewedAt(LocalDateTime.now());
        prescription.setRejectionReason(reason);
        return toDTO(prescriptionRepository.save(prescription));
    }

    public PrescriptionDTO toDTO(Prescription p) {
        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setId(p.getId());
        dto.setUserId(p.getUser().getId());
        dto.setUserName(p.getUser().getName());
        dto.setImagePath("/uploads/prescriptions/" + p.getImagePath());
        dto.setDoctorName(p.getDoctorName());
        dto.setPatientName(p.getPatientName());
        dto.setNotes(p.getNotes());
        dto.setStatus(p.getStatus().name());
        dto.setUploadedAt(p.getUploadedAt());
        dto.setReviewedAt(p.getReviewedAt());
        dto.setRejectionReason(p.getRejectionReason());
        return dto;
    }
}
