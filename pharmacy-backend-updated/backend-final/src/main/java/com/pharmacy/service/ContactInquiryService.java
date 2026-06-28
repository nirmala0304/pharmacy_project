package com.pharmacy.service;

import com.pharmacy.dto.ContactInquiryDTO;
import com.pharmacy.dto.MedicineInquiryDTO;
import com.pharmacy.entity.ContactInquiry;
import com.pharmacy.entity.MedicineInquiry;
import com.pharmacy.repository.ContactInquiryRepository;
import com.pharmacy.repository.MedicineInquiryRepository;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ContactInquiryService {

    @Autowired private ContactInquiryRepository contactRepo;
    @Autowired private MedicineInquiryRepository medicineRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private MedicineRepository medicineRepository;
    @Autowired private EmailService emailService;

    private static final DateTimeFormatter REF_FMT = DateTimeFormatter.ofPattern("yyyyMMddHHmm");

    // ══════════════════════════════════════
    //  CONTACT INQUIRIES
    // ══════════════════════════════════════

    public ContactInquiryDTO createContactInquiry(Map<String, Object> body) {
        ContactInquiry entity = new ContactInquiry();
        entity.setInquiryType(ContactInquiry.InquiryType.CONTACT);
        entity.setName(str(body, "name"));
        entity.setEmail(str(body, "email"));
        entity.setPhone(str(body, "phone"));
        entity.setSubject(str(body, "subject"));
        entity.setMessage(str(body, "message"));
        entity.setPreferCallback(bool(body, "preferCallback"));
        entity.setCallbackTime(str(body, "callbackTime"));
        entity.setPreferredContact(str(body, "preferredContact"));

        String urgencyStr = str(body, "urgency");
        if (urgencyStr != null && !urgencyStr.isEmpty()) {
            try { entity.setUrgency(ContactInquiry.Urgency.valueOf(urgencyStr.toUpperCase())); }
            catch (Exception ignored) {}
        }

        Object userIdObj = body.get("userId");
        if (userIdObj != null) {
            try {
                Long userId = Long.valueOf(userIdObj.toString());
                userRepo.findById(userId).ifPresent(entity::setUser);
            } catch (Exception ignored) {}
        }

        ContactInquiry saved = contactRepo.save(entity);

        // ── Generate reference ID: CI-<id>-<timestamp> ──
        String refId = "CI-" + saved.getId() + "-" + saved.getCreatedAt().format(REF_FMT);
        String inquiryTypeLabel = str(body, "inquiryType") != null ? str(body, "inquiryType") : "General Inquiry";

        // Build details string for pharmacist email
        String details = "Subject: " + (saved.getSubject() != null ? saved.getSubject() : "—") + "\n"
                       + "Inquiry Type: " + inquiryTypeLabel + "\n\n"
                       + (saved.getMessage() != null ? saved.getMessage() : "");

        // ── Fire emails asynchronously ──
        emailService.sendCustomerConfirmation(
            saved.getEmail(), saved.getName(), refId, inquiryTypeLabel,
            saved.isPreferCallback(), saved.getCallbackTime(), saved.getPreferredContact()
        );
        emailService.sendPharmacistAlert(
            saved.getName(), saved.getEmail(), saved.getPhone(), refId,
            inquiryTypeLabel, saved.getUrgency().name(), details,
            saved.isPreferCallback(), saved.getCallbackTime(), saved.getPreferredContact()
        );

        return toDTO(saved, refId);
    }

    public List<ContactInquiryDTO> getAllContactInquiries() {
        return contactRepo.findAllByOrderByCreatedAtDesc()
                .stream().map(e -> toDTO(e, buildRefId("CI", e.getId(), e.getCreatedAt())))
                .collect(Collectors.toList());
    }

    public ContactInquiryDTO updateContactStatus(Long id, String status) {
        ContactInquiry entity = contactRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found: " + id));
        try { entity.setStatus(ContactInquiry.Status.valueOf(status.toUpperCase())); }
        catch (Exception e) { throw new RuntimeException("Invalid status: " + status); }
        return toDTO(contactRepo.save(entity), buildRefId("CI", entity.getId(), entity.getCreatedAt()));
    }

    public ContactInquiryDTO updateContactNote(Long id, String note) {
        ContactInquiry entity = contactRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found: " + id));
        entity.setPharmacistNote(note);
        return toDTO(contactRepo.save(entity), buildRefId("CI", entity.getId(), entity.getCreatedAt()));
    }

    // ══════════════════════════════════════
    //  MEDICINE INQUIRIES
    // ══════════════════════════════════════

    public MedicineInquiryDTO createMedicineInquiry(Map<String, Object> body) {
        MedicineInquiry entity = new MedicineInquiry();
        entity.setMedicineName(str(body, "medicineName"));
        entity.setDosage(str(body, "dosage"));

        Object qty = body.get("quantity");
        if (qty != null) {
            try { entity.setQuantity(Integer.valueOf(qty.toString())); }
            catch (Exception ignored) {}
        }

        entity.setAlternatesOk(bool(body, "alternatesOk"));
        entity.setAdditionalNotes(str(body, "additionalNotes"));
        entity.setName(str(body, "name"));
        entity.setEmail(str(body, "email"));
        entity.setPhone(str(body, "phone"));
        entity.setRequestCallback(bool(body, "requestCallback"));
        entity.setCallbackTime(str(body, "callbackTime"));
        entity.setPreferredContact(str(body, "preferredContact"));

        Object medIdObj = body.get("medicineId");
        if (medIdObj != null && !medIdObj.toString().isEmpty()) {
            try {
                Long medId = Long.valueOf(medIdObj.toString());
                medicineRepository.findById(medId).ifPresent(entity::setMedicine);
            } catch (Exception ignored) {}
        }

        String urgencyStr = str(body, "urgency");
        if (urgencyStr != null && !urgencyStr.isEmpty()) {
            try { entity.setUrgency(MedicineInquiry.Urgency.valueOf(urgencyStr.toUpperCase())); }
            catch (Exception ignored) {}
        }

        Object userIdObj = body.get("userId");
        if (userIdObj != null) {
            try {
                Long userId = Long.valueOf(userIdObj.toString());
                userRepo.findById(userId).ifPresent(entity::setUser);
            } catch (Exception ignored) {}
        }

        MedicineInquiry saved = medicineRepo.save(entity);

        // ── Generate reference ID ──
        String refId = "MI-" + saved.getId() + "-" + saved.getCreatedAt().format(REF_FMT);

        // Details string
        String details = "Medicine: " + saved.getMedicineName() + "\n"
                       + "Dosage: " + (saved.getDosage() != null ? saved.getDosage() : "—") + "\n"
                       + "Quantity: " + saved.getQuantity() + "\n"
                       + "Accepts Generics: " + (saved.isAlternatesOk() ? "Yes" : "No") + "\n"
                       + "Urgency: " + saved.getUrgency().name() + "\n"
                       + (saved.getAdditionalNotes() != null ? "\nNotes: " + saved.getAdditionalNotes() : "");

        // ── Fire emails asynchronously ──
        emailService.sendCustomerConfirmation(
            saved.getEmail(), saved.getName(), refId, "Medicine Availability Inquiry",
            saved.isRequestCallback(), saved.getCallbackTime(), saved.getPreferredContact()
        );
        emailService.sendPharmacistAlert(
            saved.getName(), saved.getEmail(), saved.getPhone(), refId,
            "Medicine Inquiry", saved.getUrgency().name(), details,
            saved.isRequestCallback(), saved.getCallbackTime(), saved.getPreferredContact()
        );

        return toMedDTO(saved, refId);
    }

    public List<MedicineInquiryDTO> getAllMedicineInquiries() {
        return medicineRepo.findAllByOrderByCreatedAtDesc()
                .stream().map(e -> toMedDTO(e, buildRefId("MI", e.getId(), e.getCreatedAt())))
                .collect(Collectors.toList());
    }

    public MedicineInquiryDTO updateMedicineStatus(Long id, String status) {
        MedicineInquiry entity = medicineRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found: " + id));
        try { entity.setStatus(MedicineInquiry.Status.valueOf(status.toUpperCase())); }
        catch (Exception e) { throw new RuntimeException("Invalid status: " + status); }
        return toMedDTO(medicineRepo.save(entity), buildRefId("MI", entity.getId(), entity.getCreatedAt()));
    }

    public MedicineInquiryDTO updateMedicineNote(Long id, String note) {
        MedicineInquiry entity = medicineRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found: " + id));
        entity.setPharmacistNote(note);
        return toMedDTO(medicineRepo.save(entity), buildRefId("MI", entity.getId(), entity.getCreatedAt()));
    }

    // ══════════════════════════════════════
    //  STATS
    // ══════════════════════════════════════

    public Map<String, Object> getInquiryStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalContact  = contactRepo.count();
        long totalMedicine = medicineRepo.count();
        long newContact    = contactRepo.findByStatusOrderByCreatedAtDesc(ContactInquiry.Status.NEW).size();
        long newMedicine   = medicineRepo.findByStatusOrderByCreatedAtDesc(MedicineInquiry.Status.NEW).size();
        long callbackC     = contactRepo.findByPreferCallbackTrueAndStatusNotOrderByCreatedAtDesc(ContactInquiry.Status.RESOLVED)
                               .stream().filter(i -> i.getStatus() != ContactInquiry.Status.CLOSED).count();
        long callbackM     = medicineRepo.findByRequestCallbackTrueAndStatusNotOrderByCreatedAtDesc(MedicineInquiry.Status.RESOLVED)
                               .stream().filter(i -> i.getStatus() != MedicineInquiry.Status.CLOSED).count();
        long urgentC       = contactRepo.findByUrgencyAndStatusOrderByCreatedAtDesc(ContactInquiry.Urgency.HIGH, ContactInquiry.Status.NEW).size();
        long urgentM       = medicineRepo.findByUrgencyAndStatusOrderByCreatedAtDesc(MedicineInquiry.Urgency.HIGH, MedicineInquiry.Status.NEW).size();
        long inProgressC   = contactRepo.findByStatusOrderByCreatedAtDesc(ContactInquiry.Status.IN_PROGRESS).size();
        long inProgressM   = medicineRepo.findByStatusOrderByCreatedAtDesc(MedicineInquiry.Status.IN_PROGRESS).size();

        stats.put("totalContact",  totalContact);
        stats.put("totalMedicine", totalMedicine);
        stats.put("total",         totalContact + totalMedicine);
        stats.put("new",           newContact + newMedicine);
        stats.put("callbacks",     callbackC + callbackM);
        stats.put("urgent",        urgentC + urgentM);
        stats.put("inProgress",    inProgressC + inProgressM);
        return stats;
    }

    // ══════════════════════════════════════
    //  MAPPERS
    // ══════════════════════════════════════

    private ContactInquiryDTO toDTO(ContactInquiry e, String refId) {
        ContactInquiryDTO dto = new ContactInquiryDTO();
        dto.setId(e.getId());
        dto.setReferenceId(refId);
        dto.setInquiryType(e.getInquiryType() != null ? e.getInquiryType().name() : "CONTACT");
        dto.setName(e.getName());
        dto.setEmail(e.getEmail());
        dto.setPhone(e.getPhone());
        dto.setSubject(e.getSubject());
        dto.setMessage(e.getMessage());
        dto.setPreferCallback(e.isPreferCallback());
        dto.setCallbackTime(e.getCallbackTime());
        dto.setPreferredContact(e.getPreferredContact());
        dto.setStatus(e.getStatus() != null ? e.getStatus().name() : "NEW");
        dto.setUrgency(e.getUrgency() != null ? e.getUrgency().name() : "MEDIUM");
        dto.setPharmacistNote(e.getPharmacistNote());
        dto.setUserId(e.getUser() != null ? e.getUser().getId() : null);
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }

    private MedicineInquiryDTO toMedDTO(MedicineInquiry e, String refId) {
        MedicineInquiryDTO dto = new MedicineInquiryDTO();
        dto.setId(e.getId());
        dto.setReferenceId(refId);
        dto.setMedicineName(e.getMedicineName());
        dto.setMedicineId(e.getMedicine() != null ? e.getMedicine().getId() : null);
        dto.setDosage(e.getDosage());
        dto.setQuantity(e.getQuantity());
        dto.setAlternatesOk(e.isAlternatesOk());
        dto.setAdditionalNotes(e.getAdditionalNotes());
        dto.setName(e.getName());
        dto.setEmail(e.getEmail());
        dto.setPhone(e.getPhone());
        dto.setRequestCallback(e.isRequestCallback());
        dto.setCallbackTime(e.getCallbackTime());
        dto.setPreferredContact(e.getPreferredContact());
        dto.setUrgency(e.getUrgency() != null ? e.getUrgency().name() : "MEDIUM");
        dto.setStatus(e.getStatus() != null ? e.getStatus().name() : "NEW");
        dto.setPharmacistNote(e.getPharmacistNote());
        dto.setUserId(e.getUser() != null ? e.getUser().getId() : null);
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }

    private String buildRefId(String prefix, Long id, java.time.LocalDateTime dt) {
        return prefix + "-" + id + "-" + (dt != null ? dt.format(REF_FMT) : "000000000000");
    }

    // ── Helpers ──
    private String str(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return (v != null && !v.toString().isBlank()) ? v.toString().trim() : null;
    }
    private boolean bool(Map<String, Object> m, String key) {
        Object v = m.get(key);
        if (v == null) return false;
        if (v instanceof Boolean) return (Boolean) v;
        return Boolean.parseBoolean(v.toString());
    }
}
