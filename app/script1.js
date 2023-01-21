/***
 * @author SaxDev
 * @date 12.27.2022
 *
 * To parse data from website https://www.prodavnicaalata.rs/ and store to exel file.
 *
 */

import {
    clickOnSearchButton,
    closingModals,
    createChromeDriver,
    createChromeHeadlessBrowser,
    findNumberOfDisplayProducts,
    getArticleCode,
    getCategoryText,
    getProductDescription,
    getProductImagesUrl,
    getProductPrice,
    getSubCategory1Text,
    getSubCategoryText,
    openLink,
    getProductBrand,
    getProductName,
} from "./seleniumFunctions.js";
import {
    products404PageTitle,
    productsPageTitle,
    scriptOneLink,
    tableHeader,
    timeout
} from "./consts.js";
import {
    By,
    until
} from "selenium-webdriver";
import {
    createDataInSpecifyRow,
    createExcelWorkbook,
    createExcelWorksheet,
    createHeaderOfTable,
    saveDataInExcelFile
} from "./excelFunctions.js";

/** Global variables **/
let numberOfProductOnPage;
let serialNumber = 0;
let saveRowId = 0;

/** Create driver  **/
let chrome = createChromeHeadlessBrowser();
let driver = await createChromeDriver(chrome);

await openLink(scriptOneLink, driver);

/** Create excel with header **/
let workbook = createExcelWorkbook();
let worksheet = createExcelWorksheet(workbook);
createHeaderOfTable(tableHeader,worksheet);
saveDataInExcelFile(workbook);

/** Find and disable modal for cookie and modal for promotions **/
await closingModals(driver)

/** Find and click on search button **/
await clickOnSearchButton(driver)

/** Wait to load new page **/
await driver.wait(until.titleIs(productsPageTitle), timeout);

/** Find number of products on page **/
numberOfProductOnPage = await findNumberOfDisplayProducts(driver);

/** Find number of pages with products **/
let lastPageNumber = await driver.findElement(By.css(`body > div.site > main > div > div.container > div > div.shop-layout__content > div > div > nav > ul > li:nth-child(5) > a`)).getText();

/** Loop to go through all pages **/
for (let j = 1; j < lastPageNumber; j++) {
    for (let i = 0; i < numberOfProductOnPage; i++) {
        /**
         *
         * Steps to get product data
         *
         * 1. Find a card with product and click to open a product detail page
         * 2. Check if page exist
         * 2. Collect all need data for product
         * 3. Back to all product page
         *
         */

        let productElement
        try{
            productElement = await driver.findElement(By.css(`body > div.site > main > div > div.container > div > div.shop-layout__content > div > div > div.products-view__list.products-list > div > div:nth-child(${i + 1}) > div > div.product-card__image > a`));
        } catch (e) {}

        if(productElement != null){
            await productElement.click();

            let title = await driver.getTitle();
            console.log(title)
            if(title == "502 Bad Gateway"){
                await driver.navigate().refresh();
            }
            if(title !== products404PageTitle){
                serialNumber++;
                let productPrice = await getProductPrice(driver);
                let productName = await getProductName(driver);
                console.log(productName)
                const priceNumberPart = productPrice.split(" ")[0];
                const price = priceNumberPart.replace(".", "");
                if(parseInt(price) > 250){
                    saveRowId++;
                    let articleCode = await getArticleCode(driver);
                    let category = await getCategoryText(driver);
                    let subCategory = await getSubCategoryText(driver);
                    let subCategory1 = await getSubCategory1Text(driver);
                    let brand = await getProductBrand(driver);
                    let productDescription = await getProductDescription(driver);
                    let productImageUrlsText = await getProductImagesUrl(driver);
                    createDataInSpecifyRow(worksheet, saveRowId + 1,[saveRowId, articleCode, category, subCategory, subCategory1, brand, productName, productDescription, productPrice, productImageUrlsText])
                    saveDataInExcelFile(workbook);
                } 

                console.log(`Finish ${serialNumber} / ${numberOfProductOnPage * lastPageNumber}`);
            }

            await driver.navigate().back()
            await driver.wait(until.titleIs(`${productsPageTitle}${j > 1 ? ` | (${j})` : ''}`), timeout);
        } else {
            console.log("productElement ne postoji");
        }
    }
    /** Go to next page **/
    await driver.get(`https://www.prodavnicaalata.rs/proizvodi/strana/${j + 1}/?`);
}

console.log("Finish all");

//Zatvaranje
driver.quit();
chrome.kill();
