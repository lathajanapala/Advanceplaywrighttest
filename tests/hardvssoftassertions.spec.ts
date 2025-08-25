import{test,expect,Locator} from '@playwright/test'
test("Verify softassertiona and hard assertion",async({page})=>{
    test.setTimeout(50000);

    await page.goto("https://demowebshop.tricentis.com/");
    // test.setTimeout(50000);
        // test.slow();
    });