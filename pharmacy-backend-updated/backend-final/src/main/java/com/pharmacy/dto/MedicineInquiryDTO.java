package com.pharmacy.dto;

import java.time.LocalDateTime;

public class MedicineInquiryDTO {

    private Long id;
    private String referenceId;
    private String medicineName;
    private Long medicineId;
    private String dosage;
    private Integer quantity;
    private boolean alternatesOk;
    private String additionalNotes;
    private String name;
    private String email;
    private String phone;
    private boolean requestCallback;
    private String callbackTime;
    private String preferredContact;
    private String urgency;
    private String status;
    private String pharmacistNote;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ── Getters & Setters ──
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public Long getMedicineId() { return medicineId; }
    public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public boolean isAlternatesOk() { return alternatesOk; }
    public void setAlternatesOk(boolean alternatesOk) { this.alternatesOk = alternatesOk; }

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public boolean isRequestCallback() { return requestCallback; }
    public void setRequestCallback(boolean requestCallback) { this.requestCallback = requestCallback; }

    public String getCallbackTime() { return callbackTime; }
    public void setCallbackTime(String callbackTime) { this.callbackTime = callbackTime; }

    public String getPreferredContact() { return preferredContact; }
    public void setPreferredContact(String preferredContact) { this.preferredContact = preferredContact; }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPharmacistNote() { return pharmacistNote; }
    public void setPharmacistNote(String pharmacistNote) { this.pharmacistNote = pharmacistNote; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
