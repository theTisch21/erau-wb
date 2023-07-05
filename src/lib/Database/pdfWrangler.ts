import type { Collection } from 'mongodb'
import { getDb } from './db'

export type pdfLocation = {
	quickAccess?: string
	permanentId: number
	fileName: string
}

//Items:
const nounList = ['cessna', 'bonanza', 'diamond', 'twinstar', 'cutter', 'iPad', 'calculator']
//Items:
const adjList = ['fast', 'slow', 'boring', 'cool', 'amazing', 'spicy']
//Total combos:

const db = getDb()
const reportColl: Collection<pdfLocation> = db.collection('quickAccess')

export function retrieveQuickAccess(qa: string) {
	reportColl.findOne({ quickAccess: qa })
}

export function retrievePermanent(id: number) {
	reportColl.findOne({ permanentId: id })
}

export function deleteQuickAccesses() {
	//Caution! This WILL delete all the quick access keys, only run at 2am!
	reportColl.updateMany({}, { $unset: { quickAccess: '' } })
}

export async function generateQuickAccess(): Promise<string> {
	let done = false
	let newQuickAccess: string
	do {
		const noun = nounList[Math.floor(Math.random() * nounList.length)]
		const adj = adjList[Math.floor(Math.random() * adjList.length)]
		newQuickAccess = `${adj}.${noun}`
		const existing = await reportColl.countDocuments({ quickAccess: newQuickAccess })
		if (existing == 0) done = true
	} while (!done)
	return newQuickAccess
}

export async function generateReportRecord(filePath: string) {
	const qa = generateQuickAccess()
	const largestIdRecord = reportColl.find({}).sort({ id: -1 }).next() //TODO this could lead to a race condition. Singular atomic index?
}
