require('dotenv').config();
const mongoose = require('mongoose');
const Store = require('../models/store');
const Pharmacy = require('../models/pharmacy');

const TYPE_OPTIONS = ['Tablet', 'Syrup'];
const DOSAGE_OPTIONS = ['250mg', '500mg', '650mg', '5ml', '10ml', '100mg'];
const DEFAULT_MANUFACTURER = 'Sun Pharma';
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

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function run() {
  await mongoose.connect(process.env.MONGO_URL);

  const stores = await Store.find({}).sort({ createdAt: 1 }).limit(2).lean();

  if (!stores.length) {
    console.log('No stores found.');
    await mongoose.disconnect();
    return;
  }

  const now = Date.now();
  const docs = [];

  for (const [idx, store] of stores.entries()) {
    for (let i = 1; i <= 1000; i += 1) {
      const type = TYPE_OPTIONS[randomInt(0, TYPE_OPTIONS.length - 1)];
      const namePool = type === 'Syrup' ? SYRUP_NAMES : TABLET_NAMES;
      const medicineBase = namePool[randomInt(0, namePool.length - 1)];

      docs.push({
        storeId: store._id,
        name: `${medicineBase} ${DOSAGE_OPTIONS[randomInt(0, DOSAGE_OPTIONS.length - 1)]}`,
        manufacturer: DEFAULT_MANUFACTURER,
        providerId: null,
        dosage: DOSAGE_OPTIONS[randomInt(0, DOSAGE_OPTIONS.length - 1)],
        type,
        price: randomInt(20, 500),
        stock: randomInt(50, 1000),
      });
    }
  }

  let inserted = 0;
  const chunkSize = 500;

  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize);
    const result = await Pharmacy.insertMany(chunk, { ordered: false });
    inserted += result.length;
  }

  console.log(`Inserted ${inserted} medicines across ${stores.length} store(s).`);
  stores.forEach((store, index) => {
    console.log(`Store ${index + 1}: ${store.storeName} (${store._id}) -> 1000 records`);
  });

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Seed failed:', error.message);
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    // ignore disconnect error
  }
  process.exit(1);
});
