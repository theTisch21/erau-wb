import { interpolate } from '$lib/interpolate'
import { roundToPrecision, round } from '$lib/round'
import { calculateWindMultiplier } from './windMultiplier'

export type AltitudeLine = {
	altitude: number
	c0: number
	c10: number
	c20: number
	c30: number
	c40: number
}

const landingGroundRoll: AltitudeLine[] = [
	{ altitude: 0, c0: 545, c10: 565, c20: 585, c30: 605, c40: 625 },
	{ altitude: 1000, c0: 565, c10: 585, c20: 605, c30: 625, c40: 650 },
	{ altitude: 2000, c0: 585, c10: 610, c20: 630, c30: 650, c40: 670 },
	{ altitude: 3000, c0: 610, c10: 630, c20: 655, c30: 675, c40: 695 },
	{ altitude: 4000, c0: 630, c10: 655, c20: 675, c30: 700, c40: 725 },
	{ altitude: 5000, c0: 655, c10: 680, c20: 705, c30: 725, c40: 750 },
	{ altitude: 6000, c0: 680, c10: 705, c20: 730, c30: 755, c40: 780 },
	{ altitude: 7000, c0: 705, c10: 730, c20: 760, c30: 785, c40: 810 },
	{ altitude: 8000, c0: 735, c10: 760, c20: 790, c30: 815, c40: 840 }
]
const landingFiftyFeet: AltitudeLine[] = [
	{ altitude: 0, c0: 1290, c10: 1320, c20: 1350, c30: 1380, c40: 1415 },
	{ altitude: 1000, c0: 1320, c10: 1350, c20: 1385, c30: 1420, c40: 1450 },
	{ altitude: 2000, c0: 1355, c10: 1385, c20: 1420, c30: 1455, c40: 1490 },
	{ altitude: 3000, c0: 1385, c10: 1425, c20: 1460, c30: 1495, c40: 1530 },
	{ altitude: 4000, c0: 1425, c10: 1460, c20: 1495, c30: 1535, c40: 1570 },
	{ altitude: 5000, c0: 1460, c10: 1500, c20: 1535, c30: 1575, c40: 1615 },
	{ altitude: 6000, c0: 1500, c10: 1540, c20: 1580, c30: 1620, c40: 1660 },
	{ altitude: 7000, c0: 1545, c10: 1585, c20: 1625, c30: 1665, c40: 1705 },
	{ altitude: 8000, c0: 1585, c10: 1630, c20: 1670, c30: 1715, c40: 1755 }
]

const takeoff2200ground: AltitudeLine[] = [
	{ altitude: 0, c0: 610, c10: 655, c20: 705, c30: 760, c40: 815 },
	{ altitude: 1000, c0: 665, c10: 720, c20: 770, c30: 830, c40: 890 },
	{ altitude: 2000, c0: 725, c10: 785, c20: 845, c30: 905, c40: 975 },
	{ altitude: 3000, c0: 795, c10: 860, c20: 925, c30: 995, c40: 1065 },
	{
		altitude: 4000,
		c0: 870,
		c10: 940,
		c20: 1010,
		c30: 1090,
		c40: 1165
	},
	{
		altitude: 5000,
		c0: 955,
		c10: 1030,
		c20: 1110,
		c30: 1195,
		c40: 1275
	},
	{
		altitude: 6000,
		c0: 1050,
		c10: 1130,
		c20: 1220,
		c30: 1310,
		c40: 1400
	},
	{
		altitude: 7000,
		c0: 1150,
		c10: 1245,
		c20: 1340,
		c30: 1435,
		c40: 1540
	},
	{
		altitude: 8000,
		c0: 1270,
		c10: 1370,
		c20: 1475,
		c30: 1580,
		c40: 1695
	}
]
const takeoff2200fifty: AltitudeLine[] = [
	{ altitude: 0, c0: 1055, c10: 1130, c20: 1205, c30: 1290, c40: 1380 },
	{
		altitude: 1000,
		c0: 1145,
		c10: 1230,
		c20: 1315,
		c30: 1410,
		c40: 1505
	},
	{
		altitude: 2000,
		c0: 1250,
		c10: 1340,
		c20: 1435,
		c30: 1540,
		c40: 1650
	},
	{
		altitude: 3000,
		c0: 1365,
		c10: 1465,
		c20: 1570,
		c30: 1685,
		c40: 1805
	},
	{
		altitude: 4000,
		c0: 1490,
		c10: 1605,
		c20: 1725,
		c30: 1855,
		c40: 1975
	},
	{
		altitude: 5000,
		c0: 1635,
		c10: 1765,
		c20: 1900,
		c30: 2035,
		c40: 2175
	},
	{
		altitude: 6000,
		c0: 1800,
		c10: 1940,
		c20: 2090,
		c30: 2240,
		c40: 2395
	},
	{
		altitude: 7000,
		c0: 1985,
		c10: 2145,
		c20: 2305,
		c30: 2475,
		c40: 2650
	},
	{
		altitude: 8000,
		c0: 2195,
		c10: 2375,
		c20: 2555,
		c30: 2745,
		c40: 2950
	}
]

const takeoff2400ground: AltitudeLine[] = [
	{ altitude: 0, c0: 745, c10: 800, c20: 860, c30: 925, c40: 995 },
	{ altitude: 1000, c0: 810, c10: 875, c20: 940, c30: 1010, c40: 1085 },
	{
		altitude: 2000,
		c0: 885,
		c10: 955,
		c20: 1030,
		c30: 1110,
		c40: 1190
	},
	{
		altitude: 3000,
		c0: 970,
		c10: 1050,
		c20: 1130,
		c30: 1215,
		c40: 1305
	},
	{
		altitude: 4000,
		c0: 1065,
		c10: 1150,
		c20: 1240,
		c30: 1335,
		c40: 1430
	},
	{
		altitude: 5000,
		c0: 1170,
		c10: 1265,
		c20: 1360,
		c30: 1465,
		c40: 1570
	},
	{
		altitude: 6000,
		c0: 1285,
		c10: 1390,
		c20: 1500,
		c30: 1610,
		c40: 1725
	},
	{
		altitude: 7000,
		c0: 1415,
		c10: 1530,
		c20: 1650,
		c30: 1770,
		c40: 1900
	},
	{
		altitude: 8000,
		c0: 1560,
		c10: 1690,
		c20: 1815,
		c30: 1950,
		c40: 2095
	}
]
const takeoff2400fifty: AltitudeLine[] = [
	{ altitude: 0, c0: 1275, c10: 1370, c20: 1470, c30: 1570, c40: 1685 },
	{
		altitude: 1000,
		c0: 1390,
		c10: 1495,
		c20: 1605,
		c30: 1720,
		c40: 1845
	},
	{
		altitude: 2000,
		c0: 1520,
		c10: 1635,
		c20: 1760,
		c30: 1890,
		c40: 2030
	},
	{
		altitude: 3000,
		c0: 1665,
		c10: 1795,
		c20: 1930,
		c30: 2080,
		c40: 2230
	},
	{
		altitude: 4000,
		c0: 1830,
		c10: 1975,
		c20: 2130,
		c30: 2295,
		c40: 2455
	},
	{
		altitude: 5000,
		c0: 2015,
		c10: 2180,
		c20: 2355,
		c30: 2530,
		c40: 2715
	},
	{
		altitude: 6000,
		c0: 2230,
		c10: 2410,
		c20: 2610,
		c30: 2805,
		c40: 3015
	},
	{
		altitude: 7000,
		c0: 2470,
		c10: 2685,
		c20: 2900,
		c30: 3125,
		c40: 3370
	},
	{
		altitude: 8000,
		c0: 2755,
		c10: 3000,
		c20: 3240,
		c30: 3500,
		c40: 3790
	}
]

const takeoff2550ground: AltitudeLine[] = [
	{ altitude: 0, c0: 860, c10: 925, c20: 995, c30: 1070, c40: 1150 },
	{
		altitude: 1000,
		c0: 940,
		c10: 1010,
		c20: 1090,
		c30: 1170,
		c40: 1260
	},
	{
		altitude: 2000,
		c0: 1025,
		c10: 1110,
		c20: 1195,
		c30: 1285,
		c40: 1380
	},
	{
		altitude: 3000,
		c0: 1125,
		c10: 1215,
		c20: 1310,
		c30: 1410,
		c40: 1515
	},
	{
		altitude: 4000,
		c0: 1235,
		c10: 1335,
		c20: 1440,
		c30: 1550,
		c40: 1660
	},
	{
		altitude: 5000,
		c0: 1355,
		c10: 1465,
		c20: 1585,
		c30: 1705,
		c40: 1825
	},
	{
		altitude: 6000,
		c0: 1495,
		c10: 1615,
		c20: 1745,
		c30: 1875,
		c40: 2010
	},
	{
		altitude: 7000,
		c0: 1645,
		c10: 1785,
		c20: 1920,
		c30: 2065,
		c40: 2215
	},
	{
		altitude: 8000,
		c0: 1820,
		c10: 1970,
		c20: 2120,
		c30: 2280,
		c40: 2450
	}
]
const takeoff2550fifty: AltitudeLine[] = [
	{ altitude: 0, c0: 1465, c10: 1575, c20: 1690, c30: 1810, c40: 1945 },
	{
		altitude: 1000,
		c0: 1600,
		c10: 1720,
		c20: 1850,
		c30: 1990,
		c40: 2135
	},
	{
		altitude: 2000,
		c0: 1755,
		c10: 1890,
		c20: 2035,
		c30: 2190,
		c40: 2355
	},
	{
		altitude: 3000,
		c0: 1925,
		c10: 2080,
		c20: 2240,
		c30: 2420,
		c40: 2605
	},
	{
		altitude: 4000,
		c0: 2120,
		c10: 2295,
		c20: 2480,
		c30: 2685,
		c40: 2880
	},
	{
		altitude: 5000,
		c0: 2345,
		c10: 2545,
		c20: 2755,
		c30: 2975,
		c40: 3205
	},
	{
		altitude: 6000,
		c0: 2605,
		c10: 2830,
		c20: 3075,
		c30: 3320,
		c40: 3585
	},
	{
		altitude: 7000,
		c0: 2910,
		c10: 3170,
		c20: 3440,
		c30: 3730,
		c40: 4045
	},
	{
		altitude: 8000,
		c0: 3265,
		c10: 3575,
		c20: 3880,
		c30: 4225,
		c40: 4615
	}
]

function findNumberFromTable(table: AltitudeLine[], altitude: number, temp: number): number {
	let result = 0
	//Get line
	let line: AltitudeLine = { altitude: -1, c0: -1, c10: -1, c20: -1, c30: -1, c40: -1 }
	altitude = roundToPrecision(altitude, 0.001)

	if(altitude > 12000) throw new Error("WBXXXX Pressure Altitude greater than 12,000ft")

		if(altitude < 0) throw new Error("WBXXXX Pressure altitude less than 0")

			if((altitude / 1000) % 2 != 0) {

				result = findNumberFromTable(table, altitude + 1000, temp)

			}


	table.forEach((newLine) => {
		if (newLine.altitude == altitude) line = newLine
	})
	if (line.altitude == -1) {
		throw new Error("WBXXXX Altitude not in table")
	}
	//Interpolate for temperature
	if (temp > 40) {
		result = findNumberFromTable(table, altitude, 40)
		throw new Error("WBXXXX Temperature too hot, over 40˚C")
	} else if (temp >= 30) {
		//Using the 30-40 block
		result = interpolate(line.c30, line.c40, (temp - 30) / 10)
	} else if (temp >= 20) {
		//Using the 20-30 block
		result = interpolate(line.c20, line.c30, (temp - 20) / 10)
	} else if (temp >= 10) {
		//Using the 10-20 block
		result = interpolate(line.c10, line.c20, (temp - 10) / 10)
	} else if (temp > 0) {
		//Using the 0-10 block
		result = interpolate(line.c0, line.c10, temp / 10)
	} else {
		//Using the 0 line
		result = line.c0
	}
	return round(result)
}

export type PerformanceOutput = {
	takeoffRoll: number
	takeoffFifty: number
	landRoll: number
	landFifty: number
}

export function calculatePerformanceData(
	TOWeight: number,
	altitude: number,
	temp: number,
	winds: number,
	toWeightOverride = 0
): PerformanceOutput {
	const multiplier = calculateWindMultiplier(winds)
	const out: PerformanceOutput = { takeoffRoll: 0, takeoffFifty: 0, landRoll: 0, landFifty: 0 }
	out.landRoll = round(findNumberFromTable(landingGroundRoll, altitude, temp) * multiplier)
	out.landFifty = round(findNumberFromTable(landingFiftyFeet, altitude, temp) * multiplier)
	//If the user has requested to override takeoff weight
	if (toWeightOverride != 0) {
		TOWeight = toWeightOverride
	}
	if(TOWeight > 2550) throw new Error("WBXXXX Takeoff weight greater than 2550lbs")
	if (TOWeight > 2400) {
		//Use 2550 tables
		out.takeoffRoll = round(findNumberFromTable(takeoff2550ground, altitude, temp) * multiplier)
		out.takeoffFifty = round(findNumberFromTable(takeoff2550fifty, altitude, temp) * multiplier)
	} else if (TOWeight > 2200) {
		//Use 2400 tables
		out.takeoffRoll = round(findNumberFromTable(takeoff2400ground, altitude, temp) * multiplier)
		out.takeoffFifty = round(findNumberFromTable(takeoff2400fifty, altitude, temp) * multiplier)
	} else {
		//Use 2200 tables
		out.takeoffRoll = round(findNumberFromTable(takeoff2200ground, altitude, temp) * multiplier)
		out.takeoffFifty = round(findNumberFromTable(takeoff2200fifty, altitude, temp) * multiplier)
	}

	return out
}
