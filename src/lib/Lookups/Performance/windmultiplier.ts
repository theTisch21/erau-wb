export function calculateWindMultiplier(wind: number): number {
	let multi = 1
	if (wind == 0) return multi
	if (wind > 0) {
		while (wind >= 9) {
			wind -= 9
			multi -= 0.1
		}
	} else {
		while (wind >= 2) {
			wind -= 2
			multi += 0.1
		}
	}
	return multi
}
