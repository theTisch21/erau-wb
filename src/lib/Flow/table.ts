import { WB } from '$lib/WBError'
import { down, up } from '$lib/round'
import { Component } from './flow'

const ARMS = {
	frontSeats: 37,
	rearSeats: 73,
	frontBags: 95,
	aftBags: 123,
	fuel: 48
}

export type DataLine = {
	weight: number
	arm: number
	moment: number
}

export type DataFuelLine = DataLine & { gallons: number }

export type TableInput = {
	aircraft: DataLine
	frontSeats: number
	rearSeats: number
	frontBags: number
	aftBags: number
	fuel: {
		start: number
		taxiBurn: number //Should be negative
		flightBurn: number //Should be negative
	}
	isChangingAircraft?: boolean
	changeInAircraft?: DataLine
}

export type TableOutput = {
	aircraft: DataLine
	frontSeats: DataLine
	rearSeats: DataLine
	frontBags: DataLine
	aftBags: DataLine
	zeroFuel: DataLine
	rampFuel: DataFuelLine
	ramp: DataLine
	taxi: DataFuelLine
	takeoff: DataLine
	flight: DataFuelLine
	landing: DataLine
	changeAircraft?: {
		diff: DataLine
		takeoff: DataLine
		landing: DataLine
	}
}

function arm(weight: number, moment: number): number {
	return up(moment / weight, 0.01)
}

export function calculateTable(input: TableInput): TableOutput {
	const aircraft: DataLine = {
		weight: input.aircraft.weight,
		arm: input.aircraft.arm,
		moment: input.aircraft.moment
	}
	const frontSeats: DataLine = {
		weight: input.frontSeats,
		arm: ARMS.frontSeats,
		moment: up(input.frontSeats * ARMS.frontSeats)
	}
	const rearSeats: DataLine = {
		weight: input.rearSeats,
		arm: ARMS.rearSeats,
		moment: up(input.rearSeats * ARMS.rearSeats)
	}
	const frontBags: DataLine = {
		weight: input.frontBags,
		arm: ARMS.frontBags,
		moment: up(input.frontBags * ARMS.frontBags)
	}
	const aftBags: DataLine = {
		weight: input.aftBags,
		arm: ARMS.aftBags,
		moment: up(input.aftBags * ARMS.aftBags)
	}
	//w, m, and f are temporary variables used to hold weight, moment, and fuel before storing them
	let w
	let m
	let f

	//Front seats
	w = aircraft.weight + frontSeats.weight + rearSeats.weight + frontBags.weight + aftBags.weight
	m = aircraft.moment + frontSeats.moment + rearSeats.moment + frontBags.moment + aftBags.moment
	const zeroFuel: DataLine = {
		weight: w,
		moment: m,
		arm: arm(w, m)
	}

	//Ramp fuel
	if (input.fuel.start > 53)
		throw new WB(
			9999,
			'Fuel entered is more than 53 gallons, which is above max capacity',
			Component.Table
		)
	f = input.fuel.start
	const rampFuel: DataFuelLine = {
		gallons: f,
		weight: up(f * 6),
		arm: ARMS.fuel,
		moment: up(f * 6 * ARMS.fuel)
	}

	//Ramp weight
	w = zeroFuel.weight + rampFuel.weight
	m = zeroFuel.moment + rampFuel.moment
	const ramp: DataLine = {
		weight: w,
		moment: m,
		arm: arm(w, m)
	}

	//Taxi burn
	f = input.fuel.taxiBurn * -1
	const taxi: DataFuelLine = {
		gallons: f,
		weight: down(f * 6),
		arm: ARMS.fuel,
		moment: down(f * 6 * ARMS.fuel)
	}

	//Takeoff
	w = ramp.weight + taxi.weight
	m = ramp.moment + taxi.moment
	const takeoff: DataLine = {
		weight: up(w),
		moment: up(m),
		arm: arm(w, m)
	}

	//Flight burn
	f = input.fuel.flightBurn * -1
	const flight: DataFuelLine = {
		gallons: f,
		weight: up(f * 6),
		arm: ARMS.fuel,
		moment: up(f * 6 * ARMS.fuel)
	}

	//Landing weight
	w = takeoff.weight + flight.weight
	m = takeoff.moment + flight.moment
	const landing: DataLine = {
		weight: up(w),
		moment: up(m),
		arm: arm(w, m)
	}

	//Change in aircraft?
	if (!input.isChangingAircraft || !input.changeInAircraft) {
		//NOT changing
		return {
			aircraft: aircraft,
			frontSeats: frontSeats,
			rearSeats: rearSeats,
			frontBags: frontBags,
			aftBags: aftBags,
			zeroFuel: zeroFuel,
			rampFuel: rampFuel,
			ramp: ramp,
			taxi: taxi,
			takeoff: takeoff,
			flight: flight,
			landing: landing
		}
	} else {
		//Changing
		//Difference between aircraft
		const diff: DataLine = {
			weight: up(input.changeInAircraft.weight - input.aircraft.weight),
			moment: up(input.changeInAircraft.moment - input.aircraft.moment),
			arm: up(input.changeInAircraft.arm - input.aircraft.arm)
		}

		//Difference between takeoff
		w = up(takeoff.weight + diff.weight)
		m = up(takeoff.moment + diff.moment)
		const chgTakeoff: DataLine = {
			weight: w,
			moment: m,
			arm: arm(w, m)
		}

		//Difference between landing
		w = up(landing.weight + diff.weight)
		m = up(landing.moment + diff.moment)
		const chgLanding: DataLine = {
			weight: w,
			moment: m,
			arm: arm(w, m)
		}

		return {
			aircraft: aircraft,
			frontSeats: frontSeats,
			rearSeats: rearSeats,
			frontBags: frontBags,
			aftBags: aftBags,
			zeroFuel: zeroFuel,
			rampFuel: rampFuel,
			ramp: ramp,
			taxi: taxi,
			takeoff: takeoff,
			flight: flight,
			landing: landing,
			changeAircraft: {
				diff: diff,
				takeoff: chgTakeoff,
				landing: chgLanding
			}
		}
	}
}
