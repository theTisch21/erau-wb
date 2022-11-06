/// <reference types="cypress" />
let delay = 100
let url = 'http://127.0.0.1:3000'

describe('Aircraft Lookups', () => {
  it('R-1', () => {
    cy.visit(url)
    cy.wait(delay)

    cy.get("#aircraft-input").type("R- 1")
    cy.get("#empty-weight").should("have.text", "1325.72")
    cy.get("#empty-arm").should("have.text", "12.4164")
    cy.get("#empty-moment").should("have.text", "16460.72")
  })
  it('R-22', () => {
    cy.visit(url)
    cy.wait(delay)

    cy.get("#aircraft-input").type("R-22")
    cy.get("#empty-weight").should("have.text", "1714.7")
    cy.get("#empty-arm").should("have.text", "41.3367")
    cy.get("#empty-moment").should("have.text", "70880")
  })
  it('R-32', () => {
    cy.visit(url)
    cy.wait(delay)

    cy.get("#aircraft-input").type("R-32")
    cy.get("#empty-weight").should("have.text", "1686.36")
    cy.get("#empty-arm").should("have.text", "40.3824")
    cy.get("#empty-moment").should("have.text", "68099.23")
  })
  it('R-69', () => {
    cy.visit(url)
    cy.wait(delay)

    cy.get("#aircraft-input").type("R-69")
    cy.get("#empty-weight").should("have.text", "1706.4")
    cy.get("#empty-arm").should("have.text", "41.4762")
    cy.get("#empty-moment").should("have.text", "70775")
  })
  it('R-73', () => {
    cy.visit(url)
    cy.wait(delay)

    cy.get("#aircraft-input").type("R-73")
    cy.get("#empty-weight").should("have.text", "1714.8")
    cy.get("#empty-arm").should("have.text", "41.6707")
    cy.get("#empty-moment").should("have.text", "71457")
  })
})

describe('Example sheets', () => {  
  it("example sheet 1", () => {
    cy.visit(url)
    cy.wait(delay)

    cy.get("#fs-weight").type("350")
    cy.get("#fs-moment").should("have.text", "12950")
  })
})