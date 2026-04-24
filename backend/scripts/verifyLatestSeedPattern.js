require('dotenv').config();
const mongoose = require('mongoose');
const Pharmacy = require('../models/pharmacy');

const STORE_CONFIG = [
  { storeId: '69c99365918f63c2ff9e1510', prefix: /^(Tablet|Syrup) Med 1-\d+-\d{13}$/ },
  { storeId: '69d5e0b08f17cd051109bafc', prefix: /^(Tablet|Syrup) Med 2-\d+-\d{13}$/ },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URL);

  for (const item of STORE_CONFIG) {
    const rows = await Pharmacy.find({ storeId: item.storeId, name: item.prefix }).lean();
    const prices = rows.map((r) => Number(r.price));
    const stocks = rows.map((r) => Number(r.stock));
    const minPrice = prices.length ? Math.min(...prices) : null;
    const maxPrice = prices.length ? Math.max(...prices) : null;
    const minStock = stocks.length ? Math.min(...stocks) : null;
    const maxStock = stocks.length ? Math.max(...stocks) : null;

    console.log({
      storeId: item.storeId,
      matchedSeedRows: rows.length,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
    });
  }

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Pattern verification failed:', error.message);
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    // ignore
  }
  process.exit(1);
});
