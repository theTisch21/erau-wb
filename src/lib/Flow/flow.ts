import { calcLimits, type LimitResult } from './limitCalc'
import { calculateTable, type TableInput, type TableOutput } from './table'
import { round, roundToPrecision } from '../round'
import { calculatePerformanceData } from './toLandPerformance'
import { getClimbRate } from './climbRate'

export type CompleteFlowInput = {
	table: TableInput
	altimiter: number
	fieldElevation: number
	temperature: number
	headwind: number
	toWeightOverride: number
}

export type CompleteFlowOutput = {
	table: TableOutput
	pressureAltitude: number
	maneuveringSpeed: number
	performance: {
		takeoffRoll: number
		takeoffFifty: number
		climbRate: number
		climbAlt: number
		landRoll: number
		landFifty: number
	}
	validation: LimitResult
}

export function flow(input: CompleteFlowInput): CompleteFlowOutput {
	const calculatedTable = calculateTable(input.table)
	let maneuveringSpeed
	if (!calculatedTable.changeAircraft) {
		maneuveringSpeed = round(Math.sqrt(calculatedTable.landing.weight / 2550) * 105)
	} else {
		maneuveringSpeed = round(Math.sqrt(calculatedTable.changeAircraft.landing.weight / 2550) * 105)
	}
	const pressureAltitude = roundToPrecision(
		(29.92 - Number(input.altimiter)) * 1000 + Number(input.fieldElevation),
		1
	)
	let takeoffWeight: number
	if (!calculatedTable.changeAircraft) {
		takeoffWeight = calculatedTable.takeoff.weight
	} else {
		takeoffWeight = calculatedTable.changeAircraft?.takeoff.weight
	}
	const performanceData = calculatePerformanceData(
		takeoffWeight,
		pressureAltitude,
		input.temperature,
		input.headwind,
		input.toWeightOverride
	)
	const climbData = getClimbRate(pressureAltitude, input.temperature)
	const limitData = calcLimits(calculatedTable)
	return {
		table: calculatedTable,
		pressureAltitude: pressureAltitude,
		maneuveringSpeed: maneuveringSpeed,
		performance: {
			...performanceData,
			climbAlt: climbData.altitude,
			climbRate: climbData.rate
		},
		validation: limitData
	}
}
