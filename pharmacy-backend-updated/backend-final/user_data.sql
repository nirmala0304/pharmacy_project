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

INSERT INTO medicines (name, description, price, stock_quantity, requires_prescription, category_id, image_url) VALUES

-- Antibiotics
('Amoxicillin 500mg', 'Broad-spectrum antibiotic for bacterial infections', 85.00, 150, true, 1, 'https://placehold.co/300x200?text=Amoxicillin%20500mg'),
('Azithromycin 250mg', 'Antibiotic for respiratory and skin infections', 120.00, 100, true, 1, 'https://placehold.co/300x200?text=Azithromycin%20250mg'),
('Ciprofloxacin 500mg', 'Antibiotic for urinary and gut infections', 95.00, 120, true, 1, 'https://placehold.co/300x200?text=Ciprofloxacin%20500mg'),
('Doxycycline 100mg', 'Antibiotic for chest and skin infections', 75.00, 90, true, 1, 'https://placehold.co/300x200?text=Doxycycline%20100mg'),

-- Pain Relief
('Paracetamol 500mg', 'Common painkiller and fever reducer', 25.00, 500, false, 2, 'https://placehold.co/300x200?text=Paracetamol%20500mg'),
('Ibuprofen 400mg', 'Anti-inflammatory pain reliever', 35.00, 400, false, 2, 'https://placehold.co/300x200?text=Ibuprofen%20400mg'),
('Diclofenac 50mg', 'NSAID for joint and muscle pain', 45.00, 200, false, 2, 'https://placehold.co/300x200?text=Diclofenac%2050mg'),
('Aspirin 75mg', 'Low-dose aspirin for pain and heart protection', 30.00, 350, false, 2, 'https://placehold.co/300x200?text=Aspirin%2075mg'),
('Tramadol 50mg', 'Strong painkiller for moderate to severe pain', 110.00, 80, true, 2, 'https://placehold.co/300x200?text=Tramadol%2050mg'),

-- Vitamins & Supplements
('Vitamin C 500mg', 'Immunity booster and antioxidant supplement', 60.00, 300, false, 3, 'https://placehold.co/300x200?text=Vitamin%20C%20500mg'),
('Vitamin D3 1000IU', 'Bone health and immunity supplement', 90.00, 250, false, 3, 'https://placehold.co/300x200?text=Vitamin%20D3%201000IU'),
('Vitamin B Complex', 'Complete B-vitamin supplement for energy', 75.00, 200, false, 3, 'https://placehold.co/300x200?text=Vitamin%20B%20Complex'),
('Omega-3 Fish Oil', 'Heart and brain health supplement', 180.00, 150, false, 3, 'https://placehold.co/300x200?text=Omega-3%20Fish%20Oil'),
('Calcium + D3 Tablet', 'Bone strength and calcium supplement', 95.00, 180, false, 3, 'https://placehold.co/300x200?text=Calcium%20%2B%20D3%20Tablet'),
('Iron + Folic Acid', 'Anemia prevention supplement', 50.00, 220, false, 3, 'https://placehold.co/300x200?text=Iron%20%2B%20Folic%20Acid'),

-- Diabetes Care
('Metformin 500mg', 'First-line medicine for Type 2 diabetes', 40.00, 300, true, 4, 'https://placehold.co/300x200?text=Metformin%20500mg'),
('Glimepiride 2mg', 'Oral medicine to control blood sugar', 65.00, 150, true, 4, 'https://placehold.co/300x200?text=Glimepiride%202mg'),
('Januvia 100mg', 'DPP-4 inhibitor for blood sugar control', 380.00, 80, true, 4, 'https://placehold.co/300x200?text=Januvia%20100mg'),
('Insulin Glargine', 'Long-acting insulin for diabetes management', 650.00, 50, true, 4, 'https://placehold.co/300x200?text=Insulin%20Glargine'),
('Glucometer Strips', 'Blood sugar testing strips (50 pcs)', 250.00, 200, false, 4, 'https://placehold.co/300x200?text=Glucometer%20Strips'),

-- Heart & BP
('Amlodipine 5mg', 'Calcium channel blocker for high blood pressure', 55.00, 200, true, 5, 'https://placehold.co/300x200?text=Amlodipine%205mg'),
('Atorvastatin 10mg', 'Statin medicine for cholesterol control', 85.00, 180, true, 5, 'https://placehold.co/300x200?text=Atorvastatin%2010mg'),
('Losartan 50mg', 'ARB medicine for hypertension', 70.00, 160, true, 5, 'https://placehold.co/300x200?text=Losartan%2050mg'),
('Metoprolol 25mg', 'Beta-blocker for heart rate and BP control', 60.00, 140, true, 5, 'https://placehold.co/300x200?text=Metoprolol%2025mg'),
('Ramipril 5mg', 'ACE inhibitor for heart failure and BP', 90.00, 120, true, 5, 'https://placehold.co/300x200?text=Ramipril%205mg'),

-- Cold & Flu
('Cetirizine 10mg', 'Antihistamine for allergy and cold symptoms', 20.00, 500, false, 6, 'https://placehold.co/300x200?text=Cetirizine%2010mg'),
('Dextromethorphan Syrup', 'Cough suppressant syrup 100ml', 65.00, 200, false, 6, 'https://placehold.co/300x200?text=Dextromethorphan%20Syrup'),
('Loratadine 10mg', 'Non-drowsy antihistamine for allergies', 25.00, 400, false, 6, 'https://placehold.co/300x200?text=Loratadine%2010mg'),
('Phenylephrine 10mg', 'Nasal decongestant for stuffy nose', 30.00, 300, false, 6, 'https://placehold.co/300x200?text=Phenylephrine%2010mg'),
('Oseltamivir 75mg', 'Antiviral medicine for influenza', 450.00, 60, true, 6, 'https://placehold.co/300x200?text=Oseltamivir%2075mg'),

-- Skin Care
('Betamethasone Cream', 'Steroid cream for skin inflammation', 75.00, 150, true, 7, 'https://placehold.co/300x200?text=Betamethasone%20Cream'),
('Clotrimazole Cream', 'Antifungal cream for skin fungal infections', 55.00, 200, false, 7, 'https://placehold.co/300x200?text=Clotrimazole%20Cream'),
('Mupirocin Ointment', 'Antibiotic ointment for skin infections', 85.00, 120, true, 7, 'https://placehold.co/300x200?text=Mupirocin%20Ointment'),
('Calamine Lotion', 'Soothing lotion for itching and rashes', 40.00, 250, false, 7, 'https://placehold.co/300x200?text=Calamine%20Lotion'),
('Ketoconazole Shampoo', 'Antifungal shampoo for dandruff', 120.00, 180, false, 7, 'https://placehold.co/300x200?text=Ketoconazole%20Shampoo'),

-- Digestive Health
('Omeprazole 20mg', 'Proton pump inhibitor for acidity and ulcers', 45.00, 350, false, 8, 'https://placehold.co/300x200?text=Omeprazole%2020mg'),
('Pantoprazole 40mg', 'PPI for GERD and stomach acid', 55.00, 300, false, 8, 'https://placehold.co/300x200?text=Pantoprazole%2040mg'),
('ORS Powder', 'Oral rehydration salts for dehydration', 15.00, 500, false, 8, 'https://placehold.co/300x200?text=ORS%20Powder'),
('Loperamide 2mg', 'Anti-diarrheal medicine', 30.00, 250, false, 8, 'https://placehold.co/300x200?text=Loperamide%202mg'),
('Lactulose Syrup', 'Laxative for constipation relief', 85.00, 150, false, 8, 'https://placehold.co/300x200?text=Lactulose%20Syrup'),
('Metoclopramide 10mg', 'Anti-nausea and vomiting medicine', 35.00, 200, true, 8, 'https://placehold.co/300x200?text=Metoclopramide%2010mg');
