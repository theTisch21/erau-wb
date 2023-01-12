import { decodeMetar } from '$lib/Calculators/metar'
import type { PageServerLoad } from './$types'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }: any) {
	//Acquire metar from AWC
	const result = await fetch(
		'https://aviationweather.gov/metar/data?ids=kprc&format=raw&date=&hours=0'
	)
	const text: string = await result.text()

	//Parse data
	const regex = /<code>(.*)<\/code>/
	const regexResult = text.match(regex)
	if (regexResult == null) {
		return {
			metar: 'Unable to load metar!'
		}
	}
	const metar = regexResult[1]
	//For testing, lets me see output in VSCode's console
	decodeMetar(metar)

	//Return data
	return {
		metar: metar
	}
}
