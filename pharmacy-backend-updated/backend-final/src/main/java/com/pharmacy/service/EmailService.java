package com.pharmacy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

    /**
     * Optional — Spring only creates a JavaMailSender bean when spring.mail.host
     * is configured. Marking this required=false lets the application context
     * start even when no SMTP server is set up (e.g. local dev), and we
     * gracefully skip sending email instead of failing the whole app.
     */
    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${pharmacy.email:support@medicarepharmacy.example}")
    private String pharmacyEmail;

    @Value("${pharmacy.name:MediCare Pharmacy}")
    private String pharmacyName;

    @Value("${pharmacy.phone:1800-PHARMA}")
    private String pharmacyPhone;

    @Value("${pharmacy.whatsapp:https://wa.me/919876543210}")
    private String pharmacyWhatsApp;

    // ──────────────────────────────────────────────
    //  1. Confirmation to CUSTOMER after submission
    // ──────────────────────────────────────────────
    @Async
    public void sendCustomerConfirmation(String toEmail, String customerName,
                                          String referenceId, String inquiryType,
                                          boolean callbackRequested, String callbackTime,
                                          String preferredContact) {
        try {
            String callbackLine = callbackRequested
                ? "<p style='margin:0 0 8px'><strong>Callback:</strong> A pharmacist will contact you via "
                    + preferredContact + (callbackTime != null && !callbackTime.isEmpty() ? " — " + callbackTime : " — As soon as possible") + "</p>"
                : "";

            String html = "<!DOCTYPE html><html><body style='margin:0;padding:0;background:#f0f4f7;font-family:DM Sans,Arial,sans-serif'>"
                + "<div style='max-width:540px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.09)'>"
                // Header
                + "<div style='background:linear-gradient(135deg,#064e3b,#0f9e6e,#17b5a0);padding:36px 32px;text-align:center'>"
                + "<div style='display:inline-block;width:52px;height:52px;background:rgba(255,255,255,0.18);border-radius:12px;line-height:52px;font-size:24px;margin-bottom:12px'>💊</div>"
                + "<h1 style='margin:0;color:#fff;font-size:22px;font-weight:800'>" + pharmacyName + "</h1>"
                + "<p style='margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px'>Inquiry Confirmation</p>"
                + "</div>"
                // Body
                + "<div style='padding:32px'>"
                + "<h2 style='margin:0 0 8px;color:#0d1b2a;font-size:20px'>Hi " + customerName + " 👋</h2>"
                + "<p style='color:#3a4e60;margin:0 0 20px;font-size:15px;line-height:1.6'>We've received your <strong>" + inquiryType + "</strong> and our pharmacist team is already on it.</p>"
                // Ref box
                + "<div style='background:#f0f4f7;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;border:1.5px dashed #c8d4df'>"
                + "<div style='font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#6b7f91;margin-bottom:6px'>Your Reference ID</div>"
                + "<div style='font-size:28px;font-weight:800;color:#0f9e6e;letter-spacing:0.08em'>" + referenceId + "</div>"
                + "<div style='font-size:12px;color:#9db0bf;margin-top:4px'>Keep this for tracking your inquiry</div>"
                + "</div>"
                // What happens next
                + "<div style='background:#e6f7f2;border-radius:12px;padding:20px;margin-bottom:24px'>"
                + "<h3 style='margin:0 0 14px;color:#064e3b;font-size:14px;font-weight:700'>✅ What Happens Next</h3>"
                + "<div style='display:flex;align-items:flex-start;gap:10px;margin-bottom:10px'>"
                + "<div style='width:28px;height:28px;background:#0f9e6e;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-size:12px;font-weight:700'>1</div>"
                + "<p style='margin:0;color:#3a4e60;font-size:13px;line-height:1.5;padding-top:5px'>Your inquiry has been saved and assigned to a pharmacist.</p>"
                + "</div>"
                + callbackLine
                + "<div style='display:flex;align-items:flex-start;gap:10px;margin-bottom:10px'>"
                + "<div style='width:28px;height:28px;background:#0f9e6e;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-size:12px;font-weight:700'>2</div>"
                + "<p style='margin:0;color:#3a4e60;font-size:13px;line-height:1.5;padding-top:5px'>You'll receive a detailed response by email within <strong>2 hours</strong>.</p>"
                + "</div>"
                + "<div style='display:flex;align-items:flex-start;gap:10px'>"
                + "<div style='width:28px;height:28px;background:#0f9e6e;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-size:12px;font-weight:700'>3</div>"
                + "<p style='margin:0;color:#3a4e60;font-size:13px;line-height:1.5;padding-top:5px'>If it's a medicine inquiry, we'll confirm availability and pricing.</p>"
                + "</div>"
                + "</div>"
                // Contact row
                + "<div style='text-align:center;padding:16px 0;border-top:1px solid #dde4eb'>"
                + "<p style='margin:0 0 8px;color:#6b7f91;font-size:12px'>Need immediate help?</p>"
                + "<a href='tel:" + pharmacyPhone.replaceAll("[^+0-9]", "") + "' style='display:inline-block;background:#0f9e6e;color:#fff;text-decoration:none;border-radius:50px;padding:10px 24px;font-size:13px;font-weight:700;margin:0 4px'>\ud83d\udcde " + pharmacyPhone + "</a>"
                + "<a href='" + pharmacyWhatsApp + "' style='display:inline-block;background:#25D366;color:#fff;text-decoration:none;border-radius:50px;padding:10px 24px;font-size:13px;font-weight:700;margin:0 4px'>💬 WhatsApp</a>"
                + "</div>"
                + "</div>"
                // Footer
                + "<div style='background:#f0f4f7;padding:16px 24px;text-align:center'>"
                + "<p style='margin:0;color:#9db0bf;font-size:11px'>" + pharmacyName + " · Your Trusted Online Pharmacy · <a href='mailto:" + pharmacyEmail + "' style='color:#0f9e6e;text-decoration:none'>" + pharmacyEmail + "</a></p>"
                + "</div>"
                + "</div></body></html>";

            sendHtml(toEmail, "✅ Inquiry Received — Ref: " + referenceId + " | " + pharmacyName, html);
        } catch (Exception e) {
            System.err.println("[EmailService] Customer confirmation failed: " + e.getMessage());
        }
    }

    // ──────────────────────────────────────────────
    //  2. Alert to PHARMACIST when new inquiry arrives
    // ──────────────────────────────────────────────
    @Async
    public void sendPharmacistAlert(String customerName, String customerEmail,
                                     String customerPhone, String referenceId,
                                     String inquiryType, String urgency,
                                     String details, boolean callbackRequested,
                                     String callbackTime, String preferredContact) {
        try {
            String urgencyColor = "HIGH".equals(urgency) ? "#ef4444"
                                : "MEDIUM".equals(urgency) ? "#f59e0b"
                                : "#6b7f91";
            String urgencyLabel = "HIGH".equals(urgency) ? "🔴 URGENT"
                                : "MEDIUM".equals(urgency) ? "🟡 Medium"
                                : "🟢 Low";

            String callbackBadge = callbackRequested
                ? "<div style='display:inline-block;background:#e6f7f2;color:#064e3b;border:1.5px solid #c2eadb;border-radius:50px;padding:6px 16px;font-size:12px;font-weight:700;margin-top:8px'>📞 CALLBACK REQUESTED — " + (callbackTime != null && !callbackTime.isEmpty() ? callbackTime : "ASAP") + " via " + preferredContact + "</div>"
                : "";

            String html = "<!DOCTYPE html><html><body style='margin:0;padding:0;background:#f0f4f7;font-family:Arial,sans-serif'>"
                + "<div style='max-width:580px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)'>"
                // Alert header
                + "<div style='background:" + urgencyColor + ";padding:20px 28px;display:flex;align-items:center;gap:12px'>"
                + "<div style='font-size:28px'>🔔</div>"
                + "<div><h2 style='margin:0;color:#fff;font-size:18px;font-weight:800'>New " + inquiryType + "</h2>"
                + "<p style='margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px'>" + urgencyLabel + " — Ref: " + referenceId + "</p></div>"
                + "</div>"
                // Body
                + "<div style='padding:24px 28px'>"
                + callbackBadge
                // Customer info
                + "<div style='background:#f8fafb;border-radius:12px;padding:16px;margin:" + (callbackRequested ? "16px" : "0") + " 0 16px'>"
                + "<h3 style='margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7f91'>Customer</h3>"
                + "<p style='margin:0 0 6px;font-size:15px;font-weight:700;color:#0d1b2a'>" + customerName + "</p>"
                + "<a href='mailto:" + customerEmail + "' style='color:#0f9e6e;font-size:13px;text-decoration:none'>✉ " + customerEmail + "</a><br>"
                + (customerPhone != null && !customerPhone.isEmpty()
                    ? "<a href='tel:" + customerPhone + "' style='color:#0f9e6e;font-size:13px;text-decoration:none'>📞 " + customerPhone + "</a>"
                    : "<span style='color:#9db0bf;font-size:12px'>No phone provided</span>")
                + "</div>"
                // Details
                + "<div style='background:#f8fafb;border-radius:12px;padding:16px;margin-bottom:20px'>"
                + "<h3 style='margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7f91'>Details</h3>"
                + "<p style='margin:0;color:#3a4e60;font-size:14px;line-height:1.65;white-space:pre-wrap'>" + details + "</p>"
                + "</div>"
                // Actions
                + "<div style='display:flex;gap:10px;flex-wrap:wrap'>"
                + "<a href='mailto:" + customerEmail + "' style='flex:1;min-width:120px;text-align:center;background:#0f9e6e;color:#fff;text-decoration:none;border-radius:50px;padding:11px 16px;font-size:13px;font-weight:700'>✉ Reply by Email</a>"
                + (customerPhone != null && !customerPhone.isEmpty()
                    ? "<a href='tel:" + customerPhone + "' style='flex:1;min-width:120px;text-align:center;background:#e6f7f2;color:#064e3b;text-decoration:none;border-radius:50px;padding:11px 16px;font-size:13px;font-weight:700;border:1.5px solid #c2eadb'>📞 Call Customer</a>"
                    : "")
                + "</div>"
                + "</div>"
                // Footer
                + "<div style='background:#f0f4f7;padding:14px 24px;text-align:center'>"
                + "<p style='margin:0;color:#9db0bf;font-size:11px'>" + pharmacyName + " Pharmacist Dashboard \u00b7 Log in to manage: <a href='" + frontendUrl + "/pharmacist/inquiries' style='color:#0f9e6e'>View Inquiries</a></p>"
                + "</div>"
                + "</div></body></html>";

            sendHtml(pharmacyEmail, "🔔 New " + inquiryType + " [" + urgencyLabel + "] — " + customerName, html);
        } catch (Exception e) {
            System.err.println("[EmailService] Pharmacist alert failed: " + e.getMessage());
        }
    }

    @Value("${pharmacy.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    // ──────────────────────────────────────────────
    //  Internal helper
    // ──────────────────────────────────────────────
    private void sendHtml(String to, String subject, String html) throws MessagingException, UnsupportedEncodingException {
        if (mailSender == null) {
            System.out.println("[EmailService] Mail not configured (spring.mail.host unset) — skipping email to " + to + ": " + subject);
            return;
        }
        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
        helper.setFrom(pharmacyEmail, pharmacyName);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);
        mailSender.send(msg);
    }
}
