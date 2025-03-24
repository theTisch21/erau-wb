import { WB } from '$lib/WBError'
import { interpolate } from '$lib/interpolate'
import { down, up } from '$lib/round'
import { Component } from './flow'

export type ClimbLine = {
	altitude: number
	climbSpeed: number
	cm20: number
	c0: number
	c20: number
	c40: number
}

const climbRateList: ClimbLine[] = [
	{ altitude: 0, climbSpeed: 74, cm20: 855, c0: 785, c20: 710, c40: 645 },
	{ altitude: 2000, climbSpeed: 73, cm20: 760, c0: 695, c20: 625, c40: 560 },
	{ altitude: 4000, climbSpeed: 73, cm20: 685, c0: 620, c20: 555, c40: 495 },
	{ altitude: 6000, climbSpeed: 73, cm20: 575, c0: 515, c20: 450, c40: 390 },
	{ altitude: 8000, climbSpeed: 72, cm20: 465, c0: 405, c20: 345, c40: 285 },
	{ altitude: 10000, climbSpeed: 72, cm20: 360, c0: 300, c20: 240, c40: 180 },
	{ altitude: 12000, climbSpeed: 72, cm20: 255, c0: 195, c20: 135, c40: NaN }
]

function getClimbLine(altitude: number): ClimbLine {
	//Does not interpolate, will throw error if not found
	let out = null
	climbRateList.forEach((line) => {
		if (line.altitude == altitude) out = line
	})
	if (out == null) throw new WB(103, 'internal error')
	return out
}

export function getClimbRate(altitude: number, temp: number): number {
	//There's no data for 12000 and 40, so check for that
	if (altitude > 10000 && temp > 20) {
		throw new WB(
			9999,
			'Pressure altitude exceeds 10,000ft and temperature 20°C. There is no data available for this range',
			Component.PerfTemp
		)
	}

	if (temp > 40) throw new WB(104, 'Temperature is > 40°C', Component.PerfTemp)

	if (Number.isNaN(altitude)) throw new WB(105, 'Climb altitude invalid', Component.PerfResult) //If invalid input is passed, err on the side of caution. TODO make this throw an error
	if (altitude > 12000) {
		throw new WB(106, 'Pressure altitude greater than 12,000ft', Component.PressureAltitude)
	}
	if (altitude < -10000) {
		throw new WB(
			9999,
			'Pressure altitude less than negative 10,000ft, data likely not valid',
			Component.PressureAltitude
		)
	}
	if (altitude < 0) altitude = 0

	let upperAltitude = up(altitude, 1000) //Get next thousand up
	if ((upperAltitude / 1000) % 2 != 0) {
		//If thousand is not even
		upperAltitude += 1000
	}

	let lowerAltitude = down(altitude, 1000) //Get last thousand down
	if ((lowerAltitude / 1000) % 2 != 0) {
		//If thousand is not even
		lowerAltitude -= 1000
	}

	const upperLine = getClimbLine(upperAltitude)
	const lowerLine = getClimbLine(lowerAltitude)

	let lower: number
	let upper: number
	if (temp < -20) {
		lower = lowerLine.cm20
		upper = upperLine.cm20
	} else if (temp < 0) {
		//Use -20 - 0
		lower = interpolate(lowerLine.cm20, lowerLine.c0, (20 + temp) / 20)
		upper = interpolate(upperLine.cm20, upperLine.c0, (20 + temp) / 20)
	} else if (temp < 20) {
		//Use 0-20
		lower = interpolate(lowerLine.c0, lowerLine.c20, temp / 20)
		upper = interpolate(upperLine.c0, upperLine.c20, temp / 20)
	} else {
		//Use 20 - 40
		lower = interpolate(lowerLine.c20, lowerLine.c40, (temp - 20) / 20)
		upper = interpolate(upperLine.c20, upperLine.c40, (temp - 20) / 20)
	}

	if ((altitude / 1000) % 2 == 0) {
		//If already an even thousand, no need to interpolate
		return lower
	}

	return down(interpolate(lower, upper, (altitude - lowerAltitude) / 2000), 1)
}
