//This file is simply to parse CSV data to convert it to a format we can use

import type { tfdLine } from './tfd'

export async function parse() {
	//A CSV in this format: Altitude, temp, time, fuel, distance
	const input = `0,15,0,0,0
	1000,13,1,0.4,2
	2000,11,3,0.8,4
	3000,9,4,1.2,6
	4000,7,6,1.5,8
	5000,5,8,1.9,10
	6000,3,10,2.2,13
	7000,1,12,2.6,16
	8000,-1,14,3,19
	9000,-3,17,3.4,22
	10000,-5,20,3.9,27
	11000,-7,24,4.4,32
	12000,-9,28,5,38`

	const output: tfdLine[] = []
	const array: string[] = input.split(/\n/)
	for (let i = 0; i < array.length; i++) {
		const a = array[i]
		const currentLineArray = a.split(/,/)
		output.push({
			altitude: Number(currentLineArray[0]),
			stdTemp: Number(currentLineArray[1]),
			time: Number(currentLineArray[2]),
			fuel: Number(currentLineArray[3]),
			distance: Number(currentLineArray[4])
		})
	}
	return output
}

/* To actually execute the parsing code above*/
parse().then((a) => {
	console.log(a)
})
