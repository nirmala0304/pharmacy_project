package com.pharmacy.dto;

import java.time.LocalDateTime;

public class ContactInquiryDTO {

    private Long id;
    private String referenceId;
    private String inquiryType;      // "CONTACT" | "MEDICINE_INQUIRY"
    private String name;
    private String email;
    private String phone;
    private String subject;
    private String message;
    private boolean preferCallback;
    private String callbackTime;
    private String preferredContact;
    private String status;
    private String urgency;
    private String pharmacistNote;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ── Getters & Setters ──
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInquiryType() { return inquiryType; }
    public void setInquiryType(String inquiryType) { this.inquiryType = inquiryType; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isPreferCallback() { return preferCallback; }
    public void setPreferCallback(boolean preferCallback) { this.preferCallback = preferCallback; }

    public String getCallbackTime() { return callbackTime; }
    public void setCallbackTime(String callbackTime) { this.callbackTime = callbackTime; }

    public String getPreferredContact() { return preferredContact; }
    public void setPreferredContact(String preferredContact) { this.preferredContact = preferredContact; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getPharmacistNote() { return pharmacistNote; }
    public void setPharmacistNote(String pharmacistNote) { this.pharmacistNote = pharmacistNote; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
