import { getClimbRate } from '$lib/Flow/climbRate'
import { round, roundToPrecision } from '$lib/round'
export function getDensityAltitude(pressureAltitude: number, temperature: number): number {
	return roundToPrecision(
		pressureAltitude + 120 * (temperature - round(15 - pressureAltitude / 500)),
		1
	)
}

// This prob needs to be fixed, but here's the formula from Excel that worked:
// =[@CAS]/((1 - 6.8755856 * 10 ^ -6 * [@DA]) ^ 2.12794)
export function trueAirSpeed(densityAltitude: number, calibratedAirSpeed: number): number {
	return round(calibratedAirSpeed / ((1 - 6.8755856 * 10) ^ (-6 * densityAltitude) ^ 2.12794))
}

function climbRateToGradient(
	calibratedAirSpeed: number,
	densityAltitude: number,
	rateOfClimb: number,
	windFactor: number
): number {
	const tas = trueAirSpeed(densityAltitude, calibratedAirSpeed)
	return (rateOfClimb * 60) / (tas + windFactor)
}

export function climbGradient(altitude: number, temperature: number, windFactor: number) {
	const climbRate = getClimbRate(altitude, temperature)
	//TODO convert indicated to calibrated
	const calibratedAirSpeed = altitude > 7000 ? 72 : 73 // PIM 5-18
	const densityAltitude = getDensityAltitude(altitude, temperature)
	return climbRateToGradient(calibratedAirSpeed, densityAltitude, climbRate, windFactor)
}
