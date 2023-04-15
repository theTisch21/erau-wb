import { round } from '$lib/round'

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
}

function arm(weight: number, moment: number): number {
	return round(moment / weight)
}

export function calculateTable(input: TableInput): TableOutput {
	//TODO What
	const aircraft: DataLine = {
		weight: input.aircraft.weight,
		arm: input.aircraft.arm,
		moment: input.aircraft.moment
	}
	const frontSeats: DataLine = {
		weight: input.frontSeats,
		arm: ARMS.frontSeats,
		moment: round(input.frontSeats * ARMS.frontSeats)
	}
	const rearSeats: DataLine = {
		weight: input.rearSeats,
		arm: ARMS.rearSeats,
		moment: round(input.rearSeats * ARMS.rearSeats)
	}
	const frontBags: DataLine = {
		weight: input.frontBags,
		arm: ARMS.frontBags,
		moment: round(input.frontBags * ARMS.frontBags)
	}
	const aftBags: DataLine = {
		weight: input.aftBags,
		arm: ARMS.aftBags,
		moment: round(input.aftBags * ARMS.aftBags)
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
	f = input.fuel.start
	const rampFuel: DataFuelLine = {
		gallons: f,
		weight: f * 6,
		arm: ARMS.fuel,
		moment: round(f * 6 * ARMS.fuel)
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
	f = input.fuel.taxiBurn
	const taxi: DataFuelLine = {
		gallons: f,
		weight: round(f * 6, true),
		arm: ARMS.fuel,
		moment: round(f * 6 * ARMS.fuel, true)
	}

	//Takeoff
	w = ramp.weight + taxi.weight
	m = ramp.moment + taxi.moment
	const takeoff: DataLine = {
		weight: w,
		moment: m,
		arm: arm(w, m)
	}

	//Flight burn
	f = input.fuel.flightBurn
	const flight: DataFuelLine = {
		gallons: f,
		weight: f * 6,
		arm: ARMS.fuel,
		moment: round(f * 6 * ARMS.fuel)
	}

	//Landing weight
	w = takeoff.weight + flight.weight
	m = takeoff.moment + flight.moment
	const landing: DataLine = {
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
		landing: landing
	}
}
