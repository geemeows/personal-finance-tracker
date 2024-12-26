import axios from 'axios'

export const httpClient = axios.create({
  baseURL: `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGE_RATE_API_KEY}/latest`,
})
