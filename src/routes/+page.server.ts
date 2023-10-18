import { decodeMetar } from '$lib/Calculators/metar'
import type { PageServerLoad } from './$types'
import type { UserAlert } from './api/alert/+server'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }): Promise<{ metar: string; alert: UserAlert }> {
	//Acquire metar from AWC
	const result = await fetch('https://aviationweather.gov/api/data/metar?ids=KPRC')
	const metar: string = await result.text()

	//Alert status
	const alertReq = await fetch('/api/alert')
	const alert: UserAlert = await alertReq.json()

	//Return data
	return {
		metar: metar,
		alert: alert
	}
}
