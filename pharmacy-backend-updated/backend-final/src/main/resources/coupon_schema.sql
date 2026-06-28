-- ═══════════════════════════════════════════════════════════════════
-- MediCare Pharmacy — Coupons Table
-- This table is auto-created by Hibernate (ddl-auto=update).
-- Run this manually ONLY if you need to pre-create, inspect, or seed sample data.
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS coupons (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    code                 VARCHAR(50) NOT NULL UNIQUE,
    discount_type        ENUM('PERCENTAGE','FIXED') NOT NULL,
    discount_value       DECIMAL(10,2) NOT NULL,
    min_order_amount     DECIMAL(10,2) DEFAULT 0,
    max_discount_amount  DECIMAL(10,2) NULL,
    expiry_date          DATE NULL,
    is_active            TINYINT(1) NOT NULL DEFAULT 1,
    description          VARCHAR(255)
);

-- Sample coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount_amount, expiry_date, is_active, description) VALUES
('HEALTH30', 'PERCENTAGE', 30, 499, 300, '2026-12-31', 1, 'Up to 30% OFF on orders above ₹499'),
('FLAT50',   'FIXED',      50, 300, NULL, '2026-12-31', 1, 'Flat ₹50 OFF on orders above ₹300'),
('NEWUSER',  'PERCENTAGE', 15, 0,   100,  '2026-12-31', 1, '15% OFF for new users (max ₹100)');

-- ═══════════════════════════════════════════════════════════════════
-- Carts table — add the applied_coupon_code column
-- (auto-added by Hibernate ddl-auto=update; run manually only if needed)
-- ═══════════════════════════════════════════════════════════════════
-- ALTER TABLE carts ADD COLUMN applied_coupon_code VARCHAR(50) NULL;
