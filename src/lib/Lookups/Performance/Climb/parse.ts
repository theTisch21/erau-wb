import type { ClimbLine } from './climbRate'

export async function parse() {
	//A CSV in this format: Altitude, Climb Speed, -20c, 0c, 20c, 40c
	const input = `0,74,855,785,710,645
    2000,73,760,695,625,560
    4000,73,685,620,555,495
    6000,73,575,515,450,390
    8000,72,465,405,345,285
    10000,72,360,300,240,180
    12000,72,255,195,135,---`

	const output: ClimbLine[] = []
	const array: string[] = input.split(/\n/)
	for (let i = 0; i < array.length; i++) {
		const a = array[i]
		const currentLineArray = a.split(/,/)
		output.push({
			altitude: Number(currentLineArray[0]),
			climbSpeed: Number(currentLineArray[1]),
			cm20: Number(currentLineArray[2]),
			c0: Number(currentLineArray[3]),
			c20: Number(currentLineArray[4]),
			c40: Number(currentLineArray[5])
		})
	}
	return output
}

/* To actually execute the parsing code above*/
parse().then((a) => {
	console.log(a)
})
