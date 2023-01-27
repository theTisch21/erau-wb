import { error, json, type RequestHandler } from '@sveltejs/kit';
import { get, writable, type Writable } from 'svelte/store';
export type UserAlert = {
  alert: boolean,
  alertText: string
}

const alertStore: Writable<UserAlert> = writable({alert: false, alertText: "OK"})

export const GET: RequestHandler = () => {
  return json(get(alertStore))
}

export const POST: RequestHandler = async ({request}) => {
  const recievedAlert: UserAlert = await request.json()
  alertStore.set(recievedAlert)
  return new Response("OK", {status: 200})
}