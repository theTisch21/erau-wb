export type DecodedMetar = {
	wind: {
		speed: number
		isGusting: boolean
		gust?: number
	}
	altimiter: number
	temp: number
}

export const regexTable = {
	wind: / ((\d\d\d)?(?:VRB)?(\d\d)(G\d\d)?)KT/,
	altimiter: /A(\d\d\d\d)/,
	temp: / (M?\d\d)\/(M?\d\d) /
}

export function decodeMetar(metar: string): DecodedMetar {
	const output: DecodedMetar = {
		wind: {
			speed: 0,
			isGusting: false
		},
		altimiter: 0,
		temp: 0
	}

	//Wind
	output.wind = decodeWind(metar)

	//Altimiter
	const altResult = metar.match(regexTable.altimiter)
	if (altResult == null) {
		throw new Error('Invalid altimiter data')
	}
	//We need to add a decimal point in the middle, do that here
	const decimalAlt = `${altResult[1].substring(0, 2)}.${altResult[1].substring(2, 4)}`
	//Ready for parsing
	output.altimiter = Number(decimalAlt)

	//Temperature
	const tempResult = metar.match(regexTable.temp)
	if (tempResult == null) {
		throw new Error('Invalid temp data')
	}
	const tempString = tempResult[1]
	if (tempString.includes('M')) {
		output.temp = -1 * Number(tempString.substring(1))
	} else {
		output.temp = Number(tempString)
	}

	return output
}

function decodeWind(metar: string): DecodedMetar['wind'] {
	const output: DecodedMetar['wind'] = {
		speed: 0,
		isGusting: false
	}
	//Parse
	const windResult = metar.match(regexTable.wind)
	if (windResult == null) {
		throw new Error('Invalid wind data')
	}
	//Speed
	output.speed = Number(windResult[3])
	//Gust
	output.isGusting = windResult[0].includes('G')
	if (output.isGusting) output.gust = Number(windResult[4].charAt(1) + windResult[4].charAt(2)) //I don't feel like writing more complicated parse code, so here we are

	return output
}
