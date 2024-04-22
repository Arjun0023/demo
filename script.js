function showBigButton() {
  const button = document.createElement('button');
  button.className = 'big-button';
  button.textContent = 'How can I help?';
  button.onclick = activateMic;
  document.body.appendChild(button);
}

function activateMic() {
  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    console.log("You said:", transcript);
    displayText(transcript);
  };

  recognition.onerror = function(event) {
    console.error('Error occurred:', event.error);
  };

  recognition.onend = function() {
    console.log('Speech recognition ended.');
  };

  recognition.start();
}

function extractLeadInfo(transcript) {
  const words = transcript.split(' ');
  let leadName = '';
  let companyName = '';
  for (let i = 0; i < words.length; i++) {
    if (words[i] === 'create') {
      leadName = words[i + 1];
    }
    if (words[i] === 'a') {
      const index = words.indexOf('for', i);
      companyName = words.slice(index + 1, i + 4).join(' ');
      break;
    }
  }
  return { leadName, companyName };
}

async function runPlaywrightAutomation(leadInfo) {
  const { email, password, companyName, lastName } = leadInfo;
  const { chromium } = require('playwright');
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.google.com/search?q=zoho+crm+login&oq=zoho+crm+login&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDc5ODVqMGoyqAIAsAIA&sourceid=chrome&ie=UTF-8');
  await page.getByRole('link', { name: 'Sign in to Zoho CRM Zoho' }).click();
  await page.getByRole('link', { name: 'SIGN IN' }).click();
  await page.getByPlaceholder('Email address or mobile number').click();
  await page.getByPlaceholder('Email address or mobile number').fill(email);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByPlaceholder('Enter password').press('Enter');
  await page.getByRole('button', { name: 'Skip for now' }).click();
  await page.getByRole('link', { name: 'Leads' }).click();
  await page.getByRole('button', { name: 'Create Lead' }).click();
  //await page.locator('#Crm_Leads_COMPANY #inputId').click();
  await page.locator('#Crm_Leads_COMPANY #inputId').fill(company);
  await page.locator('#Crm_Leads_LASTNAME_LInput').fill(lastName);
  await page.getByRole('button', { name: 'Save and New' }).click();

  // ---------------------
  await context.close();
  await browser.close();
}

function displayText(text) {
  const inputField = document.getElementById('textInput');
  inputField.value = text;

  // Extract lead information from the transcribed text
  const leadInfo = extractLeadInfo(text);

  // Send the transcribed text to the server
  fetch('http://localhost:3000/createLead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: text })
  })
  .then(response => response.json())
  .then(data => {
    // Handle the JSON response data here
    console.log('Server response:', data);
    console.log(data.success)
    runPlaywrightAutomation(data);
  })
  .catch(error => {
    console.error('Error sending data to server:', error);
  });
}

document.getElementById('circleIcon').addEventListener('click', showBigButton);