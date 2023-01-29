import { json, type RequestHandler } from '@sveltejs/kit'
import { get, writable, type Writable } from 'svelte/store'
import { API_TOKEN } from '$env/static/private'
export type UserAlert = {
	alert: boolean
	alertText: string
}

const alertStore: Writable<UserAlert> = writable({ alert: false, alertText: 'OK' })

export const GET: RequestHandler = () => {
	return json(get(alertStore))
}

export const POST: RequestHandler = async ({ request }) => {
	const token = request.headers.get('Authorization')?.split(' ')[1]
	if (token != API_TOKEN) {
		//TODO DO NOT COMMIT
		return new Response('UNAUTHORIZED', { status: 401 })
	}
	const recievedAlert: UserAlert = await request.json()
	alertStore.set(recievedAlert)
	return new Response('OK', { status: 200 })
}
