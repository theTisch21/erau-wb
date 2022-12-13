
//This file is simply to parse CSV data to convert it to a format we can use

import type { AltitudeLine } from "./performance"

export async function parse() {
	//A CSV in this format: Altitude, 0c, 10c, 20c, 30c, 40c
    const input = `0,1465,1575,1690,1810,1945
	1000,1600,1720,1850,1990,2135
	2000,1755,1890,2035,2190,2355
	3000,1925,2080,2240,2420,2605
	4000,2120,2295,2480,2685,2880
	5000,2345,2545,2755,2975,3205
	6000,2605,2830,3075,3320,3585
	7000,2910,3170,3440,3730,4045
	8000,3265,3575,3880,4225,4615`

	const output: AltitudeLine[] = []
	const array: string[] = input.split(/\n/)
	for (let i = 0; i < array.length; i++) {
		const a = array[i]
		const currentLineArray = a.split(/,/)
		output.push({
			altitude: Number(currentLineArray[0]),
			c0: Number(currentLineArray[1]),
			c10: Number(currentLineArray[2]),
			c20: Number(currentLineArray[3]),
			c30: Number(currentLineArray[4]),
			c40: Number(currentLineArray[5]),
		})
	}
	return output
}

/* To actually execute the parsing code above*/
parse().then((a) => {
	console.log(a)
})
