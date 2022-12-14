/// <reference types="cypress" />
let delay = 1000
let url = 'http://127.0.0.1:3000'

describe('Aircraft Lookups', () => {
	before(() => {
		cy.visit(url)
		cy.wait(delay)
	})
	it('R-1', () => {
		cy.get('#aircraft-input').type('{selectAll}{backspace}')
		cy.get('#aircraft-input').type('R- 1')
		cy.get('#aircraft-weight').should('contain.text', '1325')
		cy.get('#aircraft-arm').should('contain.text', '12')
		cy.get('#aircraft-moment').should('contain.text', '16460')
	})
	it('R-22', () => {
		cy.get('#aircraft-input').type('{selectAll}{backspace}')
		cy.get('#aircraft-input').type('R-22')
		cy.get('#aircraft-weight').should('contain.text', '1714')
		cy.get('#aircraft-arm').should('contain.text', '41')
		cy.get('#aircraft-moment').should('contain.text', '70880')
	})
	it('R-32', () => {
		cy.get('#aircraft-input').type('{selectAll}{backspace}')
		cy.get('#aircraft-input').type('R-32')
		cy.get('#aircraft-weight').should('contain.text', '1686')
		cy.get('#aircraft-arm').should('contain.text', '40')
		cy.get('#aircraft-moment').should('contain.text', '68099')
	})
	it('R-69', () => {
		cy.get('#aircraft-input').type('{selectAll}{backspace}')
		cy.get('#aircraft-input').type('R-69')
		cy.get('#aircraft-weight').should('contain.text', '1706')
		cy.get('#aircraft-arm').should('contain.text', '41')
		cy.get('#aircraft-moment').should('contain.text', '70775')
	})
	it('R-73', () => {
		cy.get('#aircraft-input').type('{selectAll}{backspace}')
		cy.get('#aircraft-input').type('R-73')
		cy.get('#aircraft-weight').should('contain.text', '1714')
		cy.get('#aircraft-arm').should('contain.text', '41')
		cy.get('#aircraft-moment').should('contain.text', '71457')
	})
})

describe('Pressure Altitude', () => {
	before(() => {
		cy.visit(url)
		cy.wait(delay)
	})
	it('Example 1', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}30.30')
		cy.get('#pa-result').should('contain.text', '4665')
	})
	it('Example 2', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.91')
		cy.get('#pa-result').should('contain.text', '5055')
	})
	it('Example 3', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}30.22')
		cy.get('#pa-result').should('contain.text', '4745')
	})
	it('Example 4', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.00')
		cy.get('#pa-result').should('contain.text', '5965')
	})
})

describe('Example sheets', () => {
	beforeEach(() => {
		//Refresh before each test to get a fresh sheet
		cy.visit(url)
		cy.wait(delay)
	})
	it('1', () => {
		cy.get('#aircraft-input').type('R- 3')
		cy.get('#fs-weight').type('350')
		cy.get('#fs-moment').should('contain.text', '12950')
		cy.get('#rs-weight').type('20')
		cy.get('#rs-moment').should('contain.text', '1460')
		//There's no need to re-type 17, as it's the default
		//cy.get("#fb-weight").type("{selectAll}{backspace}17")
		cy.get('#fb-moment').should('contain.text', '1615')
		//cy.get("#aft-weight").type("0")
		cy.get('#aft-moment').should('contain.text', '0')

		cy.get('#empty-weight').should('contain.text', '2099')
		cy.get('#empty-arm').should('contain.text', '40')
		cy.get('#empty-moment').should('contain.text', '85919')

		//cy.get("#ramp-input").type("53")
		cy.get('#rampFuel-weight').should('contain.text', '318')
		cy.get('#rampFuel-moment').should('contain.text', '15264')
		cy.get('#ramp-weight').should('contain.text', '2417')
		cy.get('#ramp-arm').should('contain.text', '41')
		cy.get('#ramp-moment').should('contain.text', '101183')

		//cy.get("#taxi-input").type("1")
		cy.get('#taxi-weight').should('contain.text', '-8')
		cy.get('#taxi-moment').should('contain.text', '-403')
		cy.get('#takeoff-weight').should('contain.text', '2409')
		cy.get('#takeoff-arm').should('contain.text', '41')
		cy.get('#takeoff-moment').should('contain.text', '100779')

		//cy.get("#flight-gallon").type("15")
		cy.get('#flight-weight').should('contain.text', '-90')
		cy.get('#flight-moment').should('contain.text', '-4320')
		cy.get('#land-weight').should('contain.text', '2319')
		cy.get('#land-arm').should('contain.text', '41')
		cy.get('#land-moment').should('contain.text', '96459')
	})
	it('2', () => {
		cy.get('#aircraft-input').type('R-68')
		cy.get('#fs-weight').type('350')
		cy.get('#fs-moment').should('contain.text', '12950')
		cy.get('#rs-weight').type('20')
		cy.get('#rs-moment').should('contain.text', '1460')
		//There's no need to re-type 17, as it's the default
		//cy.get("#fb-weight").type("{selectAll}{backspace}17")
		cy.get('#fb-moment').should('contain.text', '1615')
		//cy.get("#aft-weight").type("0")
		cy.get('#aft-moment').should('contain.text', '0')

		cy.get('#empty-weight').should('contain.text', '2093')
		cy.get('#empty-arm').should('contain.text', '41')
		cy.get('#empty-moment').should('contain.text', '86800')

		//cy.get("#ramp-input").type("53")
		cy.get('#rampFuel-weight').should('contain.text', '318')
		cy.get('#rampFuel-moment').should('contain.text', '15264')
		cy.get('#ramp-weight').should('contain.text', '2411')
		cy.get('#ramp-arm').should('contain.text', '42')
		cy.get('#ramp-moment').should('contain.text', '102064')

		//cy.get("#taxi-input").type("1")
		cy.get('#taxi-weight').should('contain.text', '-8')
		cy.get('#taxi-moment').should('contain.text', '-403')
		cy.get('#takeoff-weight').should('contain.text', '2403')
		cy.get('#takeoff-arm').should('contain.text', '42')
		cy.get('#takeoff-moment').should('contain.text', '101660')

		//cy.get("#flight-gallon").type("15")
		cy.get('#flight-weight').should('contain.text', '-90')
		cy.get('#flight-moment').should('contain.text', '-4320')
		cy.get('#land-weight').should('contain.text', '2313')
		cy.get('#land-arm').should('contain.text', '42')
		cy.get('#land-moment').should('contain.text', '97340')
	})
	it('3', () => {
		cy.get('#aircraft-input').type('R-57')
		cy.get('#fs-weight').type('350')
		cy.get('#fs-moment').should('contain.text', '12950')
		cy.get('#rs-weight').type('20')
		cy.get('#rs-moment').should('contain.text', '1460')
		//There's no need to re-type 17, as it's the default
		//cy.get("#fb-weight").type("{selectAll}{backspace}17")
		cy.get('#fb-moment').should('contain.text', '1615')
		//cy.get("#aft-weight").type("0")
		cy.get('#aft-moment').should('contain.text', '0')

		cy.get('#empty-weight').should('contain.text', '2110')
		cy.get('#empty-arm').should('contain.text', '41')
		cy.get('#empty-moment').should('contain.text', '87701')

		//cy.get("#ramp-input").type("53")
		cy.get('#rampFuel-weight').should('contain.text', '318')
		cy.get('#rampFuel-moment').should('contain.text', '15264')
		cy.get('#ramp-weight').should('contain.text', '2428')
		cy.get('#ramp-arm').should('contain.text', '42')
		cy.get('#ramp-moment').should('contain.text', '102965')

		//cy.get("#taxi-input").type("1")
		cy.get('#taxi-weight').should('contain.text', '-8')
		cy.get('#taxi-moment').should('contain.text', '-403')
		cy.get('#takeoff-weight').should('contain.text', '2420')
		cy.get('#takeoff-arm').should('contain.text', '42')
		cy.get('#takeoff-moment').should('contain.text', '102561')

		//cy.get("#flight-gallon").type("15")
		cy.get('#flight-weight').should('contain.text', '-90')
		cy.get('#flight-moment').should('contain.text', '-4320')
		cy.get('#land-weight').should('contain.text', '2330')
		cy.get('#land-arm').should('contain.text', '42')
		cy.get('#land-moment').should('contain.text', '98241')

		//Change in aircraft
		cy.get('#new-aircraft-button').click()
		cy.get('#new-aircraft-input').type('R- 4')

		cy.get('#diff-weight').should('contain.text', '-16')
		cy.get('#diff-arm').should('contain.text', '0')
		cy.get('#diff-moment').should('contain.text', '-1539')

		cy.get('#new-takeoff-weight').should('contain.text', '2404')
		cy.get('#new-takeoff-arm').should('contain.text', '42')
		cy.get('#new-takeoff-moment').should('contain.text', '101022')

		cy.get('#new-land-weight').should('contain.text', '2314')
		cy.get('#new-land-arm').should('contain.text', '41')
		cy.get('#new-land-moment').should('contain.text', '96702')
	})
})
