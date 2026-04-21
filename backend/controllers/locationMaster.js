const { StatusCodes } = require('http-status-codes');
const CountryMaster = require('../models/countryMaster');
const StateMaster = require('../models/stateMaster');

const mapCountryResponse = (country) => ({
  _id: country._id,
  name: country.name,
  isoCode: country.isoCode,
  dialCode: country.dialCode,
});

const mapStateResponse = (state) => ({
  _id: state._id,
  countryId: state.countryId,
  name: state.name,
  code: state.code || '',
});

const seedLocationMasterIfEmpty = async () => {
  // Startup hook intentionally kept as a no-op to avoid hardcoded seed data in runtime code.
  return;
};

const getCountries = async (req, res) => {
  try {
    const rows = await CountryMaster.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return res.status(StatusCodes.OK).json({
      countries: rows.map((country) => mapCountryResponse(country)),
    });
  } catch (error) {
    console.error('getCountries error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch countries' });
  }
};

const getStatesByCountry = async (req, res) => {
  try {
    const countryCode = String(req.query.countryCode || '').trim();
    const isoCode = String(req.query.isoCode || '').trim().toUpperCase();
    const countryId = String(req.query.countryId || '').trim();

    if (!countryCode && !isoCode && !countryId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'countryCode or isoCode or countryId is required',
      });
    }

    const countryFilter = { isActive: true };
    if (countryId) {
      countryFilter._id = countryId;
    } else if (isoCode) {
      countryFilter.isoCode = isoCode;
    } else if (countryCode) {
      countryFilter.dialCode = countryCode;
    }

    const country = await CountryMaster.findOne(countryFilter).lean();
    if (!country) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Country not found' });
    }

    const rows = await StateMaster.find({
      countryId: country._id,
      isActive: true,
    })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return res.status(StatusCodes.OK).json({
      country: mapCountryResponse(country),
      states: rows.map((state) => mapStateResponse(state)),
    });
  } catch (error) {
    console.error('getStatesByCountry error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch states' });
  }
};

module.exports = {
  seedLocationMasterIfEmpty,
  getCountries,
  getStatesByCountry,
};
