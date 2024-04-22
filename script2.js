const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.google.com/search?q=zoho+crm+login&oq=zoho+crm+login&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDc5ODVqMGoyqAIAsAIA&sourceid=chrome&ie=UTF-8');

  // Click on the link to navigate to Zoho CRM login page
  await page.waitForSelector('a[href*="accounts.zoho.com"]');
  await page.click('a[href*="accounts.zoho.com"]');

  // Wait for the Zoho CRM login page to load and fill in login details
  await page.waitForSelector('input[name="login_id"]');
  await page.fill('input[name="login_id"]', 'arjunpawar0023@gmail.com');
  await page.fill('input[name="password"]', '!@#123letsgoo');
  await page.click('button[type="submit"]');

  // Wait for Zoho CRM dashboard to load and navigate to Leads section
  await page.waitForNavigation();
  await page.click('a[href*="/Leads/"]');
  await page.waitForSelector('a[data-zcqa="cv_leads_new_leads"]');
  await page.click('a[data-zcqa="cv_leads_new_leads"]');

  // Fill in lead details and save
  await page.waitForSelector('#Crm_Leads_COMPANY #inputId');
  await page.fill('#Crm_Leads_COMPANY #inputId', 'asd');
  await page.fill('#Crm_Leads_LASTNAME_LInput', 'saasd');
  await page.click('button[data-zcqa="cv_leads_save"]');
  
  // Additional actions if needed

  // Close the browser context and the browser
  await context.close();
  await browser.close();
})();
