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
} from "../app/seleniumFunctions.js";
import {
    products404PageTitle,
    productsPageTitle,
    scriptOneLink,
    tableHeader,
    timeout
} from "../app/consts.js";
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
} from "../app/excelFunctions.js";

/** Global variables **/
let numberOfProductOnPage;
let serialNumber = 0;
let saveRowId = 0;

/** Create driver  **/
let chrome = createChromeHeadlessBrowser();
let driver = await createChromeDriver(chrome);

await openLink("https://www.prodavnicaalata.rs/proizvodi/akumulatorska-busilica-odvrtac-dewalt-dcd791p2-2x50ah/", driver);

/** Create excel with header **/
let workbook = createExcelWorkbook();
let worksheet = createExcelWorksheet(workbook);
createHeaderOfTable(tableHeader, worksheet);
saveDataInExcelFile(workbook);

/** Find and disable modal for cookie and modal for promotions **/
await closingModals(driver)


serialNumber++;
let productPrice = await getProductPrice(driver);
let productName = await getProductName(driver);
console.log(productName)
console.log(productPrice)
const priceNumberPart = productPrice.split(" ")[0];
console.log(priceNumberPart)
const price = priceNumberPart.replace(".", "");
console.log(price)
if (parseInt(price) > 250) {
    saveRowId++;
    let articleCode = await getArticleCode(driver);
    console.log(articleCode)
    let category = await getCategoryText(driver);
    let subCategory = await getSubCategoryText(driver);
    let subCategory1 = await getSubCategory1Text(driver);
    let brand = await getProductBrand(driver);
    let productDescription = await getProductDescription(driver);
    let productImageUrlsText = await getProductImagesUrl(driver);
    createDataInSpecifyRow(worksheet, saveRowId + 1, [saveRowId, articleCode, category, subCategory, subCategory1, brand, productName, productDescription, productPrice, productImageUrlsText])
    saveDataInExcelFile(workbook);
}

console.log("Finish all");

//Zatvaranje
driver.quit();
chrome.kill();
