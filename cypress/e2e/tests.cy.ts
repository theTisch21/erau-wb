/// <reference types="cypress" />
let delay = 1000
let url = 'http://127.0.0.1:3000'

describe('Aircraft Lookups', () => {
  before(() => {
    cy.visit(url)
    cy.wait(delay)
  })
  it('R-1', () => {
    cy.get("#aircraft-input").type("{selectAll}{backspace}")    
    cy.get("#aircraft-input").type("R- 1")
    cy.get("#aircraft-weight").should("have.text", "1325.72")
    cy.get("#aircraft-arm").should("have.text", "12.4164")
    cy.get("#aircraft-moment").should("have.text", "16460.72")
  })
  it('R-22', () => {
    cy.get("#aircraft-input").type("{selectAll}{backspace}")
    cy.get("#aircraft-input").type("R-22")
    cy.get("#aircraft-weight").should("have.text", "1714.7")
    cy.get("#aircraft-arm").should("have.text", "41.3367")
    cy.get("#aircraft-moment").should("have.text", "70880")
  })
  it('R-32', () => {
    cy.get("#aircraft-input").type("{selectAll}{backspace}")
    cy.get("#aircraft-input").type("R-32")
    cy.get("#aircraft-weight").should("have.text", "1686.36")
    cy.get("#aircraft-arm").should("have.text", "40.3824")
    cy.get("#aircraft-moment").should("have.text", "68099.23")
  })
  it('R-69', () => {
    cy.get("#aircraft-input").type("{selectAll}{backspace}")
    cy.get("#aircraft-input").type("R-69")
    cy.get("#aircraft-weight").should("have.text", "1706.4")
    cy.get("#aircraft-arm").should("have.text", "41.4762")
    cy.get("#aircraft-moment").should("have.text", "70775")
  })
  it('R-73', () => {
    cy.get("#aircraft-input").type("{selectAll}{backspace}")
    cy.get("#aircraft-input").type("R-73")
    cy.get("#aircraft-weight").should("have.text", "1714.8")
    cy.get("#aircraft-arm").should("have.text", "41.6707")
    cy.get("#aircraft-moment").should("have.text", "71457")
  })
})

describe('Example sheets', () => {  
  beforeEach(() => {
    //Refresh before each test to get a fresh sheet
    cy.visit(url)
    cy.wait(delay)
  })
  it("1", () => {
    cy.get("#aircraft-input").type("R- 3")
    cy.get("#fs-weight").type("350")
    cy.get("#fs-moment").should("have.text", "12950")
    cy.get("#rs-weight").type("20")
    cy.get("#rs-moment").should("have.text", "1460")
    //There's no need to re-type 17, as it's the default
    //cy.get("#fb-weight").type("{selectAll}{backspace}17")
    cy.get("#fb-moment").should("have.text", "1615")
    cy.get("#aft-weight").type("0")
    cy.get("#aft-moment").should("have.text", "0")
    
    cy.get("#empty-weight").should("have.text", "2099.4")
    cy.get("#empty-arm").should("have.text", "40.93")
    cy.get("#empty-moment").should("have.text", "85919")

    //cy.get("#ramp-input").type("53")
    cy.get("#rampFuel-weight").should("have.text", "318.00")
    cy.get("#rampFuel-moment").should("have.text", "15264")
    cy.get("#ramp-weight").should("have.text", "2417.4")
    cy.get("#ramp-arm").should("have.text", "41.86")
    cy.get("#ramp-moment").should("have.text", "101183")
    
    //cy.get("#taxi-input").type("1.4")
    cy.get("#taxi-weight").should("have.text", "-8.40")
    cy.get("#taxi-moment").should("have.text", "-403.20")
    cy.get("#takeoff-weight").should("have.text", "2409")
    cy.get("#takeoff-arm").should("have.text", "41.83")
    cy.get("#takeoff-moment").should("have.text", "100779.8")
    
    cy.get("#flight-input").type("15")
    cy.get("#flight-weight").should("have.text", "-90.00")
    cy.get("#flight-moment").should("have.text", "-4320")
    cy.get("#land-weight").should("have.text", "2319")
    cy.get("#land-arm").should("have.text", "41.60")
    cy.get("#land-moment").should("have.text", "96459.8")
  })
})