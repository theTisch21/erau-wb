export type MomentInput = {
    frontSeats: string,
    rearSeats: string,
    frontBag: string,
    rearBag: string,
    fuel: string,
    taxiBurn: string,
    flightBurn: string
}

export type MomentOutput = {
    frontSeats: number,
    rearSeats: number,
    frontBag: number,
    rearBag: number,
    fuel: number,
    taxiBurn: number,
    flightBurn: number
}

export function calcMoment(input: MomentInput): MomentOutput {
    const numberInput = {
        frontSeats: Number(input.frontSeats),
        rearSeats: Number(input.rearSeats),
        frontBag: Number(input.frontBag),
        rearBag: Number(input.rearBag),
        fuel: Number(input.fuel),
        taxiBurn: Number(input.taxiBurn),
        flightBurn: Number(input.flightBurn),
    }
    return {
        frontSeats: numberInput.frontSeats * 37,
        rearSeats: numberInput.rearSeats * 73,
        frontBag: numberInput.frontBag * 95,
        rearBag: numberInput.rearBag * 123,
        fuel: numberInput.fuel * 48,
        taxiBurn: numberInput.taxiBurn * 48,
        flightBurn: numberInput.flightBurn * 48,
    }
}