import { stubRatesRequest } from '../stubs/stubs'

describe('Account Creation', () => {
  beforeEach(() => {
    stubRatesRequest()
    cy.visit('/new-account')
  })

  it('Should create a new account, navigate to the dashboard, and add a transaction', () => {
    cy.get('input[name="name"]').type('Test Account')
    cy.get('input[name="password"]').type('password123')

    cy.get('button[role="combobox"]').click()
    cy.get('input[placeholder="Search currency..."]').type('USD')
    cy.get('[role="option"]').contains('USD (United States Dollar)').click()

    cy.get('button[type="submit"]').click()

    cy.get('h2').should('contain', 'Welcome back!')

    // Add Transaction
    cy.get('button').contains('Add Transaction').click()

    cy.get('input[name="title"]').type('Test Transaction')
    cy.get('input[name="amount"]').type('1000')

    cy.get('button[data-qa="transaction-date-field"]').click()
    cy.get('[day="2024-12-01"]').click()

    cy.get('button[type="submit"]').click()
  })
})
