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

INSERT INTO medicines (name, description, price, stock_quantity, requires_prescription, category_id, image_url, url, is_active) VALUES

-- Antibiotics
('Amoxicillin 500mg', 'Broad-spectrum antibiotic for bacterial infections', 85.00, 150, true, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI_M1Fix66WGzQpL8AlOTIb7gaoN-GPLOLKaf3rQkY1A&s=10', 'amoxicillin-500mg', true),
('Azithromycin 250mg', 'Antibiotic for respiratory and skin infections', 120.00, 100, true, 1, 'https://loremflickr.com/300/200/medicine,pill?lock=5714', 'azithromycin-250mg', true),
('Ciprofloxacin 500mg', 'Antibiotic for urinary and gut infections', 95.00, 120, true, 1, 'https://loremflickr.com/300/200/medicine,pill?lock=2420', 'ciprofloxacin-500mg', true),
('Doxycycline 100mg', 'Antibiotic for chest and skin infections', 75.00, 90, true, 1, 'https://loremflickr.com/300/200/medicine,pill?lock=4016', 'doxycycline-100mg', true),

-- Pain Relief
('Paracetamol 500mg', 'Common painkiller and fever reducer', 25.00, 500, false, 2, 'https://loremflickr.com/300/200/medicine,pill?lock=5706', 'paracetamol-500mg', true),
('Ibuprofen 400mg', 'Anti-inflammatory pain reliever', 35.00, 400, false, 2, 'https://loremflickr.com/300/200/medicine,pill?lock=2364', 'ibuprofen-400mg', true),
('Diclofenac 50mg', 'NSAID for joint and muscle pain', 45.00, 200, false, 2, 'https://loremflickr.com/300/200/medicine,pill?lock=8795', 'diclofenac-50mg', true),
('Aspirin 75mg', 'Low-dose aspirin for pain and heart protection', 30.00, 350, false, 2, 'https://loremflickr.com/300/200/medicine,pill?lock=3164', 'aspirin-75mg', true),
('Tramadol 50mg', 'Strong painkiller for moderate to severe pain', 110.00, 80, true, 2, 'https://loremflickr.com/300/200/medicine,pill?lock=9989', 'tramadol-50mg', true),

-- Vitamins & Supplements
('Vitamin C 500mg', 'Immunity booster and antioxidant supplement', 60.00, 300, false, 3, 'https://loremflickr.com/300/200/medicine,pill?lock=7332', 'vitamin-c-500mg', true),
('Vitamin D3 1000IU', 'Bone health and immunity supplement', 90.00, 250, false, 3, 'https://loremflickr.com/300/200/medicine,pill?lock=7566', 'vitamin-d3-1000iu', true),
('Vitamin B Complex', 'Complete B-vitamin supplement for energy', 75.00, 200, false, 3, 'https://loremflickr.com/300/200/medicine,pill?lock=6292', 'vitamin-b-complex', true),
('Omega-3 Fish Oil', 'Heart and brain health supplement', 180.00, 150, false, 3, 'https://loremflickr.com/300/200/medicine,pill?lock=4179', 'omega-3-fish-oil', true),
('Calcium + D3 Tablet', 'Bone strength and calcium supplement', 95.00, 180, false, 3, 'https://loremflickr.com/300/200/medicine,pill?lock=8178', 'calcium-d3-tablet', true),
('Iron + Folic Acid', 'Anemia prevention supplement', 50.00, 220, false, 3, 'https://loremflickr.com/300/200/medicine,pill?lock=3773', 'iron-folic-acid', true),

-- Diabetes Care
('Metformin 500mg', 'First-line medicine for Type 2 diabetes', 40.00, 300, true, 4, 'https://loremflickr.com/300/200/medicine,pill?lock=6724', 'metformin-500mg', true),
('Glimepiride 2mg', 'Oral medicine to control blood sugar', 65.00, 150, true, 4, 'https://loremflickr.com/300/200/medicine,pill?lock=6137', 'glimepiride-2mg', true),
('Januvia 100mg', 'DPP-4 inhibitor for blood sugar control', 380.00, 80, true, 4, 'https://loremflickr.com/300/200/medicine,pill?lock=1323', 'januvia-100mg', true),
('Insulin Glargine', 'Long-acting insulin for diabetes management', 650.00, 50, true, 4, 'https://loremflickr.com/300/200/medicine,pill?lock=8933', 'insulin-glargine', true),
('Glucometer Strips', 'Blood sugar testing strips (50 pcs)', 250.00, 200, false, 4, 'https://loremflickr.com/300/200/medicine,pill?lock=2350', 'glucometer-strips', true),

-- Heart & BP
('Amlodipine 5mg', 'Calcium channel blocker for high blood pressure', 55.00, 200, true, 5, 'https://loremflickr.com/300/200/medicine,pill?lock=6173', 'amlodipine-5mg', true),
('Atorvastatin 10mg', 'Statin medicine for cholesterol control', 85.00, 180, true, 5, 'https://loremflickr.com/300/200/medicine,pill?lock=8705', 'atorvastatin-10mg', true),
('Losartan 50mg', 'ARB medicine for hypertension', 70.00, 160, true, 5, 'https://loremflickr.com/300/200/medicine,pill?lock=7317', 'losartan-50mg', true),
('Metoprolol 25mg', 'Beta-blocker for heart rate and BP control', 60.00, 140, true, 5, 'https://loremflickr.com/300/200/medicine,pill?lock=4222', 'metoprolol-25mg', true),
('Ramipril 5mg', 'ACE inhibitor for heart failure and BP', 90.00, 120, true, 5, 'https://loremflickr.com/300/200/medicine,pill?lock=9489', 'ramipril-5mg', true),

-- Cold & Flu
('Cetirizine 10mg', 'Antihistamine for allergy and cold symptoms', 20.00, 500, false, 6, 'https://loremflickr.com/300/200/medicine,pill?lock=5419', 'cetirizine-10mg', true),
('Dextromethorphan Syrup', 'Cough suppressant syrup 100ml', 65.00, 200, false, 6, 'https://loremflickr.com/300/200/medicine,pill?lock=6357', 'dextromethorphan-syrup', true),
('Loratadine 10mg', 'Non-drowsy antihistamine for allergies', 25.00, 400, false, 6, 'https://loremflickr.com/300/200/medicine,pill?lock=578', 'loratadine-10mg', true),
('Phenylephrine 10mg', 'Nasal decongestant for stuffy nose', 30.00, 300, false, 6, 'https://loremflickr.com/300/200/medicine,pill?lock=5278', 'phenylephrine-10mg', true),
('Oseltamivir 75mg', 'Antiviral medicine for influenza', 450.00, 60, true, 6, 'https://loremflickr.com/300/200/medicine,pill?lock=6413', 'oseltamivir-75mg', true),

-- Skin Care
('Betamethasone Cream', 'Steroid cream for skin inflammation', 75.00, 150, true, 7, 'https://loremflickr.com/300/200/medicine,pill?lock=1270', 'betamethasone-cream', true),
('Clotrimazole Cream', 'Antifungal cream for skin fungal infections', 55.00, 200, false, 7, 'https://loremflickr.com/300/200/medicine,pill?lock=1433', 'clotrimazole-cream', true),
('Mupirocin Ointment', 'Antibiotic ointment for skin infections', 85.00, 120, true, 7, 'https://loremflickr.com/300/200/medicine,pill?lock=8924', 'mupirocin-ointment', true),
('Calamine Lotion', 'Soothing lotion for itching and rashes', 40.00, 250, false, 7, 'https://loremflickr.com/300/200/medicine,pill?lock=3761', 'calamine-lotion', true),
('Ketoconazole Shampoo', 'Antifungal shampoo for dandruff', 120.00, 180, false, 7, 'https://loremflickr.com/300/200/medicine,pill?lock=5407', 'ketoconazole-shampoo', true),

-- Digestive Health
('Omeprazole 20mg', 'Proton pump inhibitor for acidity and ulcers', 45.00, 350, false, 8, 'https://loremflickr.com/300/200/medicine,pill?lock=4462', 'omeprazole-20mg', true),
('Pantoprazole 40mg', 'PPI for GERD and stomach acid', 55.00, 300, false, 8, 'https://loremflickr.com/300/200/medicine,pill?lock=2721', 'pantoprazole-40mg', true),
('ORS Powder', 'Oral rehydration salts for dehydration', 15.00, 500, false, 8, 'https://loremflickr.com/300/200/medicine,pill?lock=1767', 'ors-powder', true),
('Loperamide 2mg', 'Anti-diarrheal medicine', 30.00, 250, false, 8, 'https://loremflickr.com/300/200/medicine,pill?lock=9456', 'loperamide-2mg', true),
('Lactulose Syrup', 'Laxative for constipation relief', 85.00, 150, false, 8, 'https://loremflickr.com/300/200/medicine,pill?lock=2235', 'lactulose-syrup', true),
('Metoclopramide 10mg', 'Anti-nausea and vomiting medicine', 35.00, 200, true, 8, 'https://loremflickr.com/300/200/medicine,pill?lock=4080', 'metoclopramide-10mg', true);
