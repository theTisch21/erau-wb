import { calcLimits, type LimitResult } from './limitCalc'
import { calculateTable, type TableInput, type TableOutput } from './table'
import { down, up } from '../round'
import { calculatePerformanceData } from './toLandPerformance'
import { getClimbRate } from './climbRate'
import { WB } from '$lib/WBError'

export enum Component {
	StartAndEnd,
	Table,
	PressureAltitude,
	PerfTemp,
	Wind,
	PerfResult
}

export type CompleteFlowInput = {
	table: TableInput
	altimiter: number
	fieldElevation: number
	temperature: number
	headwind: number
	toWeightOverride: number
	climbAlt: number
}

export type CompleteFlowOutput = {
	table: TableOutput
	pressureAltitude: number
	maneuveringSpeed: number
	performance: {
		takeoffRoll: number
		takeoffFifty: number
		climbRate: number
		landRoll: number
		landFifty: number
	}
	validation: LimitResult
}

export function flow(input: CompleteFlowInput): CompleteFlowOutput {
	const calculatedTable = calculateTable(input.table)
	let maneuveringSpeed
	// If changing aircraft, use new lnd weight
	if (!calculatedTable.changeAircraft) {
		maneuveringSpeed = down(Math.sqrt(calculatedTable.landing.weight / 2550) * 105, 1)
	} else {
		maneuveringSpeed = down(
			Math.sqrt(calculatedTable.changeAircraft.landing.weight / 2550) * 105,
			1
		)
	}
	if (input.altimiter > 35 || input.altimiter < 25) {
		throw new WB(107, 'Invalid altimiter setting detected', Component.PressureAltitude)
	}
	const pressureAltitude = up(
		(29.92 - Number(input.altimiter)) * 1000 + Number(input.fieldElevation),
		1
	)
	if (pressureAltitude > 12000)
		throw new WB(
			9999,
			'Pressure altitude greater than 12,000ft, performance data unavailable',
			Component.PressureAltitude
		)
	let takeoffWeight: number
	if (!calculatedTable.changeAircraft) {
		takeoffWeight = calculatedTable.takeoff.weight
	} else {
		takeoffWeight = calculatedTable.changeAircraft.takeoff.weight
	}
	if (takeoffWeight < 0)
		throw new WB(
			9999,
			'Takeoff weight less than 0lbs, data likely invalid. Cannot continue.',
			Component.Table
		)
	if (takeoffWeight > 10000)
		throw new WB(
			9999,
			'Takeoff weight greater than 10,000lbs, data likely invalid. Cannot continue.',
			Component.Table
		)
	const performanceData = calculatePerformanceData(
		takeoffWeight,
		pressureAltitude,
		input.temperature,
		input.headwind,
		input.toWeightOverride
	)
	const climbData = getClimbRate(input.climbAlt, input.temperature)
	const limitData = calcLimits(calculatedTable)
	return {
		table: calculatedTable,
		pressureAltitude: pressureAltitude,
		maneuveringSpeed: maneuveringSpeed,
		performance: {
			...performanceData,
			climbRate: climbData
		},
		validation: limitData
	}
}
