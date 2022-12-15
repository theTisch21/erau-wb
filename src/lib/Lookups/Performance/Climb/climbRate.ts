import { interpolate } from '$lib/interpolate'
import { roundToPrecision } from '$lib/round'

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
export function getClimbLine(altitude: number): ClimbLine {
	
	altitude = roundToPrecision(altitude, .001, false) //Round to next thousand up

	if(altitude / 1000 % 2 != 0) { //If thousand is not even
		altitude += 1000
	}

	if(altitude > 12000) {
		return getClimbLine(12000)
	}
	let out = null
	climbRateList.forEach((line) => {
		if (line.altitude == altitude) out = line
	})
	if(out == null) {
		return getClimbLine(altitude + 2000) //Go to next thousand
	}
	return out
}

export function getClimbRate(altitude:number, temp: number): {rate: number, altitude: number} {
	const line: ClimbLine = getClimbLine(altitude)
	//There's no data for 12000 and 40, so check for that
	if(altitude > 10000 && temp > 20) {
		//TODO warn user
	}
	if(temp < -20) {
		return {rate: line.cm20, altitude: line.altitude}
	} else if(temp < 0) {
		//Use -20 - 0
		return {rate: interpolate(line.cm20, line.c0, (temp * -1)/20), altitude: line.altitude}
	} else if(temp < 20) {
		//Use 0-20
		return {rate: interpolate(line.c0, line.c20, (temp/20)), altitude: line.altitude}
	} else if(temp < 40) {
		//Use 20 - 40
		return {rate: interpolate(line.c20, line.c40, ((temp - 20)/20)), altitude: line.altitude}
	} else {
		//Use 40
		return {rate: line.c40, altitude: line.altitude}
	}
}