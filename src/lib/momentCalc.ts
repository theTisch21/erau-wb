export type LineItems<T> = {
    frontSeats: T,
    rearSeats: T,
    frontBag: T,
    rearBag: T,
    fuel: T,
    taxiBurn: T,
    flightBurn: T
}

export function calcMoment(input: LineItems<number>): LineItems<number> {
    return {
        frontSeats: input.frontSeats * 37,
        rearSeats: input.rearSeats * 73,
        frontBag: input.frontBag * 95,
        rearBag: input.rearBag * 123,
        fuel: input.fuel * 48,
        taxiBurn: input.taxiBurn * 48,
        flightBurn: input.flightBurn * 48,
    }
}