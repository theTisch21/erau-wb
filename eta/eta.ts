import { By, Builder } from 'selenium-webdriver'
import { ServiceBuilder } from 'selenium-webdriver/firefox.js'
const builder = new ServiceBuilder(
	'C:\\Users\\samti\\.cache\\selenium\\geckodriver\\win64\\0.33.0\\geckodriver.exe'
)
const driver = await new Builder().forBrowser('firefox').setFirefoxService(builder).build()
driver.manage().setTimeouts({ implicit: 2000 })
await driver.get(
	'https://eta.erau.edu/tseta/servlet/content?module=home&fromHomepg=true&page=home_ops_gen&view=general'
)
console.log(await driver.getTitle())
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line

//Login

await driver.sleep(1000)
const username = await driver.findElement(By.id('uname'))
const password = await driver.findElement(By.id('password'))

await driver
	.actions()
	.click(username)
	.sendKeys('tischaes')
	.pause(100)
	.click(password)
	.pause(100)
	.click(password)
	.pause(100)
	.sendKeys(string)
	.pause(100)
	.click(driver.findElement(By.id('butlogin')))
	.perform()
console.log('Login complete')
await driver.sleep(2000)
console.log('Sleep complete')
//Set to only grab flights
try {
	await (await driver.findElement(By.id('act_type')))
		.findElement(By.xpath('option[.="' + 'Flight' + '"]'))
		.click()
} catch (e) {
	await driver
		.actions()
		.click(username)
		.sendKeys('tischaes')
		.pause(100)
		.click(password)
		.pause(100)
		.click(password)
		.pause(100)
		.sendKeys(string)
		.pause(100)
		.click(driver.findElement(By.id('butlogin')))
		.perform()
	await (await driver.findElement(By.id('act_type')))
		.findElement(By.xpath('option[.="' + 'Flight' + '"]'))
		.click()
}

const tomorrow = true
//Go to tomorrow (test)
if (tomorrow)
	await driver
		.actions()
		.click(driver.findElement(By.id('opsbtnext')))
		.perform()
else
	await driver
		.actions()
		.click(
			driver.findElement(By.css('input.btn.ui-button.ui-widget.ui-state-default.ui-corner-all'))
		)
		.perform()

//Build table
const table = []
let hasSeenNum1 = false
let done = false
while (!done) {
	await driver.sleep(1000)
	for (let i = 1; i <= 50; i++) {
		try {
			const num = await driver.findElement(By.xpath(`//*[@id='row${i}']/td[${1}]`)).getText()
			if (num == '1') {
				if (hasSeenNum1) {
					done = true
					break
				} else {
					hasSeenNum1 = true
				}
			}
			const time = await driver.findElement(By.xpath(`//*[@id='row${i}']/td[${2}]`)).getText()
			const pic = await driver.findElement(By.xpath(`//*[@id='row${i}']/td[${5}]`)).getText()
			table.push({
				key: time + ' ' + pic,
				num: num,
				time: time,
				status: await driver.findElement(By.xpath(`//*[@id='row${i}']/td[${3}]`)).getText(),
				resource: await driver.findElement(By.xpath(`//*[@id='row${i}']/td[${4}]`)).getText(),
				pic: pic,
				stu1: await driver.findElement(By.xpath(`//*[@id='row${i}']/td[${6}]`)).getText(),
				stu2: await driver.findElement(By.xpath(`//*[@id='row${i}']/td[${7}]`)).getText(),
				subtype: await driver.findElement(By.xpath(`//*[@id='row${i}']/td[${8}]`)).getText()
			})
		} catch (error) {
			done = true
			break
		}
	}
	await driver
		.actions()
		.click(
			driver.findElement(By.css('input.btn.ui-button.ui-widget.ui-state-default.ui-corner-all'))
		)
		.perform()
}

console.log(table)

setTimeout(() => driver.close(), 1000)
