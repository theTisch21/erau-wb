export type DecodedMetar = {
    wind: {
        speed: number,
        isGusting: boolean,
        gust?: number
    },
    altimiter: number,
    visibility: number,
    temp: number
}

export const regexTable = {
    wind:  / ((\d\d\d)?(?:VRB)?(\d\d)(G\d\d)?)KT/,
    altimiter: /A(\d\d\d\d)/,
    visibility: / (\d?\D?\d)SM/,
    temp: / (M?\d\d)\/(M?\d\d) /
}

export function decodeMetar(metar: string): DecodedMetar {
    const output: DecodedMetar = {
        wind: {
            speed: 0,
            isGusting: false
        },
        altimiter: 0,
        visibility: 0,
        temp: 0
    }

    //Wind
    const windResult = metar.match(regexTable.wind)
    if(windResult == null) {
        throw new Error("Invalid wind data")
    }
    console.log(windResult)
    output.wind.speed = Number(windResult[2])
    output.wind.isGusting = windResult[0].includes("G")
    if(output.wind.isGusting) output.wind.gust = Number(windResult[4].charAt(1) + windResult[4].charAt(2)) //I don't feel like writing more complicated parse code, so here we are
    console.log(output.wind)

    //Visibility
    console.log(Number("3/4")) //TODO 4/3 programs have trouble with fractions

    //Altimiter
    const altResult = metar.match(regexTable.altimiter)
    if(altResult == null) {
        throw new Error("Invalid altimiter data")
    }
    //We need to add a decimal point in the middle, do that here
    const decimalAlt = `${altResult[1].charAt(0)}${altResult[1].charAt(1)}.${altResult[1].charAt(2)}${altResult[1].charAt(3)}`
    //Ready for parsing
    output.altimiter = Number(decimalAlt)

    //Temperature
    //TODO M?!? Who thought M was a good idea?

    console.log(output)
    return output
}