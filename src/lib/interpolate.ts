export function interpolate(num1: number, num2: number, percent: number): number {
	const big = Math.max(num1, num2)
	const small = Math.min(num1, num2)
	return small + (big - small) * percent
}
