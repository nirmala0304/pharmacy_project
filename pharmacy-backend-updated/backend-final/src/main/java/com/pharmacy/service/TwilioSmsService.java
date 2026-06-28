package com.pharmacy.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioSmsService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-number}")
    private String fromNumber;

    @Value("${twilio.enabled:false}")
    private boolean twilioEnabled;

    @PostConstruct
    public void init() {
        if (twilioEnabled) {
            Twilio.init(accountSid, authToken);
            System.out.println("✅ Twilio SMS initialized — from: " + fromNumber);
        } else {
            System.out.println("⚠️  Twilio SMS is DISABLED. Set twilio.enabled=true in application.properties to send real SMS.");
        }
    }

    public void sendSms(String toPhone, String message) {
        if (!twilioEnabled) {
            System.out.println("📱 [SMS DISABLED - Would have sent to " + normalizePhone(toPhone) + "]: " + message);
            return;
        }

        try {
            String normalized = normalizePhone(toPhone);
            Message.creator(
                new PhoneNumber(normalized),
                new PhoneNumber(fromNumber),
                message
            ).create();
            System.out.println("✅ SMS sent to " + normalized);
        } catch (Exception e) {
            System.err.println("❌ SMS failed to " + toPhone + ": " + e.getMessage());
        }
    }

    // Fix: properly normalize phone without double ++
    private String normalizePhone(String phone) {
        // Remove all non-digit characters
        String digits = phone.replaceAll("\\D", "");

        // Already full international format: 919585816139 (12 digits with 91)
        if (digits.startsWith("91") && digits.length() == 12) return "+" + digits;

        // Plain 10-digit Indian number: 9585816139
        if (digits.length() == 10) return "+91" + digits;

        // Already has + prefix like +919585816139 — return as-is
        if (phone.startsWith("+")) return phone;

        return "+" + digits;
    }
}
