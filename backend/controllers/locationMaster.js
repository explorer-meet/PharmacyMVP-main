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

const createCountry = async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const isoCode = String(req.body?.isoCode || '').trim().toUpperCase();
    const dialCode = String(req.body?.dialCode || '').trim();

    if (!name || !isoCode || !dialCode) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'name, isoCode and dialCode are required',
      });
    }

    if (!/^\+[0-9]{1,4}$/.test(dialCode)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'dialCode must be in +<digits> format',
      });
    }

    const existingIso = await CountryMaster.findOne({ isoCode }).lean();
    if (existingIso) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Country with this ISO code already exists' });
    }

    const sortOrder = Number(req.body?.sortOrder) || 0;
    const country = await CountryMaster.create({
      name,
      isoCode,
      dialCode,
      sortOrder,
      isActive: true,
    });

    return res.status(StatusCodes.CREATED).json({
      message: 'Country created successfully',
      country: mapCountryResponse(country),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Country already exists' });
    }
    console.error('createCountry error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create country' });
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

const createState = async (req, res) => {
  try {
    const countryId = String(req.body?.countryId || '').trim();
    const countryCode = String(req.body?.countryCode || '').trim();
    const isoCode = String(req.body?.isoCode || '').trim().toUpperCase();
    const name = String(req.body?.name || '').trim();
    const code = String(req.body?.code || '').trim().toUpperCase();

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'State name is required' });
    }

    if (!countryId && !countryCode && !isoCode) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'countryId or countryCode or isoCode is required',
      });
    }

    const countryFilter = { isActive: true };
    if (countryId) {
      countryFilter._id = countryId;
    } else if (isoCode) {
      countryFilter.isoCode = isoCode;
    } else {
      countryFilter.dialCode = countryCode;
    }

    const country = await CountryMaster.findOne(countryFilter).lean();
    if (!country) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Country not found' });
    }

    const normalizedName = name.toLowerCase();
    const existing = await StateMaster.findOne({ countryId: country._id, normalizedName }).lean();
    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'State already exists for this country' });
    }

    const sortOrder = Number(req.body?.sortOrder) || 0;
    const state = await StateMaster.create({
      countryId: country._id,
      name,
      normalizedName,
      code,
      sortOrder,
      isActive: true,
    });

    return res.status(StatusCodes.CREATED).json({
      message: 'State created successfully',
      state: mapStateResponse(state),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'State already exists for this country' });
    }
    console.error('createState error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create state' });
  }
};

module.exports = {
  seedLocationMasterIfEmpty,
  getCountries,
  getStatesByCountry,
  createCountry,
  createState,
};
