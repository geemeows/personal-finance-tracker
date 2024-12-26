import { modelExchangeRates } from './exchangeRates.modeling'
import { httpClient } from './httpClient'

export const getExchangeRates = async (
  currency: string,
): Promise<{ lastUpdated: string; rates: { [key: string]: number } }> => {
  const response = await httpClient.get(`/${currency}`)
  return modelExchangeRates(response.data)
}
