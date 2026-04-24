require('dotenv').config();
const mongoose = require('mongoose');
const Pharmacy = require('../models/pharmacy');
const Provider = require('../models/provider');

const TARGET_PROVIDER_ID = '69e76a06ddb7af2102e1097f';
const TARGET_MANUFACTURER = 'Sun Pharma';

async function run() {
  await mongoose.connect(process.env.MONGO_URL);

  const provider = await Provider.findById(TARGET_PROVIDER_ID).lean();
  if (!provider) {
    throw new Error(`Provider not found: ${TARGET_PROVIDER_ID}`);
  }

  const updateResult = await Pharmacy.updateMany(
    {},
    {
      $set: {
        manufacturer: TARGET_MANUFACTURER,
        providerId: new mongoose.Types.ObjectId(TARGET_PROVIDER_ID),
      },
    },
  );

  const total = await Pharmacy.countDocuments({});
  const matched = await Pharmacy.countDocuments({
    manufacturer: TARGET_MANUFACTURER,
    providerId: new mongoose.Types.ObjectId(TARGET_PROVIDER_ID),
  });

  console.log('Provider resolved:', provider.name || '(no name)');
  console.log('Updated documents:', updateResult.modifiedCount || 0);
  console.log('Total inventory documents:', total);
  console.log('Documents matching provider + manufacturer:', matched);

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Update failed:', error.message);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore disconnect failures
  }
  process.exit(1);
});
