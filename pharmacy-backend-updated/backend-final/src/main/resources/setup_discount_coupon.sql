-- ═══════════════════════════════════════════════════════════════════
-- PharmaCare — Discount & Coupon Setup SQL
-- Run each block ONE AT A TIME in MySQL Workbench
-- Skip any ALTER TABLE that gives "Duplicate column name" error
-- ═══════════════════════════════════════════════════════════════════

USE pharmacy_db;

-- BLOCK 1: medicines discount columns (skip if duplicate column error)
ALTER TABLE medicines ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0;
ALTER TABLE medicines ADD COLUMN discount_price DECIMAL(10,2) NULL;

-- BLOCK 2: carts coupon column (skip if duplicate column error)
ALTER TABLE carts ADD COLUMN applied_coupon_code VARCHAR(50) NULL;

-- BLOCK 3: orders discount columns (skip if duplicate column error)
ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN applied_coupon_code VARCHAR(50) NULL;

-- BLOCK 4: Create coupons table
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

-- BLOCK 5: Insert sample coupons
INSERT IGNORE INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount_amount, expiry_date, is_active, description) VALUES
('HEALTH30', 'PERCENTAGE', 30, 499,  300,  '2026-12-31', 1, '30% OFF on orders above 499'),
('FLAT50',   'FIXED',      50, 300,  NULL, '2026-12-31', 1, 'Flat 50 OFF on orders above 300'),
('NEWUSER',  'PERCENTAGE', 15, 0,    100,  '2026-12-31', 1, '15% OFF for new users'),
('PHARMA20', 'PERCENTAGE', 20, 200,  200,  '2026-12-31', 1, '20% OFF on orders above 200'),
('SAVE100',  'FIXED',      100, 999, NULL, '2026-12-31', 1, 'Flat 100 OFF on orders above 999');

-- VERIFY
SELECT code, discount_type, discount_value, min_order_amount, is_active FROM coupons;
