import { decodeMetar } from '$lib/Calculators/metar'
import type { PageServerLoad } from './$types'
import type { UserAlert } from './api/alert/+server'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }: any): Promise<{ metar: string; alert: UserAlert }> {
	//Acquire metar from AWC
	const result = await fetch(
		'https://aviationweather.gov/metar/data?ids=kprc&format=raw&date=&hours=0'
	)
	const text: string = await result.text()

	//Parse data
	const regex = /<code>(.*)<\/code>/
	const regexResult = text.match(regex)
	let metar
	if (regexResult == null) {
		metar = 'Unable to load metar!'
	} else {
		metar = regexResult[1]
	}

	//Alert status
	const alertReq = await fetch('/api/alert')
	const alert: UserAlert = alertReq.json()

	//Return data
	return {
		metar: metar,
		alert: alert
	}
}
