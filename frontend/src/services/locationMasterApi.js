import axios from 'axios';
import { baseURL } from '../main';

export const fetchCountriesMaster = async () => {
  const response = await axios.get(`${baseURL}/locations/countries`);
  return response.data?.countries || [];
};

export const fetchStatesByCountryMaster = async (countryCode) => {
  if (!countryCode) return [];
  const response = await axios.get(`${baseURL}/locations/states`, {
    params: { countryCode },
  });
  return response.data?.states || [];
};
