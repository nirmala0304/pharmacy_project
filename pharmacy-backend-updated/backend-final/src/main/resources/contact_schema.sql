-- ═══════════════════════════════════════════════════════════════════
-- PharmaCare — Contact & Inquiry Tables
-- These are auto-created by Hibernate (ddl-auto=update).
-- Run this manually ONLY if you need to pre-create or inspect.
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS contact_inquiries (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    inquiry_type      ENUM('CONTACT','MEDICINE_INQUIRY') NOT NULL DEFAULT 'CONTACT',
    name              VARCHAR(255) NOT NULL,
    email             VARCHAR(255) NOT NULL,
    phone             VARCHAR(50),
    subject           VARCHAR(500),
    message           TEXT,
    prefer_callback   TINYINT(1) NOT NULL DEFAULT 0,
    callback_time     VARCHAR(100),
    preferred_contact VARCHAR(20),          -- CALL | WHATSAPP | EMAIL
    status            ENUM('NEW','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'NEW',
    urgency           ENUM('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'MEDIUM',
    pharmacist_note   TEXT,
    user_id           BIGINT,               -- FK to users (nullable)
    created_at        DATETIME NOT NULL,
    updated_at        DATETIME,
    CONSTRAINT fk_ci_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_ci_status    (status),
    INDEX idx_ci_urgency   (urgency),
    INDEX idx_ci_callback  (prefer_callback),
    INDEX idx_ci_created   (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS medicine_inquiries (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_name     VARCHAR(255) NOT NULL,
    medicine_id       BIGINT,               -- FK to medicines (nullable)
    dosage            VARCHAR(100),
    quantity          INT NOT NULL DEFAULT 1,
    alternatives_ok   TINYINT(1) NOT NULL DEFAULT 1,
    additional_notes  TEXT,
    name              VARCHAR(255) NOT NULL,
    email             VARCHAR(255) NOT NULL,
    phone             VARCHAR(50),
    request_callback  TINYINT(1) NOT NULL DEFAULT 0,
    callback_time     VARCHAR(100),
    preferred_contact VARCHAR(20),          -- CALL | WHATSAPP | EMAIL
    urgency           ENUM('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'MEDIUM',
    status            ENUM('NEW','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'NEW',
    pharmacist_note   TEXT,
    user_id           BIGINT,               -- FK to users (nullable)
    created_at        DATETIME NOT NULL,
    updated_at        DATETIME,
    CONSTRAINT fk_mi_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE SET NULL,
    CONSTRAINT fk_mi_user     FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE SET NULL,
    INDEX idx_mi_status    (status),
    INDEX idx_mi_urgency   (urgency),
    INDEX idx_mi_callback  (request_callback),
    INDEX idx_mi_created   (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
