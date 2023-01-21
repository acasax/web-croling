import chromeLauncher from 'chrome-launcher';
import {Builder, Capabilities} from 'selenium-webdriver';

async function run() {
    // launch a new instance of Chrome
    const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless']
    });

    // create a new Selenium WebDriver
    const driver = new Builder()
        .forBrowser('chrome')
        .withCapabilities(Capabilities.chrome())
        .usingServer(`http://localhost:${chrome.port}`)
        .build();

    // navigate to the webpage
    await driver.get('https://www.example.com');

    // do something with the webpage

    // close the browser
    await driver.quit();
    await chrome.kill();
}

run();
