export const modelExchangeRates = (exchangeRates: {
  time_last_update_utc: string
  conversion_rates: { [key: string]: number }
}) => {
  const { conversion_rates, time_last_update_utc } = exchangeRates
  const lastUpdatedDate = new Date(time_last_update_utc)
  return {
    lastUpdated: lastUpdatedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }),
    rates: conversion_rates,
  }
}
