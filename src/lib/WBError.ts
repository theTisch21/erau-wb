import { Component } from './Flow/flow'

export class WB {
	public code: number
	public wbcode: string
	public message: string
	public formatted: string
	public component: Component
	constructor(code: number, message: string, component?: Component) {
		this.code = code
		this.wbcode = 'WB' + code.toString()
		this.message = message
		this.formatted = this.wbcode + ' ' + this.message
		if (component) this.component = component
		else this.component = Component.StartAndEnd
	}
}
