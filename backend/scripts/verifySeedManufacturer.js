require('dotenv').config();
const mongoose = require('mongoose');
const Pharmacy = require('../models/pharmacy');

const seedPattern = /^(Tablet|Syrup) Med \d+-\d+-\d{13}$/;

async function run() {
  await mongoose.connect(process.env.MONGO_URL);

  const remainingPlaceholders = await Pharmacy.countDocuments({ name: seedPattern });
  const nonSunAmongRenamed = await Pharmacy.countDocuments({
    name: { $not: seedPattern },
    manufacturer: { $ne: 'Sun Pharma' },
    type: { $in: ['Tablet', 'Syrup'] },
  });

  // Specifically check renamed dataset by matching newly valid name pattern from script
  const validSeedNamePattern = /^(Paracetamol|Metformin|Amlodipine|Atorvastatin|Pantoprazole|Cetirizine|Azithromycin|Telmisartan|Levocetirizine|Amoxicillin|Dolo|Calcium Plus|Vitamin C|Losartan|Montelukast|Benadryl|Ascoril|Corex|Ambroxol|Lactulose|Digene|Gelusil|Cofsils|Grilinctus|Becozinc|Liv|Tonoferon|Chericof|Alex|Mucolite)\s(250mg|500mg|650mg|5ml|10ml|100mg)$/;
  const renamedRows = await Pharmacy.countDocuments({ name: validSeedNamePattern, manufacturer: 'Sun Pharma' });

  console.log({ remainingPlaceholders, renamedRowsWithSunPharma: renamedRows, nonSunAmongTabletOrSyrup: nonSunAmongRenamed });

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Verification failed:', error.message);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
