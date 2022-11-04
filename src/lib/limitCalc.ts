export function calcLimits(weight: number, moment: number): {result: boolean, comment: string} {
    //Max gross weight
    if(weight > 2550) return {result: false, comment: "Overweight"}
    //CG Limits
    if(moment > 47.2) return {result: false, comment: "CG Too far aft"}
    if(moment < 35) return {result: false, comment: "CG Too far forward"}
    //Got this equation from this regression: https://www.desmos.com/calculator/nakx2n6pby
    if(weight <= (100 * moment - 1550)) {
        //Test utility category
        if(moment <= 40.5 && weight <= 2200) {
            return {result: true, comment: "Utility category"}
        } else {
            return {result: true, comment: "Normal category"}
        }
    }
    //Because of how the graph is shaped, if it is outside of the range above we know it's going to be too far forward
    return {result: false, comment: "CG Too far forward"}
}