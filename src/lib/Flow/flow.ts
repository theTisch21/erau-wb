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
	performanceMultiplier: number
	performanceRoundingDown: boolean
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
	downOption: boolean //TODO Un-Jank
	performanceComment: string
}

export function flow(input: CompleteFlowInput): CompleteFlowOutput {
	const calculatedTable = calculateTable(input.table)
	const maneuveringSpeed = round(Math.sqrt(calculatedTable.landing.weight / 2550) * 105)
	const pressureAltitude = roundToPrecision(
		(29.92 - Number(input.altimiter)) * 1000 + Number(input.fieldElevation),
		1
	)
	const performanceData = calculatePerformanceData(
		calculatedTable.takeoff.weight,
		pressureAltitude,
		input.temperature,
		input.performanceRoundingDown,
		input.performanceMultiplier
	)
	const climbData = getClimbRate(pressureAltitude, input.temperature)
	const limitData = calcLimits(calculatedTable)
	return {
		table: calculatedTable,
		pressureAltitude: pressureAltitude,
		maneuveringSpeed: maneuveringSpeed,
		performance: {
			...performanceData.out,
			climbAlt: climbData.altitude,
			climbRate: climbData.rate
		},
		validation: limitData,
		downOption: performanceData.downOption,
		performanceComment: performanceData.notes
	}
}
