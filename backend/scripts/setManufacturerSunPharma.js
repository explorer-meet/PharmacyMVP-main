require('dotenv').config();
const mongoose = require('mongoose');
const Pharmacy = require('../models/pharmacy');

async function run() {
  await mongoose.connect(process.env.MONGO_URL);

  const result = await Pharmacy.updateMany({}, { $set: { manufacturer: 'Sun Pharma' } });
  const distinct = await Pharmacy.distinct('manufacturer');

  console.log('Updated manufacturers to Sun Pharma:', result.modifiedCount || 0);
  console.log('Distinct manufacturers:', distinct);

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Update failed:', error.message);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
