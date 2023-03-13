/// <reference types="cypress" />
let delay = 1000
let url = 'http://127.0.0.1:3000'

import { decodeMetar } from '../../src/lib/Calculators/metar'

describe('Metar parsing', () => {
	it('Simple metars', () => {
		expect(decodeMetar('KPRC 12045KT 04/05 A3003')).deep.equal({
			wind: {
				speed: 45,
				isGusting: false
			},
			altimiter: 30.03,
			temp: 4
		})
		expect(decodeMetar('KPRC 33423G45KT M04/M05 A2931')).deep.equal({
			wind: {
				speed: 23,
				isGusting: true,
				gust: 45
			},
			altimiter: 29.31,
			temp: -4
		})
	})
	it('Regular', () => {
		expect(
			decodeMetar('KPRC 061953Z 00000KT 10SM CLR 09/M03 A3021 RMK AO2 SLP199 T00941028')
		).deep.equal({
			wind: {
				speed: 0,
				isGusting: false
			},
			altimiter: 30.21,
			temp: 9
		})
		expect(
			decodeMetar('KPRC 061453Z 20007KT 10SM CLR M01/M01 A3018 RMK AO2 SLP211 T10061011 53011')
		).deep.equal({
			wind: {
				speed: 7,
				isGusting: false
			},
			altimiter: 30.18,
			temp: -1
		})
		expect(
			decodeMetar('KPRC 072153Z 00000KT 10SM CLR 12/M06 A3023 RMK AO2 SLP219 T01171056')
		).deep.equal({
			wind: {
				speed: 0,
				isGusting: false
			},
			altimiter: 30.23,
			temp: 12
		})
		expect(
			decodeMetar('KPRC 071853Z VRB04KT 10SM CLR 06/M03 A3028 RMK AO2 SLP246 T00611028')
		).deep.equal({
			wind: {
				speed: 4,
				isGusting: false
			},
			altimiter: 30.28,
			temp: 6
		})
	})
	it('Wacky', () => {
		expect(
			decodeMetar(
				'KPRC 080553Z AUTO 17004KT 10SM CLR 01/M06 A3025 RMK AO2 SLP235 T00061056 10094 20000 53005'
			)
		).deep.equal({
			wind: {
				speed: 4,
				isGusting: false
			},
			altimiter: 30.25,
			temp: 1
		})
		expect(
			decodeMetar(
				'KPRC 110353Z 21014G26KT 9SM -RA FEW019 BKN045 OVC085 08/M01 A2998 RMK AO2 PK WND 20028/0340 RAB51 SLP119 P0000 T00781011'
			)
		).deep.equal({
			wind: {
				speed: 14,
				isGusting: true,
				gust: 26
			},
			altimiter: 29.98,
			temp: 8
		})
		expect(
			decodeMetar(
				'KPRC 110438Z AUTO 28013G25KT 3SM RA BR SCT030 BKN035 OVC046 06/03 A3001 RMK AO2 WSHFT 0418 P0003 T00560033'
			)
		).deep.equal({
			wind: {
				speed: 13,
				isGusting: true,
				gust: 25
			},
			altimiter: 30.01,
			temp: 6
		})
		expect(
			decodeMetar(
				'KPRC 102353Z 20013KT 10SM CLR 11/M03 A3002 RMK AO2 PK WND 20026/2254 SLP130 T01061028 10133 20106 55004'
			)
		).deep.equal({
			wind: {
				speed: 13,
				isGusting: false
			},
			altimiter: 30.02,
			temp: 11
		})
	})
	it('Absolutely Bonkers', () => {
		expect(
			decodeMetar(
				'METAR KFLG 041657Z 08023G30KT 050V130 M1/4SM R21/1000FT +SN BLSN FZFG BKN013 OVC058 M02/M03 A2921 RMK A02 PK WND 10036/33 WSHFT 23 TWR VIS 1/4 VIS1/4V1/2 SHSNB05E20SNB20 CIG010V060 BKN013 V OVC PRESFR SLP 892 SNINCR 2/8 T10221031 P0020 TSNO'
			)
		).deep.equal({
			wind: {
				speed: 23,
				isGusting: true,
				gust: 30
			},
			altimiter: 29.21,
			temp: -2
		})
	})
})

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

describe('Performance multiplier', () => {
	beforeEach(() => {
		cy.visit(url)
		cy.wait(delay)
	})

	it('Increase multiplier', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.92')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}10')
		cy.get('#perf-multiplier-input').type('{selectAll}{backspace}1.2')
		cy.get('#perf-to-roll').should('contain.text', '1356')
		cy.get('#perf-to-50').should('contain.text', '2328')
		cy.get('#perf-climb').should('contain.text', '466')
		cy.get('#perf-land-roll').should('contain.text', '846')
		cy.get('#perf-land-50').should('contain.text', '1848')
	})

	it('Decrease multiplier', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.92')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}10')
		cy.get('#perf-multiplier-input').type('{selectAll}{backspace}.9')
		cy.get('#perf-to-roll').should('contain.text', '1017')
		cy.get('#perf-to-50').should('contain.text', '1746')
		cy.get('#perf-climb').should('contain.text', '466')
		cy.get('#perf-land-roll').should('contain.text', '634')
		cy.get('#perf-land-50').should('contain.text', '1386')
	})
})
//We don't do performance testing specifically, as that's covered by the example sheets.

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

		//Performance
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}30.14')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}5')
		cy.get('#perf-to-roll').should('contain.text', '1410')
		cy.get('#perf-to-50').should('contain.text', '2445')
		cy.get('#perf-climb').should('contain.text', '466')
		cy.get('#perf-land-roll').should('contain.text', '667')
		cy.get('#perf-land-50').should('contain.text', '1480')
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

		//Performance
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.85')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}13')
		cy.get('#perf-to-roll').should('contain.text', '1654')
		cy.get('#perf-to-50').should('contain.text', '2903')
		cy.get('#perf-climb').should('contain.text', '492')
		cy.get('#perf-land-roll').should('contain.text', '712')
		cy.get('#perf-land-50').should('contain.text', '1552')
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

		//Performance
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}31.00')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}35')
		cy.get('#perf-to-roll').should('contain.text', '1605')
		cy.get('#perf-to-50').should('contain.text', '2782.5')
		cy.get('#perf-climb').should('contain.text', '540')
		cy.get('#perf-land-roll').should('contain.text', '712')
		cy.get('#perf-land-50').should('contain.text', '1552')
	})

	it('4', () => {
		cy.get('#aircraft-input').type('R-44')
		cy.get('#fs-weight').type('350')
		cy.get('#fs-moment').should('contain.text', '12950')
		cy.get('#rs-weight').type('20')
		cy.get('#rs-moment').should('contain.text', '1460')
		//There's no need to re-type 17, as it's the default
		//cy.get("#fb-weight").type("{selectAll}{backspace}17")
		cy.get('#fb-moment').should('contain.text', '1615')
		//cy.get("#aft-weight").type("0")
		cy.get('#aft-moment').should('contain.text', '0')

		cy.get('#empty-weight').should('contain.text', '2062')
		cy.get('#empty-arm').should('contain.text', '40')
		cy.get('#empty-moment').should('contain.text', '84181')

		//cy.get("#ramp-input").type("53")
		cy.get('#rampFuel-weight').should('contain.text', '318')
		cy.get('#rampFuel-moment').should('contain.text', '15264')
		cy.get('#ramp-weight').should('contain.text', '2380')
		cy.get('#ramp-arm').should('contain.text', '41')
		cy.get('#ramp-moment').should('contain.text', '99445')

		//cy.get("#taxi-input").type("1")
		cy.get('#taxi-weight').should('contain.text', '-8')
		cy.get('#taxi-moment').should('contain.text', '-403')
		cy.get('#takeoff-weight').should('contain.text', '2371')
		cy.get('#takeoff-arm').should('contain.text', '41')
		cy.get('#takeoff-moment').should('contain.text', '99042')

		//cy.get("#flight-gallon").type("15")
		cy.get('#flight-weight').should('contain.text', '-90')
		cy.get('#flight-moment').should('contain.text', '-4320')
		cy.get('#land-weight').should('contain.text', '2281')
		cy.get('#land-arm').should('contain.text', '41')
		cy.get('#land-moment').should('contain.text', '94722')

		//Performance before aircraft change
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}30.14')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}5')
		cy.get('#perf-to-roll').should('contain.text', '1217')
		cy.get('#perf-to-50').should('contain.text', '2097')
		cy.get('#perf-climb').should('contain.text', '466')
		cy.get('#perf-land-roll').should('contain.text', '667')
		cy.get('#perf-land-50').should('contain.text', '1480')

		//Change in aircraft
		cy.get('#new-aircraft-button').click()
		cy.get('#new-aircraft-input').type('R-55')

		cy.get('#diff-weight').should('contain.text', '48')
		cy.get('#diff-arm').should('contain.text', '0')
		cy.get('#diff-moment').should('contain.text', '3519')

		cy.get('#new-takeoff-weight').should('contain.text', '2420')
		cy.get('#new-takeoff-arm').should('contain.text', '42')
		cy.get('#new-takeoff-moment').should('contain.text', '102561')

		cy.get('#new-land-weight').should('contain.text', '2330')
		cy.get('#new-land-arm').should('contain.text', '42')
		cy.get('#new-land-moment').should('contain.text', '98241')

		//Performance after change
		cy.get('#perf-to-roll').should('contain.text', '1410')
		cy.get('#perf-to-50').should('contain.text', '2445')
		cy.get('#perf-climb').should('contain.text', '466')
		cy.get('#perf-land-roll').should('contain.text', '667')
		cy.get('#perf-land-50').should('contain.text', '1480')
	})
})
