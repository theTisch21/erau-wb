export type interpolateLine = {
	a1: number
	l1: number
	a2: number
	l2: number
}
//The dual type adds the "b" value, used in double interpolation. It's not necessary for single interpolation, so we only use it when needed.
export type dualInterpolateLine = interpolateLine & { b: number }

export function interpolate(small: number, big: number, percent: number): number {
	return small + (big - small) * percent
}

export function lineInterpolate(input: interpolateLine, targeta: number): number {
	const percent = (targeta - input.a1) / (input.a2 - input.a1)
	return interpolate(input.l1, input.l2, percent)
}

// Double interpolation
//    a1 at a2
// b1 l1    l2
// bt c1 X  c2
// b2 l1    l2
// We interpolate between a first, then b using the 2 computed values (c). This is so that we can interpolate just using the lines, then interpolate between the results
// b is which line (row) you are on, l is the value from that line at the specified a (column) value

export function doubleInterpolate(
	lowerLine: dualInterpolateLine,
	upperLine: dualInterpolateLine,
	targeta: number,
	targetb: number
) {
	const c1 = lineInterpolate(lowerLine, targeta)
	const c2 = lineInterpolate(upperLine, targeta)
	return lineInterpolate({ a1: lowerLine.b, a2: upperLine.b, l1: c1, l2: c2 }, targetb)
}
