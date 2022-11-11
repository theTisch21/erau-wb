import { writable, type Writable } from "svelte/store";

export class LineItem {
    weight: number;
    public arm: number;
    public moment: number;
    callbacks: ((moment: number)=>unknown)[] = []
    
    constructor(arm: number) {
        this.arm = arm
        this.moment = 0
        this.weight = 0
    }

    getWeight(): number {
        return this.weight
    }
    setWeight(newWeight: string | number): void {
        if(typeof newWeight == "string") {
            newWeight = Number(newWeight)
        }
        this.weight = newWeight
        this.moment = newWeight * this.arm
        this.callbacks.forEach(callback => {
            callback(this.moment)
        })
    }

    subscribeToMoment(callback: (moment: number)=>unknown) {
        this.callbacks.push(callback)
    }
}

export class FuelLineItem {
    gallons: number;
    public weight: number;
    public arm: number;
    public moment: number;
    callbacks: ((moment: number)=>unknown)[] = []
    
    constructor(arm: number) {
        this.arm = arm
        this.moment = 0
        this.weight = 0
        this.gallons = 0
    }

    getGallons(): number {
        return this.weight
    }
    setGallons(newGallons: string | number): void {
        if(typeof newGallons == "string") {
            newGallons = Number(newGallons)
        }
        this.gallons = newGallons
        this.weight = this.gallons * 6
        this.moment = this.weight * this.arm
        this.callbacks.forEach(callback => {
            callback(this.moment)
        })
    }

    subscribeToMoment(callback: (moment: number)=>unknown) {
        this.callbacks.push(callback)
    }
}

export type CalculatedLine = {
    weight: number
    arm: number
    moment: number
}
export type LineItems<T> = {
    frontSeats: T,
    rearSeats: T,
    frontBag: T,
    rearBag: T,
    fuel: T,
    taxiBurn: T,
    flightBurn: T
}
export type OutputLineItems<T> = {
    empty: T,
    ramp: T,
    takeoff: T,
    land: T
}