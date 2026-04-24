require('dotenv').config();
const mongoose = require('mongoose');
const Pharmacy = require('../models/pharmacy');

const STORE_IDS = [
  '69c99365918f63c2ff9e1510',
  '69d5e0b08f17cd051109bafc',
];

async function run() {
  await mongoose.connect(process.env.MONGO_URL);

  for (const storeId of STORE_IDS) {
    const _id = new mongoose.Types.ObjectId(storeId);
    const [summary] = await Pharmacy.aggregate([
      { $match: { storeId: _id } },
      {
        $group: {
          _id: '$storeId',
          count: { $sum: 1 },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          minStock: { $min: '$stock' },
          maxStock: { $max: '$stock' },
        },
      },
    ]);

    console.log({ storeId, summary: summary || null });
  }

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Verification failed:', error.message);
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    // ignore
  }
  process.exit(1);
});
