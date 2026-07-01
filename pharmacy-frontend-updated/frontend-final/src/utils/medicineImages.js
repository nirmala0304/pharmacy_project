export function getMedicineImage(medicineName, medicineCategory, imageUrl) {
  if (imageUrl && imageUrl.trim() !== '' && imageUrl !== 'placeholder.jpg') return imageUrl;

  const name = (medicineName || '').toLowerCase();
  const cat = (medicineCategory || '').toLowerCase();

  if (cat.includes('antibiotic')) return '/img_antibiotics.png';
  if (cat.includes('pain')) return '/img_pain_relief.png';
  if (cat.includes('vitamin') || cat.includes('supplement')) return '/img_vitamins.png';
  if (cat.includes('diabet')) return '/img_diabetes.png';
  if (cat.includes('heart') || cat.includes('bp')) return '/img_heart_bp.png';
  if (cat.includes('cold') || cat.includes('flu')) return '/img_cold_flu.png';
  if (cat.includes('skin')) return '/img_skin_care.png';
  if (cat.includes('digest')) return '/img_digestive.png';

  // Fallback mappings by name in case category is missing
  if (name.includes('amoxicillin') || name.includes('azithromycin') || name.includes('ciprofloxacin') || name.includes('doxycycline')) return '/img_antibiotics.png';
  if (name.includes('paracetamol') || name.includes('ibuprofen') || name.includes('diclofenac') || name.includes('aspirin') || name.includes('tramadol')) return '/img_pain_relief.png';
  if (name.includes('vitamin') || name.includes('omega') || name.includes('calcium') || name.includes('iron')) return '/img_vitamins.png';
  if (name.includes('metformin') || name.includes('glimepiride') || name.includes('januvia') || name.includes('insulin') || name.includes('glucometer')) return '/img_diabetes.png';
  if (name.includes('amlodipine') || name.includes('atorvastatin') || name.includes('losartan') || name.includes('metoprolol') || name.includes('ramipril')) return '/img_heart_bp.png';
  if (name.includes('cetirizine') || name.includes('dextromethorphan') || name.includes('loratadine') || name.includes('phenylephrine') || name.includes('oseltamivir')) return '/img_cold_flu.png';
  if (name.includes('betamethasone') || name.includes('clotrimazole') || name.includes('mupirocin') || name.includes('calamine') || name.includes('ketoconazole')) return '/img_skin_care.png';
  if (name.includes('omeprazole') || name.includes('pantoprazole') || name.includes('ors') || name.includes('loperamide') || name.includes('lactulose') || name.includes('metoclopramide')) return '/img_digestive.png';

  return '/generic_medicine.png';
}
