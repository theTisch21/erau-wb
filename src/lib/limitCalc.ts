import type { LineItem, FuelLineItem } from "./classes"
export function calcLimits(weight: number, moment: number, input: {
    frontSeats: LineItem
    rearSeats: LineItem
    frontBag: LineItem
    rearBag: LineItem
    rampFuel: FuelLineItem
    taxiBurn: FuelLineItem
    flightBurn: FuelLineItem
}): {result: boolean, comment: string} {
    const arm = moment/weight
    //Max gross weight
    if(weight > 2550) return {result: false, comment: `Overweight by ${(weight - 2550).toFixed(2)}lbs or ${((weight - 2550)/6).toFixed(2)} gallons of fuel`}
    //CG Limits
    if(arm > 47.2) return {result: false, comment: "CG Too far aft"}
    if(arm < 35) return {result: false, comment: "CG Too far forward"}
    //Baggage compartment limits
    if(input.frontBag.weight > 120) {
        return {result: false, comment: "Too much weight in forward baggage"}
    }
    if(input.rearBag.weight > 50) {
        return {result: false, comment: "Too much weight in aft baggage"}
    }
    if(input.frontBag.weight + input.rearBag.weight > 120) {
        return {result: false, comment: "Too much weight in baggage compartments"}
    }
    //Got this equation from this regression: https://www.desmos.com/calculator/nakx2n6pby
    if(weight <= (100 * arm - 1550)) {
        //Test utility category
        if(arm <= 40.5 && weight <= 2200) {
            return {result: true, comment: "Utility category"}
        } else {
            return {result: true, comment: "Within normal limits"}
        }
    }
    //Because of how the graph is shaped, if it is outside of the range above we know it's going to be too far forward
    return {result: false, comment: "CG Too far forward"}
}