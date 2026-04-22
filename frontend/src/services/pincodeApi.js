import axios from 'axios';
import { baseURL } from '../main';

export const fetchPincodeDetails = async (pincode) => {
  const sanitized = String(pincode || '').trim();
  const response = await axios.get(`${baseURL}/locations/pincode/${sanitized}`);
  return response.data;
};
