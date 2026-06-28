package com.pharmacy.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_inquiries")
public class ContactInquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "inquiry_type", nullable = false)
    private InquiryType inquiryType;

    // ── Caller / submitter details ──
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String message;

    // ── Callback preferences ──
    @Column(name = "prefer_callback")
    private boolean preferCallback;

    @Column(name = "callback_time")
    private String callbackTime;

    @Column(name = "preferred_contact")
    private String preferredContact;   // CALL | WHATSAPP | EMAIL

    // ── Status & pharmacist response ──
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.NEW;

    @Column(name = "pharmacist_note", columnDefinition = "TEXT")
    private String pharmacistNote;

    // ── Optional link to registered user ──
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Urgency for medicine inquiries ──
    @Enumerated(EnumType.STRING)
    private Urgency urgency = Urgency.MEDIUM;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum InquiryType {
        CONTACT,          // general contact form
        MEDICINE_INQUIRY  // medicine availability request
    }

    public enum Status {
        NEW, IN_PROGRESS, RESOLVED, CLOSED
    }

    public enum Urgency {
        LOW, MEDIUM, HIGH
    }

    // ── Getters & Setters ──
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public InquiryType getInquiryType() { return inquiryType; }
    public void setInquiryType(InquiryType inquiryType) { this.inquiryType = inquiryType; }

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

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getPharmacistNote() { return pharmacistNote; }
    public void setPharmacistNote(String pharmacistNote) { this.pharmacistNote = pharmacistNote; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Urgency getUrgency() { return urgency; }
    public void setUrgency(Urgency urgency) { this.urgency = urgency; }
}
