import { round } from '$lib/round'

export function calculateWindMultiplier(wind: number): number {
	let multi = 1
	if (wind == 0) return multi
	if (wind > 0) {
		while (wind >= 9) {
			wind -= 9
			multi -= 0.1
			if (multi <= 0) throw new WB(9999, 'Headwind too high')
		}
		return round(multi, true)
	} else {
		if (wind > 10) throw new WB(9999, 'Tailwind too high')
		while (wind <= -2) {
			wind += 2
			multi += 0.1
		}
		return round(multi, true)
	}
}
