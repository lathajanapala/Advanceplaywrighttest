import{test,expect} from '@playwright/test'
test("screenshot demo",async({page})=>{
await page.goto("https://demoblaze.com/")
const timeStamp = Date.now();
await page.screenshot({path:'screenshots/'+'homepage'+timeStamp+'.png'});
await page.screenshot({path:'screenshots/'+'fullpage'+timeStamp+'.png',fullPage:true});
const logo =page.locator("a[id='nava']");
await logo.screenshot({path:'screenshots/'+'logo'+timeStamp+'.png'});
const allproducts = page.locator(".row .row");
await allproducts.screenshot({path:'screenshots/'+'Allproducts'+timeStamp+'.png'});
});