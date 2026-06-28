TRUNCATE TABLE categories RESTART IDENTITY CASCADE;
TRUNCATE TABLE medicines RESTART IDENTITY CASCADE;

INSERT INTO categories (name, description) VALUES
('Antibiotics', 'Medicines that kill or inhibit bacteria'),
('Pain Relief', 'Analgesics and anti-inflammatory medicines'),
('Vitamins & Supplements', 'Nutritional supplements and vitamins'),
('Diabetes Care', 'Medicines for blood sugar management'),
('Heart & BP', 'Cardiovascular and blood pressure medicines'),
('Cold & Flu', 'Medicines for cold, cough and fever'),
('Skin Care', 'Dermatological medicines and creams'),
('Digestive Health', 'Medicines for stomach and digestion');

INSERT INTO medicines (name, description, price, stock_quantity, requires_prescription, category_id) VALUES

-- Antibiotics
('Amoxicillin 500mg', 'Broad-spectrum antibiotic for bacterial infections', 85.00, 150, true, 1),
('Azithromycin 250mg', 'Antibiotic for respiratory and skin infections', 120.00, 100, true, 1),
('Ciprofloxacin 500mg', 'Antibiotic for urinary and gut infections', 95.00, 120, true, 1),
('Doxycycline 100mg', 'Antibiotic for chest and skin infections', 75.00, 90, true, 1),

-- Pain Relief
('Paracetamol 500mg', 'Common painkiller and fever reducer', 25.00, 500, false, 2),
('Ibuprofen 400mg', 'Anti-inflammatory pain reliever', 35.00, 400, false, 2),
('Diclofenac 50mg', 'NSAID for joint and muscle pain', 45.00, 200, false, 2),
('Aspirin 75mg', 'Low-dose aspirin for pain and heart protection', 30.00, 350, false, 2),
('Tramadol 50mg', 'Strong painkiller for moderate to severe pain', 110.00, 80, true, 2),

-- Vitamins & Supplements
('Vitamin C 500mg', 'Immunity booster and antioxidant supplement', 60.00, 300, false, 3),
('Vitamin D3 1000IU', 'Bone health and immunity supplement', 90.00, 250, false, 3),
('Vitamin B Complex', 'Complete B-vitamin supplement for energy', 75.00, 200, false, 3),
('Omega-3 Fish Oil', 'Heart and brain health supplement', 180.00, 150, false, 3),
('Calcium + D3 Tablet', 'Bone strength and calcium supplement', 95.00, 180, false, 3),
('Iron + Folic Acid', 'Anemia prevention supplement', 50.00, 220, false, 3),

-- Diabetes Care
('Metformin 500mg', 'First-line medicine for Type 2 diabetes', 40.00, 300, true, 4),
('Glimepiride 2mg', 'Oral medicine to control blood sugar', 65.00, 150, true, 4),
('Januvia 100mg', 'DPP-4 inhibitor for blood sugar control', 380.00, 80, true, 4),
('Insulin Glargine', 'Long-acting insulin for diabetes management', 650.00, 50, true, 4),
('Glucometer Strips', 'Blood sugar testing strips (50 pcs)', 250.00, 200, false, 4),

-- Heart & BP
('Amlodipine 5mg', 'Calcium channel blocker for high blood pressure', 55.00, 200, true, 5),
('Atorvastatin 10mg', 'Statin medicine for cholesterol control', 85.00, 180, true, 5),
('Losartan 50mg', 'ARB medicine for hypertension', 70.00, 160, true, 5),
('Metoprolol 25mg', 'Beta-blocker for heart rate and BP control', 60.00, 140, true, 5),
('Ramipril 5mg', 'ACE inhibitor for heart failure and BP', 90.00, 120, true, 5),

-- Cold & Flu
('Cetirizine 10mg', 'Antihistamine for allergy and cold symptoms', 20.00, 500, false, 6),
('Dextromethorphan Syrup', 'Cough suppressant syrup 100ml', 65.00, 200, false, 6),
('Loratadine 10mg', 'Non-drowsy antihistamine for allergies', 25.00, 400, false, 6),
('Phenylephrine 10mg', 'Nasal decongestant for stuffy nose', 30.00, 300, false, 6),
('Oseltamivir 75mg', 'Antiviral medicine for influenza', 450.00, 60, true, 6),

-- Skin Care
('Betamethasone Cream', 'Steroid cream for skin inflammation', 75.00, 150, true, 7),
('Clotrimazole Cream', 'Antifungal cream for skin fungal infections', 55.00, 200, false, 7),
('Mupirocin Ointment', 'Antibiotic ointment for skin infections', 85.00, 120, true, 7),
('Calamine Lotion', 'Soothing lotion for itching and rashes', 40.00, 250, false, 7),
('Ketoconazole Shampoo', 'Antifungal shampoo for dandruff', 120.00, 180, false, 7),

-- Digestive Health
('Omeprazole 20mg', 'Proton pump inhibitor for acidity and ulcers', 45.00, 350, false, 8),
('Pantoprazole 40mg', 'PPI for GERD and stomach acid', 55.00, 300, false, 8),
('ORS Powder', 'Oral rehydration salts for dehydration', 15.00, 500, false, 8),
('Loperamide 2mg', 'Anti-diarrheal medicine', 30.00, 250, false, 8),
('Lactulose Syrup', 'Laxative for constipation relief', 85.00, 150, false, 8),
('Metoclopramide 10mg', 'Anti-nausea and vomiting medicine', 35.00, 200, true, 8);
