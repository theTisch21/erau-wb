export type TableLine = {
	key: string
	num?: string
	time: string
	status: string
	resource: string
	pic: string
	stu1: string
	stu2: string
	subtype: string
}

export type Table = TableLine[]

const oldTestingTable: Table = [
	{
		key: '26 APR 06:00 DeLaju, Antoine',
		num: '1',
		time: '26 APR 06:00',
		status: 'Scheduled',
		resource: 'R-67 W',
		pic: 'DeLaju, Antoine',
		stu1: 'Enoul, Nicholas',
		stu2: '',
		subtype: 'Flight / Dual'
	},
	{
		key: '26 APR 12:00 Eisell, Zsoee',
		num: '2',
		time: '26 APR 12:00',
		status: 'Scheduled',
		resource: 'C-172S NAV III',
		pic: 'Eisell, Zsoee',
		stu1: 'Kermanian, Jonathan',
		stu2: '',
		subtype: 'Flight / Dual'
	},
	{
		key: '26 APR 16:00 Pak, John H.',
		num: '3',
		time: '26 APR 16:00',
		status: 'Scheduled',
		resource: 'C-172 TAA',
		pic: 'Pak, John H.',
		stu1: 'Tischaefer, Samuel',
		stu2: '',
		subtype: 'Flight / Dual'
	}
]

const aircraftAssigned = [
	{
		key: '26 APR 06:00 DeLaju, Antoine',
		num: '1',
		time: '26 APR 06:00',
		status: 'Scheduled',
		resource: 'R-67 W',
		pic: 'DeLaju, Antoine',
		stu1: 'Enoul, Nicholas',
		stu2: '',
		subtype: 'Flight / Dual'
	},
	{
		key: '26 APR 12:00 Eisell, Zsoee',
		num: '2',
		time: '26 APR 12:00',
		status: 'Scheduled',
		resource: 'R-69',
		pic: 'Eisell, Zsoee',
		stu1: 'Kermanian, Jonathan',
		stu2: '',
		subtype: 'Flight / Dual'
	},
	{
		key: '26 APR 16:00 Pak, John H.',
		num: '3',
		time: '26 APR 16:00',
		status: 'Scheduled',
		resource: 'C-172 TAA',
		pic: 'Pak, John H.',
		stu1: 'Tischaefer, Samuel',
		stu2: '',
		subtype: 'Flight / Dual'
	}
]

const flightGone = [
	{
		key: '26 APR 12:00 Eisell, Zsoee',
		num: '1',
		time: '26 APR 12:00',
		status: 'Scheduled',
		resource: 'C-172S NAV III',
		pic: 'Eisell, Zsoee',
		stu1: 'Kermanian, Jonathan',
		stu2: '',
		subtype: 'Flight / Dual'
	},
	{
		key: '26 APR 16:00 Pak, John H.',
		num: '2',
		time: '26 APR 16:00',
		status: 'Scheduled',
		resource: 'C-172 TAA',
		pic: 'Pak, John H.',
		stu1: 'Tischaefer, Samuel',
		stu2: '',
		subtype: 'Flight / Dual'
	}
]

const reschedule = [
	{
		key: '26 APR 06:00 DeLaju, Antoine',
		num: '1',
		time: '26 APR 06:00',
		status: 'Scheduled',
		resource: 'R-67 W',
		pic: 'DeLaju, Antoine',
		stu1: 'Enoul, Nicholas',
		stu2: '',
		subtype: 'Flight / Dual'
	},
	{
		key: '26 APR 12:00 Eisell, Zsoee',
		num: '2',
		time: '26 APR 12:00',
		status: 'Scheduled',
		resource: 'C-172S NAV III',
		pic: 'Eisell, Zsoee',
		stu1: 'Kermanian, Jonathan',
		stu2: '',
		subtype: 'Flight / Dual'
	},
	{
		key: '26 APR 17:30 Pak, John H.',
		num: '3',
		time: '26 APR 17:30',
		status: 'Scheduled',
		resource: 'C-172 TAA',
		pic: 'Pak, John H.',
		stu1: 'Tischaefer, Samuel',
		stu2: '',
		subtype: 'Flight / Dual'
	}
]

function lookup(table: Table, key: string): TableLine | false {
	//In this case, we reference old state, but this should actually be a redis call
	let o = null
	table.forEach((i) => {
		if (i.key == key) o = i
	})
	if (o == null) return false
	return o
}

const stuNames = ["Tischaefer, Samuel", "Kermanian, Jonathan", "DeLaju, Antoine"]

export function processChangedTable(oldTable: Table, newTable: Table) {
	let old: TableLine | false
	const newItems: TableLine[] = []
	newTable.forEach((item) => {
		old = lookup(oldTable, item.key)
		if (!old) {
			console.log(item.key + ' appeared')
			if(stuNames.includes(item.pic)) {
				console.log(item.pic + " identitifed as PIC")
			}
			if(stuNames.includes(item.stu1)) {
				console.log(item.stu1 + " identitifed as student")
			}
			if (stuNames.includes(item.stu2)) {
				console.log(item.stu2 + " identitifed as student 2")
			}
			newItems.push(item)
		} else {
			//Aircraft
			if (old.resource != item.resource) {
				//TODO validate if resource is aircraft
				console.log(item.key + ' resource ' + item.resource)
			}
		}
	})
	//Compare items
	const diff = oldTable.filter(value => !newTable.map(i => i.key).includes(value.key))
	diff.forEach(item => {
		console.log("Mismatch " + item.key)
		newItems.forEach(newItem => {
			if(newItem.pic == item.pic && newItem.stu1 == item.stu1 && newItem.stu2 == item.stu2) {
				//Reschedule
				console.log("Reschedule " + item.key + " to " + newItem.time)
			}
		})
	})
}

console.log('Assigned')
processChangedTable(oldTestingTable, aircraftAssigned)
console.log('Poof')
processChangedTable(oldTestingTable, flightGone)
console.log('Multi')
processChangedTable(flightGone, aircraftAssigned)
console.log("Reschedule");
processChangedTable(oldTestingTable, reschedule)
