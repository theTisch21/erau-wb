// 10 = 1 decimal place, 100 = 2, 0.1 = 10s, 1 = whole number
export const RoundingConstant = 10
export function round(input: number): number {
    return Math.ceil(input * RoundingConstant) / RoundingConstant
}