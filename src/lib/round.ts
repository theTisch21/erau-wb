import { WB } from './WBError'

// 10 = 1 decimal place (.1), 100 = 2 (.01), 0.1 = 10s place, 1 = whole number
export const RoundingConstant = 100
export function round(input: number, down = false): number {
	if (isNaN(input)) throw new WB(101, 'Invalid number sent to rounding function')
	if (down) {
		return Math.floor(input * RoundingConstant) / RoundingConstant
	}
	return Math.ceil(input * RoundingConstant) / RoundingConstant
}

export function roundToPrecision(input: number, RoundingConstant = 100, down = false) {
	if (isNaN(input)) throw new WB(102, 'Invalid number sent to rounding function')
	if (down) {
		return Math.floor(input * RoundingConstant) / RoundingConstant
	}
	return Math.ceil(input * RoundingConstant) / RoundingConstant
}
