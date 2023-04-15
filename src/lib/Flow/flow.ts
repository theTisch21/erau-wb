import type { LimitResult } from './limitCalc'
import { calculateTable, type TableInput, type TableOutput } from './table'
import { round } from '../round'

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
		takeoff50: number
		climbRate: number
		climbAlt: number
		landingRoll: number
		landing50: number
	}
	validation: LimitResult
}

export function flow(input: CompleteFlowInput) {
	const calculatedTable = calculateTable(input.table)
	const maneuveringSpeed = round(Math.sqrt(calculatedTable.landing.weight / 2550) * 105)
	const pressureAltitude = (
		(29.92 - Number(input.altimiter)) * 1000 +
		Number(input.fieldElevation)
	).toFixed(0)
}
