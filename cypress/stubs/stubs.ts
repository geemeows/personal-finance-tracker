/// <reference types="cypress" />

export const stubRatesRequest = (): Cypress.Chainable<null> => {
  return cy
    .intercept(
      {
        method: 'POST',
        url: '/api/web/applications/*/*/adoption/insights/releases',
      },
      {
        fixture: 'exchange-rates.json',
      },
    )
    .as('stubExchangeRates')
}
