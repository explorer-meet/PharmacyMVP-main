require('dotenv').config();
const mongoose = require('mongoose');
const Pharmacy = require('../models/pharmacy');

const TABLET_NAMES = [
  'Paracetamol',
  'Metformin',
  'Amlodipine',
  'Atorvastatin',
  'Pantoprazole',
  'Cetirizine',
  'Azithromycin',
  'Telmisartan',
  'Levocetirizine',
  'Amoxicillin',
  'Dolo',
  'Calcium Plus',
  'Vitamin C',
  'Losartan',
  'Montelukast',
];

const SYRUP_NAMES = [
  'Benadryl',
  'Ascoril',
  'Corex',
  'Ambroxol',
  'Lactulose',
  'Digene',
  'Gelusil',
  'Cofsils',
  'Grilinctus',
  'Becozinc',
  'Liv',
  'Tonoferon',
  'Chericof',
  'Alex',
  'Mucolite',
];

const DOSAGE_OPTIONS = ['250mg', '500mg', '650mg', '5ml', '10ml', '100mg'];
const DEFAULT_MANUFACTURER = 'Sun Pharma';
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function run() {
  await mongoose.connect(process.env.MONGO_URL);

  const seedPattern = /^(Tablet|Syrup) Med \d+-\d+-\d{13}$/;
  const records = await Pharmacy.find({ name: seedPattern }).select('_id name type').lean();

  if (!records.length) {
    console.log('No placeholder medicine names found.');
    await mongoose.disconnect();
    return;
  }

  const bulkOps = records.map((record) => {
    const type = String(record.type || '').trim();
    const pool = type === 'Syrup' ? SYRUP_NAMES : TABLET_NAMES;
    const base = pool[randomInt(0, pool.length - 1)];
    const dosage = DOSAGE_OPTIONS[randomInt(0, DOSAGE_OPTIONS.length - 1)];
    const newName = `${base} ${dosage}`;

    return {
      updateOne: {
        filter: { _id: record._id },
        update: { $set: { name: newName, manufacturer: DEFAULT_MANUFACTURER } },
      },
    };
  });

  const result = await Pharmacy.bulkWrite(bulkOps, { ordered: false });
  console.log(`Updated placeholder names: ${result.modifiedCount || 0}`);

  const remaining = await Pharmacy.countDocuments({ name: seedPattern });
  console.log(`Remaining placeholder names: ${remaining}`);

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Rename failed:', error.message);
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    // ignore
  }
  process.exit(1);
});
