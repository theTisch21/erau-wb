// 10 = 1 decimal place, 100 = 2, 0.1 = 10s, 1 = whole number
export const RoundingConstant = 100
export function round(input: number, down=false): number {
    if(down) {
        return Math.floor(input * RoundingConstant) / RoundingConstant
    }
    return Math.ceil(input * RoundingConstant) / RoundingConstant
}