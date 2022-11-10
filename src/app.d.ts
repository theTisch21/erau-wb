// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
	export class LineItem {
		public weight: Writable<number | string>;
		public arm: number;
		public moment: number;
		
		constructor(arm: number) {
			this.arm = arm
			this.moment = 0
			this.weight = writable(0)
			this.weight.subscribe(newWeight => {
				if(typeof newWeight == "string") {
					newWeight = Number(newWeight)
				}
				this.moment = newWeight * this.arm
			})
		}
	}

	export class FuelLineItem {
		public gallons: Writable<number | string>;
		public weight: number;
		public arm: number;
		public moment: number;
		
		constructor(arm: number) {
			this.arm = arm
			this.moment = 0
			this.weight = 0
			this.gallons = writable(0)

			this.gallons.subscribe(gallons => {
				if(typeof gallons == "string") {
					gallons = Number(gallons)
				}
				this.weight = gallons * 6
				this.moment = this.weight * this.arm
			})
		}
	}
	export type OutputLine = {
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
}