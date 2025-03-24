import { WB } from './WBError'

//The old rounding code. Kept just in case but should not be used

// 10 = 1 decimal place (.1), 100 = 2 (.01), 0.1 = 10s place, 1 = whole number
// export const RoundingConstant = 100
// /**
//  * @deprecated in favor of up() and down()
//  */
// export function round(input: number, down = false): number {
// 	if (isNaN(input)) throw new WB(101, 'Invalid number sent to rounding function')
// 	if (down) {
// 		return Math.floor(input * RoundingConstant) / RoundingConstant
// 	}
// 	return Math.ceil(input * RoundingConstant) / RoundingConstant
// }
// /**
//  * @deprecated in favor of up() and down()
//  */
// export function roundToPrecision(input: number, RoundingConstant = 100, down = false) {
// 	if (isNaN(input)) throw new WB(102, 'Invalid number sent to rounding function')
// 	if (down) {
// 		return Math.floor(input * RoundingConstant) / RoundingConstant
// 	}
// 	return Math.ceil(input * RoundingConstant) / RoundingConstant
// }

export function up(input: number, precision = 0.01): number {
	// Rather than the rounding constant, this allows the rounding precision to be specified intuitively. This line converts that into the required rounding constant.
	// 1 / .01 => 100, the rounding constant for 2 decimal places.
	const RoundingConstant = 1 / precision
	if (isNaN(input)) throw new WB(9999, 'Invalid number sent to rounding function')
	return Math.ceil(input * RoundingConstant) / RoundingConstant
}

export function down(input: number, precision = 0.01): number {
	// Rather than the rounding constant, this allows the rounding precision to be specified intuitively. This line converts that into the required rounding constant.
	// 1 / .01 => 100, the rounding constant for 2 decimal places.
	const RoundingConstant = 1 / precision
	if (isNaN(input)) throw new WB(9999, 'Invalid number sent to rounding function')
	return Math.floor(input * RoundingConstant) / RoundingConstant
}
