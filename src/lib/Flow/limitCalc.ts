import { up, down } from '../round'
import type { TableOutput } from './table'
export type LimitResult = { result: boolean; comment: string; overweightGallons?: number }
export function calcLimits(input: TableOutput): LimitResult {
	const weight = input.takeoff.weight
	const arm = input.takeoff.moment / weight
	//Max takeofframp weight
	if (weight > 2550) {
		const gallonDifference = up((weight - 2550) / 6, 1)
		return {
			result: false,
			comment: `Overweight by ${up(weight - 2550)}lbs or ${gallonDifference} gallons of fuel`,
			overweightGallons: gallonDifference
		}
	}
	//Ramp weight
	const rampWeight = input.ramp.weight
	if (input.ramp.weight > 2558) {
		const gallonDifference = up((rampWeight - 2558) / 6, 1)
		return {
			result: false,
			comment: `Ramp weight exceeded by ${up(
				rampWeight - 2558
			)}lbs or ${gallonDifference} gallons of fuel`,
			overweightGallons: gallonDifference
		}
	}
	//CG Limits
	if (arm > 47.2) return { result: false, comment: 'CG Too far aft' }
	if (arm < 35) return { result: false, comment: 'CG Too far forward' }
	//Baggage compartment limits
	if (input.frontBags.weight > 120) {
		return { result: false, comment: 'Too much weight in forward baggage' }
	}
	if (input.aftBags.weight > 50) {
		return { result: false, comment: 'Too much weight in aft baggage' }
	}
	if (input.frontBags.weight + input.aftBags.weight > 120) {
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
