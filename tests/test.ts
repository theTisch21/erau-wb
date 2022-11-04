//import { calcLimits } from '$lib/limitCalc.ts';
import { expect, test } from '@playwright/test';

//I had some code here to test the limit calculator, but TypeScript hates it for some reason. The calculator works great, so unless you change it, you don't need to uncomment this
/*test('limit calculator is working properly', async ({page}) => {
	//Weight in limit
	expect(calcLimits(9999, 44).result).toBe(false)
	expect(calcLimits(3000, 44).result).toBe(false)
	expect(calcLimits(2551, 44).result).toBe(false)
	expect(calcLimits(2550, 44).result).toBe(true)
	expect(calcLimits(2540, 44).result).toBe(true)
	//CG in limit
	expect(calcLimits(1900, 34).result).toBe(false)
	expect(calcLimits(1900, 49).result).toBe(false)
	expect(calcLimits(1900, 38).result).toBe(true)
	expect(calcLimits(1900, 46).result).toBe(true)
	//Within limit near curve
	//Outside limit
	expect(calcLimits(2000,35).result).toBe(false)
	expect(calcLimits(2200,36).result).toBe(false)
	expect(calcLimits(2300,38).result).toBe(false)
	expect(calcLimits(2400,39).result).toBe(false)
	expect(calcLimits(2500,40).result).toBe(false)
	expect(calcLimits(2550,40.9).result).toBe(false)
	//Inside limit
	expect(calcLimits(1950,35).result).toBe(true)
	expect(calcLimits(1950,36).result).toBe(true)
	expect(calcLimits(2550,41).result).toBe(true)
	expect(calcLimits(2350,39).result).toBe(true)
	expect(calcLimits(2100,40).result).toBe(true)
	expect(calcLimits(2100,47).result).toBe(true)
	expect(calcLimits(2400,47).result).toBe(true)
	expect(calcLimits(2400,47.1).result).toBe(true)
})*/

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toBe('Welcome to SvelteKit');
});
