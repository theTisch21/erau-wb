import { interpolate } from "$lib/interpolate"
import { roundTo2Thousand } from "$lib/round"
import { roundToPrecision } from "\/round"

export type tfdOutput = {
    time: number,
    fuel: number,
    distance: number,
}

type tfdLine = {
    altitude: number,
    stdTemp: number,
    time: number,
    fuel: number,
    distance: number,
}

const tfdList: tfdLine[] = []

function getTfdLine(altitude: number): tfdLine {
	let out = null
	if(altitude > 12000) return getTfdLine(12000)
	tfdList.forEach(item => {
		if(item.altitude == altitude) {
			out = item
		}
	})
	if (out == null) {
		return getTfdLine(altitude + 2000) //Go to next thousand
	}
	return out
}

function getInterpolatedTfdLine(altitude: number): tfdOutput {
	if (altitude > 12000) {
		throw new Error("Altitude above service ceiling. Are you sure whatever you're doing is worth it?")
	}
	const upperAlt = roundTo2Thousand(altitude, false) //Round to next 2thousand up
	const lowerAlt = roundTo2Thousand(altitude, true) //Round to next 2thousand down

	const upperLine = getTfdLine(upperAlt)
	const lowerLine = getTfdLine(lowerAlt)

	const percent = (upperAlt - lowerAlt) / (altitude - lowerAlt) 

	return {
		time: interpolate(lowerLine.time, upperLine.time, percent),
		fuel: interpolate(lowerLine.fuel, upperLine.fuel, percent),
		distance: interpolate(lowerLine.distance, upperLine.distance, percent),
	}
}

function calculateTFD(startAlt: number, startTemp: number, endAlt: number, endTemp: number): tfdOuptut {
	
}