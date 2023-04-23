import a, { By } from "selenium-webdriver"
import c from "selenium-webdriver/firefox.js"
let builder = new c.ServiceBuilder("C:\\Users\\samti\\.cache\\selenium\\geckodriver\\win64\\0.33.0\\geckodriver.exe")
let driver = await new a.Builder().forBrowser('firefox').setFirefoxService(builder).build();
await driver.get('https://eta.erau.edu/tseta/servlet/content?module=home&fromHomepg=true&page=home_ops_gen&view=general');
console.log(await driver.getTitle())
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line

//Login
{
    await driver.actions().pause(2000).perform()
    await driver.findElement(By.id("uname")).sendKeys("tischaes")
    await driver.findElement(By.id("password")).click()
    await driver.findElement(By.id("password")).sendKeys(string)
    await driver.actions().pause(1000).click(driver.findElement(By.id("butlogin"))).perform()
    await driver.findElement(By.css("*[value='FILTER]'")).click()
}


setTimeout(()=>driver.close(),5000)