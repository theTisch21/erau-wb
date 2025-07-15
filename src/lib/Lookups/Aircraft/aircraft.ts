import { WB } from '$lib/WBError'

export type Aircraft = {
	name: string
	tailNumber: string
	weight: number
	moment: number
	arm: number
}

const list: Aircraft[] = [
	{
		name: 'R- 1',
		tailNumber: 'N912MA',
		weight: 1325.72,
		arm: 12.4164,
		moment: 16460.72
	},
	{
		name: 'R- 2',
		tailNumber: 'N602ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R- 3',
		tailNumber: 'N603ER',
		weight: 1712.4,
		arm: 40.8164,
		moment: 69894
	},
	{
		name: 'R- 4',
		tailNumber: 'N604ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R- 5',
		tailNumber: 'N605ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R- 6',
		tailNumber: 'N506ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R- 7',
		tailNumber: 'N507ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R- 8',
		tailNumber: 'N608ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R- 9',
		tailNumber: 'N509ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-10',
		tailNumber: 'N610ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R-11',
		tailNumber: 'N511ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-12',
		tailNumber: 'N712ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-13',
		tailNumber: 'N513ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-14',
		tailNumber: 'N614ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R-15',
		tailNumber: 'N615ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R-16',
		tailNumber: 'N516ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-17',
		tailNumber: 'N617ER',
		weight: 1713.4,
		arm: 41.1608,
		moment: 70525
	},
	{
		name: 'R-18',
		tailNumber: 'N718ER',
		weight: 1713.4,
		arm: 41.3529,
		moment: 70854
	},
	{
		name: 'R-19',
		tailNumber: 'N619ER',
		weight: 1714.8,
		arm: 41.6707,
		moment: 71457
	},
	{
		name: 'R-20',
		tailNumber: 'N620ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-21',
		tailNumber: 'N721ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-22',
		tailNumber: 'N522ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-23',
		tailNumber: 'N623ER',
		weight: 1645,
		arm: 39.2298,
		moment: 64533
	},
	{
		name: 'R-24',
		tailNumber: 'N724ER',
		weight: 1713.4,
		arm: 41.3529,
		moment: 70854
	},
	{
		name: 'R-25',
		tailNumber: 'N625ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-26',
		tailNumber: 'N726ER',
		weight: 1726.8,
		arm: 41.7779,
		moment: 72142
	},
	{
		name: 'R-27',
		tailNumber: 'N627ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-28',
		tailNumber: 'N728ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-29',
		tailNumber: 'N629ER',
		weight: 1711.4,
		arm: 41.1704,
		moment: 70459
	},
	{
		name: 'R-30',
		tailNumber: 'N730ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-31',
		tailNumber: 'N531ER',
		weight: 1701.2,
		arm: 41.185,
		moment: 70064
	},
	{
		name: 'R-32',
		tailNumber: 'N532ER',
		weight: 1699.2,
		arm: 41.4183,
		moment: 70378
	},
	{
		name: 'R-33',
		tailNumber: 'N733ER',
		weight: 1699.2,
		arm: 41.4183,
		moment: 70378
	},
	{
		name: 'R-34',
		tailNumber: 'N534ER',
		weight: 1699.2,
		arm: 41.4183,
		moment: 70378
	},
	{
		name: 'R-35',
		tailNumber: 'N535ER',
		weight: 1699.2,
		arm: 41.4183,
		moment: 70378
	},
	{
		name: 'R-36',
		tailNumber: 'N536ER',
		weight: 1699.2,
		arm: 41.4183,
		moment: 70378
	},
	{
		name: 'R-37',
		tailNumber: 'N537ER',
		weight: 1699.2,
		arm: 41.4183,
		moment: 70378
	},
	{
		name: 'R-38',
		tailNumber: 'N538ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-39',
		tailNumber: 'N639ER',
		weight: 1684.73,
		arm: 40.5176,
		moment: 68261.29
	},
	{
		name: 'R-40',
		tailNumber: 'N540ER',
		weight: 1712.6,
		arm: 41.8463,
		moment: 71666
	},
	{
		name: 'R-41',
		tailNumber: 'N541ER',
		weight: 1706.3,
		arm: 42.0196,
		moment: 71698
	},
	{
		name: 'R-42',
		tailNumber: 'N542ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-43',
		tailNumber: 'N543ER',
		weight: 1712.6,
		arm: 41.8463,
		moment: 71666
	},
	{
		name: 'R-430',
		tailNumber: 'N430ER',
		weight: 1682.67,
		arm: 40.4094,
		moment: 67995.76
	},
	{
		name: 'R-44',
		tailNumber: 'N544ER',
		weight: 1712.6,
		arm: 41.8463,
		moment: 71666
	},
	{
		name: 'R-473',
		tailNumber: 'N473ER',
		weight: 1679.65,
		arm: 40.9705,
		moment: 68816.14
	},
	{
		name: 'R-479',
		tailNumber: 'N479ER',
		weight: 1682.75,
		arm: 40.7568,
		moment: 68583.49
	},
	{
		name: 'R-494',
		tailNumber: 'N494ER',
		weight: 1683.28,
		arm: 40.7786,
		moment: 68641.79
	},
	{
		name: 'R-498',
		tailNumber: 'N498ER',
		weight: 1681.25,
		arm: 40.7976,
		moment: 68590.99
	},
	{
		name: 'R-499',
		tailNumber: 'N499ER',
		weight: 1680.87,
		arm: 40.7539,
		moment: 68502.09
	},
	{
		name: 'R-50',
		tailNumber: 'N350ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-51',
		tailNumber: 'N651ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-53',
		tailNumber: 'N653ER',
		weight: 1723.7,
		arm: 41.5826,
		moment: 71676
	},
	{
		name: 'R-54',
		tailNumber: 'N554ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-55',
		tailNumber: 'N655ER',
		weight: 1723.7,
		arm: 41.5826,
		moment: 71676
	},
	{
		name: 'R-56',
		tailNumber: 'N656ER',
		weight: 1723.7,
		arm: 41.5826,
		moment: 71676
	},
	{
		name: 'R-57',
		tailNumber: 'N657ER',
		weight: 1723.7,
		arm: 41.5826,
		moment: 71676
	},
	{
		name: 'R-58',
		tailNumber: 'N658ER',
		weight: 1706.4,
		arm: 41.4762,
		moment: 70775
	},
	{
		name: 'R-59',
		tailNumber: 'N659ER',
		weight: 1706.4,
		arm: 41.4762,
		moment: 70775
	},
	{
		name: 'R-60',
		tailNumber: 'N660ER',
		weight: 1706.4,
		arm: 41.4762,
		moment: 70775
	},
	{
		name: 'R-61',
		tailNumber: 'N661ER',
		weight: 1708.4,
		arm: 41.437,
		moment: 70791
	},
	{
		name: 'R-62',
		tailNumber: 'N662ER',
		weight: 1706.4,
		arm: 41.4762,
		moment: 70775
	},
	{
		name: 'R-63',
		tailNumber: 'N563ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-64',
		tailNumber: 'N664ER',
		weight: 1708.4,
		arm: 41.437,
		moment: 70791
	},
	{
		name: 'R-65',
		tailNumber: 'N565ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-66',
		tailNumber: 'N566ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-67',
		tailNumber: 'N667ER',
		weight: 1708.4,
		arm: 41.437,
		moment: 70791
	},
	{
		name: 'R-68',
		tailNumber: 'N668ER',
		weight: 1706.4,
		arm: 41.4762,
		moment: 70775
	},
	{
		name: 'R-69',
		tailNumber: 'N669ER',
		weight: 1706.4,
		arm: 41.4762,
		moment: 70775
	},
	{
		name: 'R-70',
		tailNumber: 'N670ER',
		weight: 1720.4,
		arm: 41.0654,
		moment: 70649
	},
	{
		name: 'R-71',
		tailNumber: 'N671ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R-72',
		tailNumber: 'N672ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R-73',
		tailNumber: 'N673ER',
		weight: 1714.8,
		arm: 41.6707,
		moment: 71457
	},
	{
		name: 'R-74',
		tailNumber: 'N674ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R-75',
		tailNumber: 'N675ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R-76',
		tailNumber: 'N676ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R-77',
		tailNumber: 'N577ER',
		weight: 1714.7,
		arm: 41.3367,
		moment: 70880
	},
	{
		name: 'R-78',
		tailNumber: 'N578ER',
		weight: 1651,
		arm: 39.4131,
		moment: 65071
	},
	{
		name: 'R-79',
		tailNumber: 'N679ER',
		weight: 1707.7,
		arm: 41.071,
		moment: 70137
	},
	{
		name: 'R-82',
		tailNumber: 'N4944S',
		weight: 1881.28,
		arm: 38.1025,
		moment: 71681.5
	},
	{
		name: 'R-90',
		tailNumber: 'N790ER',
		weight: 3259.53,
		arm: 95.47,
		moment: 311187.33
	},
	{
		name: 'R-91',
		tailNumber: 'N791ER',
		weight: 3251.818,
		arm: 95.47,
		moment: 310451.06
	},
	{
		name: 'R-92',
		tailNumber: 'N792ER',
		weight: 3248.5,
		arm: 95.47,
		moment: 310134.3
	},
	{
		name: 'R-93',
		tailNumber: 'N793ER',
		weight: 3278.22,
		arm: 95.6714,
		moment: 313632
	},
	{
		name: 'R-94',
		tailNumber: 'N694ER',
		weight: 3273.87,
		arm: 95.709,
		moment: 313338.82
	},
	{
		name: 'R-96',
		tailNumber: 'N596ER',
		weight: 3269.8179,
		arm: 95.437,
		moment: 312061.61
	},
	{
		name: 'R-97',
		tailNumber: 'N597ER',
		weight: 3269.82,
		arm: 95.5965,
		moment: 312583.43
	},
	{
		name: 'R-98',
		tailNumber: 'N598ER',
		weight: 3249.98,
		arm: 95.3612,
		moment: 309921.96
	},
	{
		name: 'R-99',
		tailNumber: 'N599ER',
		weight: 3274.23,
		arm: 95.5572,
		moment: 312876.17
	}
]

const testList: Aircraft[] = [
	{ name: 'T-22', tailNumber: 'NTEST22', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'T-69', tailNumber: 'NTEST69', weight: 1706.4, arm: 41.4762, moment: 70775 },
	{ name: 'T-73', tailNumber: 'NTEST73', weight: 1714.8, arm: 41.6707, moment: 71457 },
	{ name: 'T-68', tailNumber: 'NTEST68', weight: 1706.4, arm: 41.4762, moment: 70775 },
	{ name: 'T-57', tailNumber: 'NTEST57', weight: 1723.7, arm: 41.5826, moment: 71676 },
	{ name: 'T-44', tailNumber: 'NTEST44', weight: 1675.16, arm: 40.6866, moment: 68156.59 },
	{ name: 'T-55', tailNumber: 'NTEST55', weight: 1723.7, arm: 41.5826, moment: 71676 }
]

export function trimAircraft(input: string): string | null {
	const pattern = /([RT]-[\d ]\d*).*/
	const output = pattern.exec(input)
	if (output == null || output[1] == null) return null
	return output[1]
}

export async function lookupAircraft(name: string): Promise<Aircraft | null> {
	let out = null
	const actualName: string | null = trimAircraft(name.trim())
	if (actualName == null) return null
	list.forEach((plane) => {
		if (plane.name == actualName) out = plane
	})
	//If aircraft not found, check test list
	if (out == null) {
		testList.forEach((plane) => {
			if (plane.name == actualName) {
				out = plane
			}
		})
	}
	return out
}
