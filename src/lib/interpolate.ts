export function interpolate(small: number, big: number, percent: number): number {
	return small + (big - small) * percent
}
