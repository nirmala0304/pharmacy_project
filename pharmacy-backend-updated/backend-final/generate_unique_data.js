const fs = require('fs');

const categoriesData = [
  {
    name: 'Pain Relief',
    items: ["Advil", "Tylenol", "Aleve", "Motrin", "Excedrin", "Bayer", "Panadol", "Voltaren", "Bufferin", "Midol", "Pamprin", "Aspercreme", "Icy Hot", "Salonpas", "Bengay", "Biofreeze", "Capzasin", "Tiger Balm", "Zostrix", "Percogesic", "Doans", "Hylands", "Anacin", "Ecotrin", "BC Powder", "Goodys", "Arthritis Pain", "Neurontin", "Lyrica", "Celebrex", "Mobic", "Naprosyn", "Toradol", "Tramadol", "Ultram", "Vicodin", "Percocet", "OxyContin", "Dilaudid", "Opana", "Nucynta", "Fentanyl", "Morphine", "Codeine", "Tylenol 3", "Tylenol 4", "Fioricet", "Imitrex", "Maxalt", "Zomig"]
  },
  {
    name: 'Allergy',
    items: ["Zyrtec", "Claritin", "Allegra", "Benadryl", "Xyzal", "Flonase", "Nasacort", "Rhinocort", "Nasonex", "Astepro", "Pataday", "Zaditor", "Alaway", "Visine A", "Opcon-A", "Naphcon-A", "Chlor-Trimeton", "Dimetapp", "Alavert", "Sudafed PE", "Zyrtec-D", "Claritin-D", "Allegra-D", "Mucinex Allergy", "Singulair", "EpiPen", "Auvi-Q", "Symbicort", "Advair", "Dulera", "Breo", "Qvar", "Flovent", "Pulmicort", "Asmanex", "Alvesco", "Spiriva", "Incruse", "Tudorza", "Seebri", "Atrovent", "Combivent", "Anoro", "Stiolto", "Trelegy", "Breztri", "Fasenra", "Nucala", "Xolair", "Cinqair"]
  },
  {
    name: 'Cold & Cough',
    items: ["DayQuil", "NyQuil", "Mucinex", "Robitussin", "Delsym", "Theraflu", "Coricidin", "Sudafed", "Afrin", "Sinex", "Zicam", "Airborne", "Emergen-C", "Cepacol", "Chloraseptic", "Halls", "Ricola", "Ludens", "Vicks VapoRub", "Vicks Sinex", "Mucinex DM", "Robitussin DM", "Delsym Adult", "Delsym Children", "Dimetapp Cold", "Hylands Cold", "Zarbees", "Sambucol", "Boiron", "Oscillococcinum", "Tylenol Cold", "Advil Cold", "Aleve Cold", "Alka-Seltzer Plus", "Contac", "Triaminic", "PediaCare", "Little Remedies", "Vicks BabyRub", "Zarbees Baby", "Zarbees Cough", "Hylands Cough", "Hylands Baby", "Boiron Chestal", "Chestal Honey", "Chestal Kids", "Mucinex Fast-Max", "Mucinex Sinus-Max", "Robitussin CF", "Delsym CF"]
  },
  {
    name: 'Digestive Health',
    items: ["Prilosec", "Nexium", "Prevacid", "Zantac", "Pepcid", "Tagamet", "Tums", "Rolaids", "Mylanta", "Maalox", "Gaviscon", "Pepto-Bismol", "Kaopectate", "Imodium", "Lomotil", "Gas-X", "Phazyme", "Beano", "Lactaid", "Align", "Culturelle", "Florastor", "Phillips", "Dulcolax", "Miralax", "Senokot", "Colace", "Fleet", "Benefiber", "Metamucil", "Citrucel", "FiberCon", "Konsyl", "Equalactin", "Amitiza", "Linzess", "Trulance", "Motegrity", "Zelnorm", "Viberzi", "Xifaxan", "Lotronex", "Entocort", "Uceris", "Lialda", "Asacol", "Pentasa", "Rowasa", "Canasa", "Azulfidine"]
  },
  {
    name: 'First Aid',
    items: ["Neosporin", "Polysporin", "Bacitracin", "Cortizone 10", "Benadryl Cream", "Caladryl", "Gold Bond", "Lotrimin", "Tinactin", "Lamisil", "Micatin", "Desenex", "FungiCure", "Kerasal", "Compound W", "Dr Scholls", "Nix", "Rid", "Band-Aid", "Nexcare", "Curad", "J&J", "Medline", "Dynarex", "3M", "Tegaderm", "Coban", "Ace", "Futuro", "Mueller", "McDavid", "DonJoy", "Breg", "Ossur", "Bauerfeind", "TheraBand", "Biofreeze", "Stopain", "Sarna", "Aveeno", "Cetaphil", "CeraVe", "Aquaphor", "Eucerin", "Vaseline", "Carmex", "Blistex", "ChapStick", "Neosporin Lip", "Abreva"]
  },
  {
    name: 'Skin Care',
    items: ["Proactiv", "Differin", "PanOxyl", "Clean & Clear", "Neutrogena", "Olay", "Cetaphil", "CeraVe", "Aveeno", "Eucerin", "Aquaphor", "Vaseline", "Lubriderm", "Jergens", "Nivea", "Gold Bond", "AmLactin", "Sarna", "Cortizone 10", "Benadryl Cream", "Caladryl", "Lotrimin", "Tinactin", "Lamisil", "Micatin", "Desenex", "FungiCure", "Kerasal", "Compound W", "Dr Scholls", "Nix", "Rid", "Abreva", "Carmex", "Blistex", "ChapStick", "Neosporin Lip", "OKeefe", "Flexitol", "Bag Balm", "Udderly Smooth", "Zim", "Burt Bees", "Badger", "Alba Botanica", "Jason", "Tom's", "Desert Essence", "Dr Bronners", "SheaMoisture"]
  },
  {
    name: 'Eye Care',
    items: ["Refresh", "Systane", "Blink", "Rohto", "Clear Eyes", "Visine", "Bausch & Lomb", "Alcon", "Allergan", "Lumify", "Pataday", "Zaditor", "Alaway", "Opcon-A", "Naphcon-A", "TheraTears", "GenTeal", "Soothe", "Retaine", "Optive", "Hylo", "Thealoz", "Hyabak", "Cationorm", "Ikervis", "Xiidra", "Restasis", "Cequa", "Tyrvaya", "Eysuvis", "Lotemax", "Alrex", "Flarex", "FML", "Pred Forte", "Durezol", "Ilevro", "Prolensa", "Nevanac", "Acular", "Acuvail", "BromSite", "Yellox", "Voltaren Ophthalmic", "Ketorolac Ophthalmic", "Diclofenac Ophthalmic", "Flurbiprofen Ophthalmic", "Suprofen Ophthalmic", "Nepafenac Ophthalmic", "Bromfenac Ophthalmic"]
  },
  {
    name: 'Vitamins & Supplements',
    items: ["Centrum", "One A Day", "Nature Made", "Nature's Bounty", "Olly", "Vitafusion", "SmartyPants", "GNC", "Solgar", "NOW", "Puritan's Pride", "Spring Valley", "Equate", "Up&Up", "Kirkland", "Garden of Life", "MegaFood", "New Chapter", "Rainbow Light", "Alive!", "Emergen-C", "Airborne", "Zicam", "Sambucol", "Osteo Bi-Flex", "Move Free", "Cosamin", "Schiff", "Jarrow", "Doctor's Best", "Life Extension", "Swanson", "Nordic Naturals", "Carlson", "Barlean's", "Nature's Way", "Gaia Herbs", "Herb Pharm", "Traditional Medicinals", "Yogi", "Celestial Seasonings", "Lipton", "Twinings", "Bigelow", "Tazo", "Stash", "Harney & Sons", "Republic of Tea", "Teavana", "David's Tea"]
  },
  {
    name: 'Heart Health',
    items: ["Lipitor", "Crestor", "Zocor", "Pravachol", "Mevacor", "Lescol", "Livalo", "Zetia", "Vytorin", "Tricor", "Trilipix", "Lopid", "Niaspan", "Lovaza", "Vascepa", "Norvasc", "Procardia", "Adalat", "Plendil", "DynaCirc", "Cardene", "Sular", "Calan", "Isoptin", "Verelan", "Cardizem", "Tiazac", "Dilacor", "Tenormin", "Lopressor", "Toprol", "Coreg", "Bystolic", "Inderal", "Corgard", "Trandate", "Zebeta", "Ziac", "Prinivil", "Zestril", "Vasotec", "Altace", "Lotensin", "Accupril", "Monopril", "Univasc", "Mavik", "Aceon", "Cozaar", "Diovan"]
  },
  {
    name: 'Diabetes Care',
    items: ["Glucophage", "Glucotrol", "Amaryl", "DiaBeta", "Glynase", "Prandin", "Starlix", "Actos", "Avandia", "Januvia", "Onglyza", "Tradjenta", "Nesina", "Byetta", "Bydureon", "Victoza", "Trulicity", "Ozempic", "Rybelsus", "Invokana", "Farxiga", "Jardiance", "Steglatro", "Symlin", "Precose", "Glyset", "Lantus", "Levemir", "Toujeo", "Tresiba", "Basaglar", "Novolog", "Humalog", "Apidra", "Fiasp", "Lyumjev", "Afrezza", "Humulin R", "Novolin R", "Humulin N", "Novolin N", "Humulin 70/30", "Novolin 70/30", "Novolog Mix 70/30", "Humalog Mix 75/25", "Humalog Mix 50/50", "Soliqua", "Xultophy", "Glucagon", "Baqsimi"]
  }
];

const bigBrands = ["Pfizer", "Johnson & Johnson", "Bayer", "GSK", "Novartis", "Sanofi", "Abbott", "Roche", "Merck", "AstraZeneca", "Moderna", "Gilead"];

let sql = '';
sql += 'TRUNCATE TABLE categories CASCADE;\n';
sql += 'TRUNCATE TABLE medicines CASCADE;\n';
sql += '\n';

// We do NOT truncate coupons this time as they are already set.

categoriesData.forEach(cat => {
    sql += `INSERT INTO categories (name, description) VALUES ('${cat.name}', 'Wide range of ${cat.name} products');\n`;
});
sql += '\n';

categoriesData.forEach(cat => {
    cat.items.forEach(med => {
        let brand = bigBrands[Math.floor(Math.random() * bigBrands.length)];
        let price = (Math.random() * 80 + 5).toFixed(2);
        let stock = Math.floor(Math.random() * 500) + 50;
        let requiresPrescription = Math.random() > 0.6 ? 'true' : 'false';
        
        // Escape single quotes for SQL
        let medName = med.replace(/'/g, "''");
        let description = `Original ${medName} manufactured by ${brand}. High quality and reliable.`;
        
        sql += `INSERT INTO medicines (name, brand, description, dosage, price, stock_quantity, min_stock_level, expiry_date, requires_prescription, image_url, category_id, is_active, discount_percentage)
VALUES (
    '${medName}', '${brand}', '${description}', 'Standard', ${price}, ${stock}, 20, '2028-12-31', ${requiresPrescription}, NULL, (SELECT id FROM categories WHERE name = '${cat.name}'), true, 0
);\n`;
    });
});

fs.writeFileSync('distinct-real-data.sql', sql);
console.log('Successfully generated distinct-real-data.sql');
