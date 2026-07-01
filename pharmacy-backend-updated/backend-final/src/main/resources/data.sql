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
('Azithromycin 250mg', 'Antibiotic for respiratory and skin infections', 120.00, 100, true, 1, 'https://images.apollo247.in/pub/media/catalog/product/A/Z/AZI0919_1_1.jpg', 'azithromycin-250mg', true),
('Ciprofloxacin 500mg', 'Antibiotic for urinary and gut infections', 95.00, 120, true, 1, 'https://www.dailychemist.com/wp-content/uploads/2020/03/Ciprofloxacin-500mg-Tablets.jpg', 'ciprofloxacin-500mg', true),
('Doxycycline 100mg', 'Antibiotic for chest and skin infections', 75.00, 90, true, 1, 'https://res.cloudinary.com/oxford-online-pharmacy/image/upload/f_auto,w_1200/doxycycline-100mg-capsule-50-sovereign.jpg', 'doxycycline-100mg', true),

-- Pain Relief
('Paracetamol 500mg', 'Common painkiller and fever reducer', 25.00, 500, false, 2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgleZYUEX0cRCKJqOFrW_GDFgk3H24WIgBDvwKYEk6zg&s=10', 'paracetamol-500mg', true),
('Ibuprofen 400mg', 'Anti-inflammatory pain reliever', 35.00, 400, false, 2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM4FXIScpgHR3Vfj8TY251er6L3YnrjoTMNogKdhyJ6g&s=10', 'ibuprofen-400mg', true),
('Diclofenac 50mg', 'NSAID for joint and muscle pain', 45.00, 200, false, 2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb3XGqWrbSptbSYSj7K5Azx5iD1pzf6L-hzyQFFgUnCw&s=10', 'diclofenac-50mg', true),
('Aspirin 75mg', 'Low-dose aspirin for pain and heart protection', 30.00, 350, false, 2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdTkCV4a8UiaKK2X9UxjJI3v5a65hqbFEGEuoaVSTdpQ&s=10', 'aspirin-75mg', true),
('Tramadol 50mg', 'Strong painkiller for moderate to severe pain', 110.00, 80, true, 2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa0H9qxCGjKaTEF-q4kgmMqdY6Uw7Dsxw0zmGrU1gXqg&s=10', 'tramadol-50mg', true),

-- Vitamins & Supplements
('Vitamin C 500mg', 'Immunity booster and antioxidant supplement', 60.00, 300, false, 3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuygI-pfPRr5Sl6QhIcKvS5k5Pw4c0Wtrku7LlbYejIQ&s=10', 'vitamin-c-500mg', true),
('Vitamin D3 1000IU', 'Bone health and immunity supplement', 90.00, 250, false, 3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-mCNShwndTflbZ4txisPg-TASxvzENR255YskOORNoQ&s=10', 'vitamin-d3-1000iu', true),
('Vitamin B Complex', 'Complete B-vitamin supplement for energy', 75.00, 200, false, 3, 'https://tiimg.tistatic.com/fp/1/007/690/kanvid-vitamin-b-complex-comprimes-tablets-260.jpg', 'vitamin-b-complex', true),
('Omega-3 Fish Oil', 'Heart and brain health supplement', 180.00, 150, false, 3, 'https://www.davisco.in/images/omega-3-fish-oil-a.jpg', 'omega-3-fish-oil', true),
('Calcium + D3 Tablet', 'Bone strength and calcium supplement', 95.00, 180, false, 3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzMD4-WkhEwKywbLH-q0Si2aDO7tAHUh3EMeg4fmxKEw&s=10', 'calcium-d3-tablet', true),
('Iron + Folic Acid', 'Anemia prevention supplement', 50.00, 220, false, 3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREeV154cEf7Rx-cj7isY-mlkF8fPMUkS7egRGuXc7Erg&s=10', 'iron-folic-acid', true),

-- Diabetes Care
('Metformin 500mg', 'First-line medicine for Type 2 diabetes', 40.00, 300, true, 4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV2yhKc9KW7EZSLSLmWvhjSKKou_CaENhSmxK8j_x-OQ&s=10', 'metformin-500mg', true),
('Glimepiride 2mg', 'Oral medicine to control blood sugar', 65.00, 150, true, 4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUei0xP31ANPRE82GQf15Df7GS0BrImQF2sSMIJLV_ig&s', 'glimepiride-2mg', true),
('Januvia 100mg', 'DPP-4 inhibitor for blood sugar control', 380.00, 80, true, 4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN-JrpcaXQnkwgIDzkoVY4MTmChmAofj-DSbA_OwvHwQ&s', 'januvia-100mg', true),
('Insulin Glargine', 'Long-acting insulin for diabetes management', 650.00, 50, true, 4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg_XXg4aEebO8fmlg2_yQKJnb8k1GuKaW5FA56FNuWHg&s=10', 'insulin-glargine', true),
('Glucometer Strips', 'Blood sugar testing strips (50 pcs)', 250.00, 200, false, 4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmq7AIakHMHyAfETCjin6LCAewuohqJm240TJwq_JMpg&s=10', 'glucometer-strips', true),

-- Heart & BP
('Amlodipine 5mg', 'Calcium channel blocker for high blood pressure', 55.00, 200, true, 5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-PhnJ758GGautlvgsg0eRNopSP8hH3xF2sCtaywg_Jg&s=10', 'amlodipine-5mg', true),
('Atorvastatin 10mg', 'Statin medicine for cholesterol control', 85.00, 180, true, 5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIy3gZsys69Hh3D9-_yY4wH7XevbhCIGN9LLFfAfp62A&s=10', 'atorvastatin-10mg', true),
('Losartan 50mg', 'ARB medicine for hypertension', 70.00, 160, true, 5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT54X1Jz87nJ8VOqmi4cuAATxmIv6RinzvYEV3ccUGL2A&s=10', 'losartan-50mg', true),
('Metoprolol 25mg', 'Beta-blocker for heart rate and BP control', 60.00, 140, true, 5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCGE0Pmyvkr3M3rMd8zmxTaK8_OXs57yPAJe6bqlCbyQ&s=10', 'metoprolol-25mg', true),
('Ramipril 5mg', 'ACE inhibitor for heart failure and BP', 90.00, 120, true, 5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF_Ry9ffG3A9Jceh0NIVwpynYTcUE2-_HzvfoPbl2HPw&s=10', 'ramipril-5mg', true),

-- Cold & Flu
('Cetirizine 10mg', 'Antihistamine for allergy and cold symptoms', 20.00, 500, false, 6, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnx-gf17EvwO9k8WIjZDKuS-rVmtK-OWBjUKnx3iqyHw&s=10', 'cetirizine-10mg', true),
('Dextromethorphan Syrup', 'Cough suppressant syrup 100ml', 65.00, 200, false, 6, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE4Ogm1du_bmsTAGZhJWxlg3mNIZCDWNfmtPxH2zfeGA&s=10', 'dextromethorphan-syrup', true),
('Loratadine 10mg', 'Non-drowsy antihistamine for allergies', 25.00, 400, false, 6, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9eXFIiV2vn0vD3MrPxJMbshfIcX0i7F-QzcA6N0iW8g&s=10', 'loratadine-10mg', true),
('Phenylephrine 10mg', 'Nasal decongestant for stuffy nose', 30.00, 300, false, 6, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHrp6KJH1SSVxEjH2NAip2mbZeAY8HmP_LPn6FYmZMPA&s=10', 'phenylephrine-10mg', true),
('Oseltamivir 75mg', 'Antiviral medicine for influenza', 450.00, 60, true, 6, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf_4rfd1Z7bdfT4e8Og9x4dXS7Y26LrhY9d1lhekvaow&s=10', 'oseltamivir-75mg', true),

-- Skin Care
('Betamethasone Cream', 'Steroid cream for skin inflammation', 75.00, 150, true, 7, 'https://5.imimg.com/data5/YY/LC/MY-8142050/betamethasone-cream.jpg', 'betamethasone-cream', true),
('Clotrimazole Cream', 'Antifungal cream for skin fungal infections', 55.00, 200, false, 7, 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/9a118fe610a84f6faa0759e420c12e1c.jpg', 'clotrimazole-cream', true),
('Mupirocin Ointment', 'Antibiotic ointment for skin infections', 85.00, 120, true, 7, 'https://images.apollo247.in/pub/media/catalog/product/M/U/MUP0018_1_1.jpg?tr=q-80,f-webp,w-400,dpr-3,c-at_max%20400w', 'mupirocin-ointment', true),
('Calamine Lotion', 'Soothing lotion for itching and rashes', 40.00, 250, false, 7, 'https://m.media-amazon.com/images/I/61LdpOpEpGL.jpg', 'calamine-lotion', true),
('Ketoconazole Shampoo', 'Antifungal shampoo for dandruff', 120.00, 180, false, 7, 'https://ecommerce.genericartmedicine.com/images/products/product-photo-455.jpg', 'ketoconazole-shampoo', true),

-- Digestive Health
('Omeprazole 20mg', 'Proton pump inhibitor for acidity and ulcers', 45.00, 350, false, 8, 'https://www.dailychemist.com/wp-content/uploads/2018/02/Omeprazole-20mg-Capsules.jpg', 'omeprazole-20mg', true),
('Pantoprazole 40mg', 'PPI for GERD and stomach acid', 55.00, 300, false, 8, 'https://5.imimg.com/data5/SELLER/Default/2023/9/341446323/AS/IY/SR/59547857/pantoprazole-40-mg-capsule.jpeg', 'pantoprazole-40mg', true),
('ORS Powder', 'Oral rehydration salts for dehydration', 15.00, 500, false, 8, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8A-lnUcc4D4ihhRTCi7j6r7ydbCuiFLjR-Qkl3XpnHBLKHqABTReYJy8i&s=10', 'ors-powder', true),
('Loperamide 2mg', 'Anti-diarrheal medicine', 30.00, 250, false, 8, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXV0nxBXMUsTbkVc_loY4qDanlCvQx8060hkAEHl5PhbADSkOl22Tp7SM&s=10', 'loperamide-2mg', true),
('Lactulose Syrup', 'Laxative for constipation relief', 85.00, 150, false, 8, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHyk1sCuZbCWd8YfAV48Wx7AE-bcKAELwO_SJFg9vHTuzSOHH16W5QKvde&s=10', 'lactulose-syrup', true),
('Metoclopramide 10mg', 'Anti-nausea and vomiting medicine', 35.00, 200, true, 8, 'https://5.imimg.com/data5/SELLER/Default/2024/5/418682318/KX/GN/NQ/3800001/metoclopramide-10-mg-tablets.jpeg', 'metoclopramide-10mg', true);
