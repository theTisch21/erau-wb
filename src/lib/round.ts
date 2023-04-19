// 10 = 1 decimal place (.1), 100 = 2 (.01), 0.1 = 10s place, 1 = whole number
export const RoundingConstant = 100
export function round(input: number, down = false): number {
	if (down) {
		return Math.floor(input * RoundingConstant) / RoundingConstant
	}
	return Math.ceil(input * RoundingConstant) / RoundingConstant
}

export function roundToPrecision(input: number, RoundingConstant = 100, down = false) {
	if (down) {
		return Math.floor(input * RoundingConstant) / RoundingConstant
	}
	return Math.ceil(input * RoundingConstant) / RoundingConstant
}

export function roundTo2Thousand(input: number, down = false): number {
	input = roundToPrecision(input, 0.001, down) //Round to next thousand

	if ((input / 1000) % 2 != 0) {
		//If thousand is not even
		input += down ? -1000 : 1000
	}
	return input
}
