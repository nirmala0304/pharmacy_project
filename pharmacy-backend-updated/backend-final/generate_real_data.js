const fs = require('fs');

const categories = [
    { name: 'Pain Relief', prefix: ['Ibuprofen', 'Acetaminophen', 'Aspirin', 'Naproxen', 'Diclofenac'], suffix: ['Extra Strength', 'Plus', 'Rapid Release', 'Max', 'Forte'] },
    { name: 'Allergy', prefix: ['Cetirizine', 'Loratadine', 'Fexofenadine', 'Diphenhydramine', 'Levocetirizine'], suffix: ['Non-Drowsy', '24HR', 'Relief', 'Clear', 'D'] },
    { name: 'Cold & Cough', prefix: ['Dextromethorphan', 'Guaifenesin', 'Pseudoephedrine', 'Phenylephrine', 'Promethazine'], suffix: ['DM', 'Expectorant', 'Syrup', 'Cold & Flu', 'Nighttime'] },
    { name: 'Digestive Health', prefix: ['Omeprazole', 'Lansoprazole', 'Ranitidine', 'Famotidine', 'Pantoprazole'], suffix: ['Acid Reducer', 'Gas Relief', 'Probiotic', 'Enzymes', 'Care'] },
    { name: 'First Aid', prefix: ['Neosporin', 'Polysporin', 'Hydrogen Peroxide', 'Povidone-Iodine', 'Bacitracin'], suffix: ['Ointment', 'Cream', 'Spray', 'Antiseptic', 'Bandages'] },
    { name: 'Skin Care', prefix: ['Hydrocortisone', 'Clotrimazole', 'Salicylic Acid', 'Benzoyl Peroxide', 'Calamine'], suffix: ['Lotion', 'Gel', 'Wash', 'Cream', 'Treatment'] },
    { name: 'Eye Care', prefix: ['Brimonidine', 'Timolol', 'Latanoprost', 'Ketorolac', 'Hypromellose'], suffix: ['Eye Drops', 'Tears', 'Solution', 'Lubricant', 'Relief'] },
    { name: 'Vitamins & Supplements', prefix: ['Vitamin C', 'Vitamin D3', 'Multivitamin', 'Omega-3', 'Magnesium'], suffix: ['Gummies', 'Tablets', 'Softgels', 'Complex', 'Forte'] },
    { name: 'Heart Health', prefix: ['Atorvastatin', 'Rosuvastatin', 'Amlodipine', 'Lisinopril', 'Losartan'], suffix: ['10mg', '20mg', '40mg', 'HCTZ', 'ER'] },
    { name: 'Diabetes Care', prefix: ['Metformin', 'Glipizide', 'Sitagliptin', 'Empagliflozin', 'Insulin Glargine'], suffix: ['500mg', '1000mg', 'XR', 'Pen', 'Vial'] }
];

const getLockId = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 10000;
};

let sql = '';

sql += 'TRUNCATE TABLE categories CASCADE;\n';
sql += 'TRUNCATE TABLE medicines CASCADE;\n';
sql += 'TRUNCATE TABLE coupons CASCADE;\n';
sql += '\n';

// Insert coupons
sql += `INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount_amount, expiry_date, is_active, description) VALUES
('HEALTH30', 'PERCENTAGE', 30, 499,  300,  '2026-12-31', true, '30% OFF on orders above 499'),
('FLAT50',   'FIXED',      50, 300,  NULL, '2026-12-31', true, 'Flat 50 OFF on orders above 300'),
('NEWUSER',  'PERCENTAGE', 15, 0,    100,  '2026-12-31', true, '15% OFF for new users'),
('PHARMA20', 'PERCENTAGE', 20, 200,  200,  '2026-12-31', true, '20% OFF on orders above 200'),
('SAVE100',  'FIXED',      100, 999, NULL, '2026-12-31', true, 'Flat 100 OFF on orders above 999');\n\n`;

// Insert categories
categories.forEach(cat => {
    sql += `INSERT INTO categories (name, description) VALUES ('${cat.name}', 'Wide range of ${cat.name} products');\n`;
});

sql += '\n';

categories.forEach(cat => {
    for(let i = 1; i <= 50; i++) {
        let p = cat.prefix[Math.floor(Math.random() * cat.prefix.length)];
        let s = cat.suffix[Math.floor(Math.random() * cat.suffix.length)];
        let medName = `${p} ${s} Var-${i}`;
        let brand = `PharmaBrand ${Math.floor(Math.random() * 10) + 1}`;
        let price = (Math.random() * 40 + 2).toFixed(2);
        let stock = Math.floor(Math.random() * 300) + 20;
        let requiresPrescription = Math.random() > 0.7 ? 'true' : 'false';
        let lockId = getLockId(medName);
        
        sql += `INSERT INTO medicines (name, brand, description, dosage, price, stock_quantity, min_stock_level, expiry_date, requires_prescription, image_url, category_id, is_active, discount_percentage)
VALUES (
    '${medName}', '${brand}', 'Detailed description for ${medName}', '250mg', ${price}, ${stock}, 20, '2027-10-31', ${requiresPrescription}, 'https://loremflickr.com/300/200/medicine?lock=${lockId}', (SELECT id FROM categories WHERE name = '${cat.name}'), true, 0
);\n`;
    }
});

fs.writeFileSync('massive-real-data.sql', sql);
console.log('Successfully generated massive-real-data.sql');
