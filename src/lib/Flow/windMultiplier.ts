import { down } from '$lib/round'
import { WB } from '$lib/WBError'

export function calculateWindMultiplier(wind: number): number {
	let multi = 1
	if (wind == 0) return multi
	if (wind > 0) {
		while (wind >= 9) {
			wind -= 9
			multi -= 0.1
			if (multi <= 0) throw new WB(114, 'Headwind too high')
		}
		return down(multi)
	} else {
		if (wind > 10) throw new WB(115, 'Tailwind too high')
		while (wind <= -2) {
			wind += 2
			multi += 0.1
		}
		return down(multi)
	}
}
