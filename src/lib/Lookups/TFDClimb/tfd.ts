import { interpolate } from '$lib/interpolate'
import { roundTo2Thousand } from '$lib/round'

export type tfdOutput = {
	time: number
	fuel: number
	distance: number
}

export type tfdLine = {
	altitude: number
	stdTemp: number
	time: number
	fuel: number
	distance: number
}

const tfdList: tfdLine[] = [
	{ altitude: 0, stdTemp: 15, time: 0, fuel: 0, distance: 0 },
	{ altitude: 1000, stdTemp: 13, time: 1, fuel: 0.4, distance: 2 },
	{ altitude: 2000, stdTemp: 11, time: 3, fuel: 0.8, distance: 4 },
	{ altitude: 3000, stdTemp: 9, time: 4, fuel: 1.2, distance: 6 },
	{ altitude: 4000, stdTemp: 7, time: 6, fuel: 1.5, distance: 8 },
	{ altitude: 5000, stdTemp: 5, time: 8, fuel: 1.9, distance: 10 },
	{ altitude: 6000, stdTemp: 3, time: 10, fuel: 2.2, distance: 13 },
	{ altitude: 7000, stdTemp: 1, time: 12, fuel: 2.6, distance: 16 },
	{ altitude: 8000, stdTemp: -1, time: 14, fuel: 3, distance: 19 },
	{ altitude: 9000, stdTemp: -3, time: 17, fuel: 3.4, distance: 22 },
	{ altitude: 10000, stdTemp: -5, time: 20, fuel: 3.9, distance: 27 },
	{ altitude: 11000, stdTemp: -7, time: 24, fuel: 4.4, distance: 32 },
	{ altitude: 12000, stdTemp: -9, time: 28, fuel: 5, distance: 38 }
]

function getTfdLine(altitude: number): tfdLine {
	let out = null
	if (altitude > 12000) return getTfdLine(12000)
	tfdList.forEach((item) => {
		if (item.altitude == altitude) {
			out = item
		}
	})
	if (out == null) {
		return getTfdLine(altitude + 2000) //Go to next thousand
	}
	return out
}

function getInterpolatedTfdLine(altitude: number, temp: number): tfdLine {
	const multi = calculateMultiplier(temp)
	if (altitude > 12000) {
		throw new Error(
			"Altitude above service ceiling. Are you sure whatever you're doing is worth it?"
		)
	}
	const upperAlt = roundTo2Thousand(altitude, false) //Round to next 2thousand up
	const lowerAlt = roundTo2Thousand(altitude, true) //Round to next 2thousand down

	const upperLine = getTfdLine(upperAlt)
	const lowerLine = getTfdLine(lowerAlt)

	const percent = (upperAlt - lowerAlt) / (altitude - lowerAlt)

	return {
		altitude: interpolate(lowerLine.altitude, upperLine.altitude, percent) * multi,
		time: interpolate(lowerLine.time, upperLine.time, percent) * multi,
		fuel: interpolate(lowerLine.fuel, upperLine.fuel, percent) * multi,
		distance: interpolate(lowerLine.distance, upperLine.distance, percent) * multi,
		stdTemp: interpolate(lowerLine.stdTemp, upperLine.stdTemp, percent) * multi
	}
}

function calculateMultiplier(temp: number) {
	if (temp < 0) return 1
	const times = Math.floor(temp / 10)
	return Math.floor(0.1 * times * 10) / 10 //A little funky, but nicely handles floating point problems
}

function calculateTFD(
	startAlt: number,
	startTemp: number,
	endAlt: number,
	endTemp: number
): tfdOutput {
	const startLine = getInterpolatedTfdLine(startAlt, startTemp)
	const endLine = getInterpolatedTfdLine(endAlt, endTemp)
	const time = endLine.time - startLine.time
	const fuel = endLine.fuel - startLine.fuel
	const distance = endLine.distance - startLine.distance
	return {
		time: time,
		fuel: fuel,
		distance: distance
	}
}
