import { z } from "zod" 
const n = z.number({required_error: "WBXXXX Rounding function did not get a number", invalid_type_error: "WBXXXX Rounding function recieved invalid number"}).finite({message: "WBXXXX Rounding function recieved infinity"})
// 10 = 1 decimal place (.1), 100 = 2 (.01), 0.1 = 10s place, 1 = whole number
export const RoundingConstant = 100
export function round(input: number, down = false): number {
	if (down) {
		return Math.floor(n.parse(input) * RoundingConstant) / RoundingConstant
	}
	return Math.ceil(n.parse(input) * RoundingConstant) / RoundingConstant
}

export function roundToPrecision(input: number, RoundingConstant = 100, down = false) {
	if (down) {
		return Math.floor(n.parse(input) * RoundingConstant) / RoundingConstant
	}
	return Math.ceil(n.parse(input) * RoundingConstant) / RoundingConstant
}
