import type { LineItem, FuelLineItem } from './classes'
import { round, roundToPrecision } from './round'
export type LimitResult = { result: boolean; comment: string; overweightGallons?: number }
export function calcLimits(
	weight: number,
	moment: number,
	input: {
		frontSeats: LineItem
		rearSeats: LineItem
		frontBag: LineItem
		rearBag: LineItem
		rampFuel: FuelLineItem
		taxiBurn: FuelLineItem
		flightBurn: FuelLineItem
	}
): LimitResult {
	const arm = moment / weight
	//Max gross weight
	if (weight > 2550) {
		const gallonDifference = roundToPrecision(((weight - 2550) / 6), 1)
		return {
			result: false,
			comment: `Overweight by ${round((weight - 2550))}lbs or ${gallonDifference} gallons of fuel`,
			overweightGallons: gallonDifference
		}
	}
	//CG Limits
	if (arm > 47.2) return { result: false, comment: 'CG Too far aft' }
	if (arm < 35) return { result: false, comment: 'CG Too far forward' }
	//Baggage compartment limits
	if (input.frontBag.weight > 120) {
		return { result: false, comment: 'Too much weight in forward baggage' }
	}
	if (input.rearBag.weight > 50) {
		return { result: false, comment: 'Too much weight in aft baggage' }
	}
	if (input.frontBag.weight + input.rearBag.weight > 120) {
		return { result: false, comment: 'Too much weight in baggage compartments' }
	}
	//Got this equation from this regression: https://www.desmos.com/calculator/nakx2n6pby
	if (weight <= 100 * arm - 1550) {
		//Test utility category
		if (arm <= 40.5 && weight <= 2200) {
			return { result: true, comment: 'Utility category' }
		} else {
			return { result: true, comment: 'Within normal limits' }
		}
	}
	//Because of how the graph is shaped, if it is outside of the range above we know it's going to be too far forward
	return { result: false, comment: 'CG Too far forward' }
}
