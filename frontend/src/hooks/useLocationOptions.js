import { useEffect, useMemo, useState } from 'react';
import { fetchCountriesMaster, fetchStatesByCountryMaster } from '../services/locationMasterApi';

export const useLocationOptions = (countryCode) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);

  useEffect(() => {
    let active = true;

    const loadCountries = async () => {
      try {
        const countries = await fetchCountriesMaster();
        if (!active || !countries.length) return;

        setCountryOptions(
          countries.map((country) => ({
            code: country.dialCode,
            label: `${country.name} (${country.dialCode})`,
          }))
        );
      } catch {
        setCountryOptions([]);
      }
    };

    loadCountries();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadStates = async () => {
      if (!countryCode) {
        setStateOptions([]);
        return;
      }

      try {
        const states = await fetchStatesByCountryMaster(countryCode);
        if (!active) return;

        if (states.length > 0) {
          setStateOptions(states.map((state) => state.name));
          return;
        }
      } catch {
        if (active) setStateOptions([]);
      }
    };

    loadStates();

    return () => {
      active = false;
    };
  }, [countryCode]);

  const getCountryLabelByDialCode = useMemo(() => {
    const labelMap = countryOptions.reduce((acc, option) => {
      acc[option.code] = option.label;
      return acc;
    }, {});

    return (dialCode) => labelMap[dialCode] || dialCode || '';
  }, [countryOptions]);

  return {
    countryOptions,
    stateOptions,
    getCountryLabelByDialCode,
  };
};
