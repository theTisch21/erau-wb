import { Component } from '$lib/Flow/flow'
import { WB } from '$lib/WBError'
import { interpolate } from '$lib/interpolate'
import { round, roundToPrecision } from '$lib/round'

export type tfdOutput = {
	time: number
	fuel: number
	distance: number
	startLine: tfdSrcLine
	modifiedStartLine: tfdLine
	endLine: tfdSrcLine
	modifiedEndLine: tfdLine
}

export type tfdLine = {
	altitude: number
	time: number
	fuel: number
	distance: number
}

export type tfdSrcLine = tfdLine & {
	stdTemp: number
}

const tfdList: tfdSrcLine[] = [
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

function getSourceTfdLine(altitude: number): tfdSrcLine {
	let out = null
	if (altitude > 12000)
		throw new WB(888, 'Altitude greater than 12,000ft. No data available.', Component.TFDSAD)
	tfdList.forEach((item) => {
		if (item.altitude == altitude) {
			out = item
		}
	})
	if (out == null) {
		return getSourceTfdLine(altitude + 1000) //Go to next thousand
	}
	return out
}

function getAltitudeTfdLine(altitude: number): tfdSrcLine {
	if (Number.isNaN(altitude)) throw new WB(888, 'Altitude not a number', Component.TFDSAD)
	if (altitude > 12000)
		throw new WB(888, 'Altitude above 12,000ft. No data available.', Component.TFDSAD)
	if (altitude < 0) throw new WB(888, 'Altitude less than 0. No data available.', Component.TFDSAD)
	const upperAlt = roundToPrecision(altitude, 0.001, false) //Round to next thousand up
	const lowerAlt = roundToPrecision(altitude, 0.001, true) //Round to next thousand down

	if (upperAlt == lowerAlt) return getSourceTfdLine(upperAlt) //No interpolation needed

	const upperLine = getSourceTfdLine(upperAlt)
	const lowerLine = getSourceTfdLine(lowerAlt)

	const percent = (altitude - lowerAlt) / (upperAlt - lowerAlt)
	return {
		altitude: round(interpolate(lowerLine.altitude, upperLine.altitude, percent)),
		time: round(interpolate(lowerLine.time, upperLine.time, percent)),
		fuel: round(interpolate(lowerLine.fuel, upperLine.fuel, percent)),
		distance: round(interpolate(lowerLine.distance, upperLine.distance, percent)),
		stdTemp: round(interpolate(lowerLine.stdTemp, upperLine.stdTemp, percent))
	}
}

function modifyTfdLineForTemp(line: tfdSrcLine, temp: number): tfdLine {
	const multi = calculateMultiplier(temp - line.stdTemp)
	return {
		altitude: line.altitude,
		time: round(line.time * multi),
		fuel: round(line.fuel * multi),
		distance: round(line.distance * multi)
	}
}

function calculateMultiplier(tempDiff: number): number {
	if (tempDiff < 0) return 1
	if (tempDiff > 100) throw new WB(888, 'Temperatures invalid')
	return round(tempDiff / 100) + 1
}

export function calculateTFD(
	startAlt: number,
	startTemp: number,
	endAlt: number,
	endTemp: number
): tfdOutput {
	//Interpolate for altitudes
	const startLine1 = getAltitudeTfdLine(startAlt)
	const endLine1 = getAltitudeTfdLine(endAlt)
	//Correct for temperature
	const startLine2 = modifyTfdLineForTemp(startLine1, startTemp)
	const endLine2 = modifyTfdLineForTemp(endLine1, endTemp)
	//Find the difference
	const resultTime = roundToPrecision(endLine2.time - startLine2.time, 10)
	const resultFuel = roundToPrecision(endLine2.fuel - startLine2.fuel, 10) //1.4 for taxi is not added here, it's on the frontend
	const resultDistance = roundToPrecision(endLine2.distance - startLine2.distance, 10)

	return {
		time: resultTime,
		fuel: resultFuel,
		distance: resultDistance,
		startLine: startLine1,
		endLine: endLine1,
		modifiedStartLine: startLine2,
		modifiedEndLine: endLine2
	}
}
