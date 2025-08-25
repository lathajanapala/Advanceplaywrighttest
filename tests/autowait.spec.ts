import{test,expect,Locator} from '@playwright/test'
test("Verify autowait",async({page})=>{
    test.setTimeout(50000);

    await page.goto("https://demowebshop.tricentis.com/");
    // test.setTimeout(50000);
    // test.slow();
    expect (page).toHaveURL("https://demowebshop.tricentis.com/",{ timeout: 10000 });
    const text = page.locator("div.topic-html-content-title:has-text('Welcome to our store')");
    expect(text).toBeVisible();
    expect(text).toHaveText(/Welcome to our store/i,{ timeout: 10000 });
    await page.locator("#small-searchterms[name='q']").fill("Laptop");
    await page.locator(".button-1.search-box-button").click();



})