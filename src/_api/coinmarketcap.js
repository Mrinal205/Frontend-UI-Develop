import axios from 'axios';
import { COINMARKETCAP_API_HOST } from '../_constants';
import { COINMARKETCAP_TIMEOUT } from '_constants/timeouts';

const instance = axios.create({
  baseURL: `https://${COINMARKETCAP_API_HOST}`,
  timeout: COINMARKETCAP_TIMEOUT
});

export function getMarketcapOverview(data) {
  return instance
    .get('/v1/global/', {
      params: data ? data : {}
    })
    .then(response => response.data);
}
