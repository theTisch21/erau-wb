//This file is simply to parse the CSV data from ETA and excel to convert it to a format we can use

import { type Aircraft } from './aircraft'

function trimAircraft(input: string): string | null {
	const pattern = /(R-[\d ]\d*).*/ //T isn't parsed here because those aircraft need to be keyed in manually
	const output = pattern.exec(input)
	if (output == null || output[1] == null) return null
	return output[1]
}

export async function parse() {
	//Tab separated file in this format: Name, N#, Empty weight, Moment, Arm, Useful Load, Max Gross Weight
	const input = `R- 1	N912MA	1325.72	16460.72	12.4164	474.28	1800
	R- 2	N602ER	1707.7	70137	41.071	850.3	2558
	R- 3	N603ER	1712.4	69894	40.8164	845.6	2558
	R- 4	N604ER	1707.7	70137	41.071	850.3	2558
	R- 5	N605ER	1707.7	70137	41.071	850.3	2558
	R- 6	N506ER	1714.7	70880	41.3367	843.3	2558
	R- 7	N507ER	1714.7	70880	41.3367	843.3	2558
	R- 8	N608ER	1707.7	70137	41.071	850.3	2558
	R- 9	N509ER	1714.7	70880	41.3367	843.3	2558
	R-10*	N610ER	1707.7	70137	41.071	850.3	2558
	R-11	N511ER	1714.7	70880	41.3367	843.3	2558
	R-12	N712ER	1714.7	70880	41.3367	843.3	2558
	R-13	N513ER	1714.7	70880	41.3367	843.3	2558
	R-14	N614ER	1707.7	70137	41.071	850.3	2558
	R-15	N615ER	1707.7	70137	41.071	850.3	2558
	R-16	N516ER	1714.7	70880	41.3367	843.3	2558
	R-17	N617ER	1713.4	70525	41.1608	844.6	2558
	R-18	N718ER	1713.4	70854	41.3529	844.6	2558
	R-19	N619ER	1714.8	71457	41.6707	843.2	2558
	R-20	N620ER	1714.7	70880	41.3367	843.3	2558
	R-21	N721ER	1714.7	70880	41.3367	843.3	2558
	R-22	N522ER	1714.7	70880	41.3367	843.3	2558
	R-23 SPIN	N623ER	1645	64533	39.2298	913	2558
	R-24	N724ER	1713.4	70854	41.3529	844.6	2558
	R-25	N625ER	1714.7	70880	41.3367	843.3	2558
	R-26	N726ER	1726.8	72142	41.7779	831.2	2558
	R-27	N627ER	1714.7	70880	41.3367	843.3	2558
	R-28	N728ER	1714.7	70880	41.3367	843.3	2558
	R-29	N629ER	1711.4	70459	41.1704	846.6	2558
	R-30	N730ER	1714.7	70880	41.3367	843.3	2558
	R-31 AF	N531ER	1701.2	70064	41.185	856.8	2558
	R-32 AF	N532ER	1699.2	70378	41.4183	858.8	2558
	R-33 AF	N733ER	1699.2	70378	41.4183	858.8	2558
	R-34 AF	N534ER	1699.2	70378	41.4183	858.8	2558
	R-35 AF	N535ER	1699.2	70378	41.4183	858.8	2558
	R-36 AF	N536ER	1699.2	70378	41.4183	858.8	2558
	R-38 AF	N538ER	1714.7	70880	41.3367	843.3	2558
	R-39 W	N639ER	1684.73	68261.29	40.5176	873.27	2558
	R-42	N542ER	1714.7	70880	41.3367	843.3	2558
	R-430 W*	N430ER	1682.67	67995.76	40.4094	875.33	2558
	R-473 W*	N473ER	1679.65	68816.14	40.9705	878.35	2558
	R-479 W*	N479ER	1682.75	68583.49	40.7568	875.25	2558
	R-494 W*	N494ER	1683.28	68641.79	40.7786	874.72	2558
	R-498 W*	N498ER	1681.25	68590.99	40.7976	876.75	2558
	R-50 W	N350ER	1714.7	70880	41.3367	843.3	2558
	R-51 W	N651ER	1714.7	70880	41.3367	843.3	2558
	R-53 W	N653ER	1723.7	71676	41.5826	834.3	2558
	R-54 W	N554ER	1714.7	70880	41.3367	843.3	2558
	R-55 W	N655ER	1723.7	71676	41.5826	834.3	2558
	R-56 W	N656ER	1723.7	71676	41.5826	834.3	2558
	R-57 W	N657ER	1723.7	71676	41.5826	834.3	2558
	R-58 W	N658ER	1706.4	70775	41.4762	851.6	2558
	R-59 W	N659ER	1706.4	70775	41.4762	851.6	2558
	R-60 W	N660ER	1706.4	70775	41.4762	851.6	2558
	R-61 W	N661ER	1708.4	70791	41.437	849.6	2558
	R-62 W	N662ER	1706.4	70775	41.4762	851.6	2558
	R-63 W	N563ER	1714.7	70880	41.3367	843.3	2558
	R-64 W	N664ER	1708.4	70791	41.437	849.6	2558
	R-65 W	N565ER	1714.7	70880	41.3367	843.3	2558
	R-66 W	N566ER	1714.7	70880	41.3367	843.3	2558
	R-67 W	N667ER	1708.4	70791	41.437	849.6	2558
	R-68 W	N668ER	1706.4	70775	41.4762	851.6	2558
	R-69 W	N669ER	1706.4	70775	41.4762	851.6	2558
	R-70 W	N670ER	1720.4	70649	41.0654	837.6	2558
	R-71 W	N671ER	1707.7	70137	41.071	850.3	2558
	R-72 W	N672ER	1707.7	70137	41.071	850.3	2558
	R-73 W	N673ER	1714.8	71457	41.6707	843.2	2558
	R-74 W	N674ER	1707.7	70137	41.071	850.3	2558
	R-75 W	N675ER	1707.7	70137	41.071	850.3	2558
	R-76 W	N676ER	1707.7	70137	41.071	850.3	2558
	R-77 W	N577ER	1714.7	70880	41.3367	843.3	2558
	R-78 SPIN	N578ER	1651	65071	39.4131	907	2558
	R-79 W	N679ER	1707.7	70137	41.071	850.3	2558
	R-82	N4944S	1881.28	71681.5	38.1025	1218.72	3100
	R-90	N790ER	3259.53	311187.33	95.47	1147.47	4407
	R-91	N791ER	3251.818	310451.06	95.47	1155.182	4407
	R-92	N792ER	3248.5	310134.3	95.47	1158.5	4407
	R-93	N793ER	3278.22	313632	95.6714	1128.78	4407
	R-94	N694ER	3273.87	313338.82	95.709	1133.13	4407
	R-96	N596ER	3269.8179	312061.61	95.437	1137.1821	4407
	R-97	N597ER	3269.82	312583.43	95.5965	1137.18	4407
	R-98	N598ER	3249.98	309921.96	95.3612	1157.02	4407
	R-99	N599ER	3274.23	312876.17	95.5572	1132.77	4407`
	const output: Aircraft[] = []
	const array: string[] = input.split(/\n/)
	for (let i = 0; i < array.length; i++) {
		const a = array[i].trim()
		const aircraftArray = a.split(/\t/)
		let aircraftName: string | null = aircraftArray[0]
		// Trims based on * and space, to properly parse 430 and like
		aircraftName = trimAircraft(aircraftName)
		if (aircraftName == null) throw 'HELP'
		output.push({
			name: aircraftName,
			tailNumber: aircraftArray[1],
			weight: Number(aircraftArray[2]),
			arm: Number(aircraftArray[4]),
			moment: Number(aircraftArray[3])
		})
	}
	return output
}

// To actually execute the parsing code above
parse().then((a) => {
	console.log(a)
})
//tsc .\parse.ts;  mv .\parse.js .\parse.cjs; node .\parse.cjs; rm .\parse.cjs; rm .\aircraft.js
