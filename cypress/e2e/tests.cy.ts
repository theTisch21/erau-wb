/// <reference types="@cypress/xpath" />
let delay = 1000
let url = 'http://127.0.0.1:3000'

import { decodeMetar } from '../../src/lib/Calculators/metar'
import { doubleInterpolate } from '../../src/lib/interpolate'
import { roundToPrecision, round } from '../../src/lib/round'
import { calculateTable, type TableInput, type TableOutput } from '../../src/lib/Flow/table'

describe('Double interpolation', () => {
	// Double interpolation
	//    a1 at a2
	// b1 l1 c1 l2
	// bt    X
	// b2 l1 c2 l2

	it('1', () => {
		//    10 23    42
		// 2  23 34.78 52
		// 23    46.2861
		// 34 32 52.31 82
		//Yes, the a and b logic is reversed here. It should still work regardless
		const r = doubleInterpolate(
			{ a1: 10, l1: 23, a2: 42, l2: 52, b: 2 },
			{ a1: 10, l1: 32, a2: 42, l2: 82, b: 34 },
			23,
			23
		)
		const e = 46.2861
		expect(round(r)).eq(round(e))
	})
	it('2', () => {
		//    1 2 3
		// 1  5   3
		// 2  4 5 6
		// 3  3   9
		const r = doubleInterpolate(
			{ b: 1, a1: 1, l1: 5, a2: 3, l2: 3 },
			{ b: 3, a1: 1, l1: 3, a2: 3, l2: 9 },
			2,
			2
		)
		const e = 5
		expect(round(r)).eq(round(e))
	})
})

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
	it('Partial METARs', () => {
		expect(decodeMetar('KPRC 271853Z 17004KT 9SM SCT110 A3022 RMK AO2 SLPNO $')).deep.equal({
			wind: {
				speed: 4,
				isGusting: false
			},
			altimiter: 30.22
		})
		expect(
			decodeMetar('KPRC 271753Z 09003KT 10SM CLR A3023 RMK AO2 SLPNO 10322 20194 50000 $')
		).deep.equal({
			altimiter: 30.23,
			wind: {
				speed: 3,
				isGusting: false
			}
		})
		expect(decodeMetar('KPRC 271753Z 10SM CLR A3023 RMK AO2 SLPNO 10322 20194 50000 $')).deep.equal(
			{
				altimiter: 30.23
			}
		)
		expect(decodeMetar('KPRC 271653Z 05003KT 9SM CLR 31/11 RMK AO2 SLP136 T03110111')).deep.equal({
			wind: {
				speed: 3,
				isGusting: false
			},
			temp: 31
		})
		expect(decodeMetar('KPRC 271653Z 9SM CLRRMK AO2 SLP136 T03110111')).deep.equal({})
		expect(decodeMetar('Unable to load metar!')).deep.equal({})
		expect(decodeMetar('')).deep.equal({})
	})
})

describe('table calculations', () => {
	it('1', () => {
		expect(
			calculateTable({
				aircraft: { weight: 1706.4, arm: 41.4762, moment: 70775 },
				frontSeats: 350,
				rearSeats: 20,
				frontBags: 17,
				aftBags: 0,
				fuel: { start: 53, taxiBurn: 1.4, flightBurn: 15 }
			})
		).deep.equal({
			aircraft: {
				weight: 1706.4,
				arm: 41.4762,
				moment: 70775
			},
			frontSeats: {
				weight: 350,
				arm: 37,
				moment: 12950
			},
			rearSeats: {
				weight: 20,
				arm: 73,
				moment: 1460
			},
			frontBags: {
				weight: 17,
				arm: 95,
				moment: 1615
			},
			aftBags: {
				weight: 0,
				arm: 123,
				moment: 0
			},
			zeroFuel: {
				weight: 2093.4,
				moment: 86800,
				arm: 41.47
			},
			rampFuel: {
				gallons: 53,
				weight: 318,
				arm: 48,
				moment: 15264
			},
			ramp: {
				weight: 2411.4,
				moment: 102064,
				arm: 42.33
			},
			taxi: {
				gallons: -1.4,
				weight: -8.4,
				arm: 48,
				moment: -403.2
			},
			takeoff: {
				weight: 2403,
				moment: 101660.8,
				arm: 42.31
			},
			flight: {
				gallons: -15,
				weight: -90,
				arm: 48,
				moment: -4320
			},
			landing: {
				weight: 2313,
				moment: 97340.8,
				arm: 42.09
			}
		})
	})
})

describe('Aircraft Lookups', () => {
	beforeEach(() => {
		cy.visit(url)
		cy.wait(delay)
	})
	it('T-22', () => {
		cy.get('#aircraft-input').type('{selectAll}{backspace}')
		cy.get('#aircraft-input').type('T-22')
		cy.get('#aircraft-weight').should('contain.text', '1714')
		cy.get('#aircraft-arm').should('contain.text', '41')
		cy.get('#aircraft-moment').should('contain.text', '70880')
	})
	it('T-69', () => {
		cy.get('#aircraft-input').type('{selectAll}{backspace}')
		cy.get('#aircraft-input').type('T-69')
		cy.get('#aircraft-weight').should('contain.text', '1706')
		cy.get('#aircraft-arm').should('contain.text', '41')
		cy.get('#aircraft-moment').should('contain.text', '70775')
	})
	it('T-73', () => {
		cy.get('#aircraft-input').type('{selectAll}{backspace}')
		cy.get('#aircraft-input').type('T-73')
		cy.get('#aircraft-weight').should('contain.text', '1714')
		cy.get('#aircraft-arm').should('contain.text', '41')
		cy.get('#aircraft-moment').should('contain.text', '71457')
	})
})

describe('Pressure Altitude', () => {
	beforeEach(() => {
		cy.visit(url)
		cy.wait(delay)
	})
	it('Example 1', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}30.30')
		cy.get('#pa-result').should('contain.text', '4666')
	})
	it('Example 2', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.91')
		cy.get('#pa-result').should('contain.text', '5056')
	})
	it('Example 3', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}30.22')
		cy.get('#pa-result').should('contain.text', '4746')
	})
	it('Example 4', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.00')
		cy.get('#pa-result').should('contain.text', '5966')
	})
})

describe('Aircraft overrides', () => {
	beforeEach(() => {
		cy.visit(url)
		cy.wait(delay)
		//Click override
		cy.get('#aircraft-override-button').click()
		//Clear all inputs
		cy.get('#fs-weight').type('0')
		cy.get('#rs-weight').type('0')
		//Clear default survival kit weight
		cy.get('#fb-weight').type('{selectAll}{backspace}0')
	})
	it('Override 1', () => {
		//Clear fuel inputs
		cy.get('#rampFuel-gallon').type('{selectAll}{backspace}0')
		cy.get('#taxi-gallon').type('{selectAll}{backspace}0')
		cy.get('#flight-gallon').type('{selectAll}{backspace}0')
		//Set
		cy.get('#aircraft-weight').type('{selectAll}{backspace}1')
		cy.get('#aircraft-moment').type('{selectAll}{backspace}1')
		//Check
		cy.get('#ramp-weight').should('contain.text', '1')
		cy.get('#ramp-arm').should('contain.text', '1')
		cy.get('#ramp-moment').should('contain.text', '1')
	})
	it('Override 2', () => {
		//Clear fuel inputs
		cy.get('#rampFuel-gallon').type('{selectAll}{backspace}0')
		cy.get('#taxi-gallon').type('{selectAll}{backspace}0')
		cy.get('#flight-gallon').type('{selectAll}{backspace}0')
		//Set
		cy.get('#aircraft-weight').type('{selectAll}{backspace}1')
		cy.get('#aircraft-moment').type('{selectAll}{backspace}2')
		//Check
		cy.get('#ramp-weight').should('contain.text', '1')
		cy.get('#ramp-arm').should('contain.text', '2')
		cy.get('#ramp-moment').should('contain.text', '2')
	})
	it('Override 3', () => {
		//Clear fuel inputs
		cy.get('#rampFuel-gallon').type('{selectAll}{backspace}0')
		cy.get('#taxi-gallon').type('{selectAll}{backspace}0')
		cy.get('#flight-gallon').type('{selectAll}{backspace}0')
		//Set
		cy.get('#aircraft-weight').type('{selectAll}{backspace}2')
		cy.get('#aircraft-moment').type('{selectAll}{backspace}1')
		//Check
		cy.get('#ramp-weight').should('contain.text', '2')
		cy.get('#ramp-arm').should('contain.text', '0.5')
		cy.get('#ramp-moment').should('contain.text', '1')
	})
	it('Override 4', () => {
		//Set fuel inputs
		cy.get('#rampFuel-gallon').type('{selectAll}{backspace}53')
		cy.get('#taxi-gallon').type('{selectAll}{backspace}1.4')
		cy.get('#flight-gallon').type('{selectAll}{backspace}15')
		//Set
		cy.get('#aircraft-weight').type('{selectAll}{backspace}1723.7')
		cy.get('#aircraft-moment').type('{selectAll}{backspace}71676')
		//Add example data
		cy.get('#fs-weight').type('{selectAll}{backspace}360')
		//Check
		cy.get('#ramp-weight').should('contain.text', '2401')
		cy.get('#ramp-arm').should('contain.text', '41')
		cy.get('#ramp-moment').should('contain.text', '100260')
		//Also check performance
		//Set taxi gallon to 0 so that takeoff weight > 2400
		cy.get('#taxi-gallon').type('{selectAll}{backspace}0')
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}30.00')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}0')
		cy.get('#perf-to-roll').should('contain.text', '1355')
		cy.get('#perf-to-50').should('contain.text', '2345')
		cy.get('#perf-climb').should('contain.text', '515')
		cy.get('#perf-land-roll').should('contain.text', '655')
		cy.get('#perf-land-50').should('contain.text', '1460')
	})
})

describe('Max fuel button', () => {
	beforeEach(() => {
		//Refresh before each test to get a fresh sheet
		cy.visit(url)
		cy.wait(delay)
	})
	it('Test 1', () => {
		cy.get('#aircraft-input').type('R- 3')
		cy.get('#fs-weight').type('350')
		cy.get('#rs-weight').type('170')
		cy.get('#validation').should('contain.text', '2 gallons')
		cy.get('#max-fuel-button').click()
		cy.get('#validation').should('contain.text', 'Within normal limits')
		cy.get('#rampFuel-weight').should('contain.text', '306')
	})
	it('Test 2', () => {
		cy.get('#aircraft-input').type('T-69')
		cy.get('#fs-weight').type('350')
		cy.get('#rs-weight').type('200')
		cy.get('#validation').should('contain.text', '6 gallons')
		cy.get('#max-fuel-button').click()
		cy.get('#validation').should('contain.text', 'Within normal limits')
		cy.get('#rampFuel-weight').should('contain.text', '282')
	})
})

// Performance and overrides

describe('Winds', () => {
	beforeEach(() => {
		cy.visit(url)
		cy.wait(delay)
	})

	it('Calm wind', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.92')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}10')
		cy.get('#perf-wind-input').type('{selectAll}{backspace}0')
		cy.get('#perf-to-roll').should('contain.text', '1130')
		cy.get('#perf-to-50').should('contain.text', '1940')
		cy.get('#perf-climb').should('contain.text', '482.5')
		cy.get('#perf-land-roll').should('contain.text', '705')
		cy.get('#perf-land-50').should('contain.text', '1540')
	})

	it('Tailwind 1', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.92')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}10')
		cy.get('#perf-wind-tailwind').click()
		cy.get('#perf-wind-input').type('{selectAll}{backspace}5')
		cy.get('#perf-to-roll').should('contain.text', '1356')
		cy.get('#perf-to-50').should('contain.text', '2328')
		cy.get('#perf-climb').should('contain.text', '482.5')
		cy.get('#perf-land-roll').should('contain.text', '846')
		cy.get('#perf-land-50').should('contain.text', '1848')
	})

	it('Headwind 1', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.92')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}10')
		cy.get('#perf-wind-input').type('{selectAll}{backspace}11')
		cy.get('#perf-to-roll').should('contain.text', '1017')
		cy.get('#perf-to-50').should('contain.text', '1746')
		cy.get('#perf-climb').should('contain.text', '482.5')
		cy.get('#perf-land-roll').should('contain.text', '634')
		cy.get('#perf-land-50').should('contain.text', '1386')
	})

	it('Tailwind 2', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.92')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}10')
		cy.get('#perf-wind-tailwind').click()
		cy.get('#perf-wind-input').type('{selectAll}{backspace}10')
		cy.get('#perf-to-roll').should('contain.text', '1695')
		cy.get('#perf-to-50').should('contain.text', '2910')
		cy.get('#perf-climb').should('contain.text', '482.5')
		cy.get('#perf-land-roll').should('contain.text', '1057')
		cy.get('#perf-land-50').should('contain.text', '2310')
	})

	it('Headwind 2', () => {
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}29.92')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}10')
		cy.get('#perf-wind-input').type('{selectAll}{backspace}29')
		cy.get('#perf-to-roll').should('contain.text', '791')
		cy.get('#perf-to-50').should('contain.text', '1358')
		cy.get('#perf-climb').should('contain.text', '482.5')
		cy.get('#perf-land-roll').should('contain.text', '493')
		cy.get('#perf-land-50').should('contain.text', '1078')
	})
})
//We don't do general performance testing or maneuvering speed specifically, as that's covered by the example sheets.

//Takeoff weight override TODO
describe('Takeoff weight override', () => {
	beforeEach(() => {
		cy.visit(url)
		cy.wait(delay)
	})

	it('1', () => {
		cy.get('#aircraft-input').type('T-68')
		cy.get('#fs-weight').type('350')
		cy.get('#rs-weight').type('20')

		cy.get('#override-to-weight-box').click()
		cy.get('#to-weight-override').select('2400')
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}30.14')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}5')

		cy.get('#perf-to-roll').should('contain.text', '1217')
		cy.get('#perf-to-50').should('contain.text', '2097')
		cy.get('#perf-land-roll').should('contain.text', '667')
		cy.get('#perf-land-50').should('contain.text', '1480')
	})
})

describe('Rate of Climb', () => {
	beforeEach(() => {
		cy.visit(url)
		cy.wait(delay)
	})
	it('1', () => {
		cy.get('#perf-temp-input').type('{selectAll}{backspace}15')
		cy.get('#override-climb-alt').click()
		cy.get('#perf-climb-alt').type('{selectAll}{backspace}7500')

		cy.get('#perf-climb').should('contain.text', '386')
	})
	it('2', () => {
		cy.get('#perf-temp-input').type('{selectAll}{backspace}-15')
		cy.get('#override-climb-alt').click()
		cy.get('#perf-climb-alt').type('{selectAll}{backspace}2500')

		cy.get('#perf-climb').should('contain.text', '725')
	})
})

describe('Override change in aircraft', () => {
	beforeEach(() => {
		cy.visit(url)
		cy.wait(delay)
	})
	it('1', () => {
		cy.get('#aircraft-input').type('T-22')
		cy.get('#new-aircraft-button').click()
		cy.get('#change-aircraft-override-button').click()

		cy.get('#change-aircraft-override-weight').type('1715.7')
		cy.get('#change-aircraft-override-arm').type('42.33')
		cy.get('#change-aircraft-override-moment').type('70881')

		cy.get('#diff-weight').should('contain.text', '1')
		cy.get('#diff-arm').should('contain.text', '1')
		cy.get('#diff-moment').should('contain.text', '1')
	})
	it('2', () => {
		cy.get('#aircraft-input').type('T-69')
		cy.get('#new-aircraft-button').click()
		cy.get('#change-aircraft-override-button').click()

		cy.get('#change-aircraft-override-weight').type('1707.4')
		cy.get('#change-aircraft-override-arm').type('42.47')
		cy.get('#change-aircraft-override-moment').type('70776')

		cy.get('#diff-weight').should('contain.text', '1')
		cy.get('#diff-arm').should('contain.text', '1')
		cy.get('#diff-moment').should('contain.text', '1')
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

		//Performance
		cy.get('#pa-currentAltimiter').type('{selectAll}{backspace}30.14')
		cy.get('#perf-temp-input').type('{selectAll}{backspace}5')
		cy.get('#perf-to-roll').should('contain.text', '1410')
		cy.get('#perf-to-50').should('contain.text', '2445')
		cy.get('#perf-climb').should('contain.text', '498.75')
		cy.get('#perf-land-roll').should('contain.text', '667')
		cy.get('#perf-land-50').should('contain.text', '1480')
	})
	it('2', () => {
		cy.get('#aircraft-input').type('T-68')
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
		cy.get('#perf-climb').should('contain.text', '472.75')
		cy.get('#perf-land-roll').should('contain.text', '712')
		cy.get('#perf-land-50').should('contain.text', '1552')
	})
	it('3', () => {
		cy.get('#aircraft-input').type('T-57')
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
		cy.get('#perf-climb').should('contain.text', '405')
		cy.get('#perf-land-roll').should('contain.text', '712')
		cy.get('#perf-land-50').should('contain.text', '1552')
	})

	it('4', () => {
		cy.get('#aircraft-input').type('T-44')
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
		cy.get('#perf-temp-input').type('{selectAll}{backspace}7')
		cy.get('#perf-to-roll').should('contain.text', '1236')
		cy.get('#perf-to-50').should('contain.text', '2130')
		cy.get('#perf-climb').should('contain.text', '492.25')
		cy.get('#perf-land-roll').should('contain.text', '672')
		cy.get('#perf-land-50').should('contain.text', '1488')

		//Maneuvering speed before aircraft change
		cy.get('#va-output').should('contain.text', '99.3')

		//Change in aircraft
		cy.get('#new-aircraft-button').click()
		cy.get('#new-aircraft-input').type('T-55')

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
		cy.get('#perf-to-roll').should('contain.text', '1432')
		cy.get('#perf-to-50').should('contain.text', '2485')
		cy.get('#perf-climb').should('contain.text', '492.25')
		cy.get('#perf-land-roll').should('contain.text', '672')
		cy.get('#perf-land-50').should('contain.text', '1488')

		//Maneuvering speed after change
		cy.get('#va-output').should('contain.text', '100.3')
	})
	it('5', () => {
		cy.get('#aircraft-input').type('T-57')
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

		//Maneuvering speed before aircraft change
		cy.get('#va-output').should('contain.text', '100.3')

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
		cy.get('#perf-temp-input').type('{selectAll}{backspace}-7')
		cy.get('#perf-to-roll').should('contain.text', '1235')
		cy.get('#perf-to-50').should('contain.text', '2120')
		cy.get('#perf-climb').should('contain.text', '536')
		cy.get('#perf-land-roll').should('contain.text', '630')
		cy.get('#perf-land-50').should('contain.text', '1425')

		//Maneuvering speed after change
		cy.get('#va-output').should('contain.text', '100.0')
	})
})
