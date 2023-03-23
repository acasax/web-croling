import chromeLauncher from 'chrome-launcher';
import "chromedriver";
import { Builder, By } from "selenium-webdriver";

/** Function to create and return argument to create chrome with developer options **/
export async function createChromeHeadlessBrowser() {
    console.log('Create chrome headless driver successfully.')
    return await chromeLauncher.launch({
        chromeFlags: ['--headless'],
    })
}

/** Function to create and return chrome driver **/
export async function createChromeDriver(chrome) {
    const driver = new Builder()
        .usingServer(chrome.socketPath)
        .withCapabilities({
            browserName: 'chrome',
        })
        .build();
    await driver.manage().window().maximize();
    console.log('Create chrome driver successfully.')
    return driver;
}

/** Function to open a link **/
export async function openLink(link, driver) {
    await driver.get(link);
}

/** Function for find and disable modal for cookie and modal for promotions **/
export async function closingModals(driver) {
    let cookie;
    try {
        cookie = await driver.findElement(By.id("myCookieConsent"));
    } catch (e) {
        console.log(`Cant find modal for cookies`);
    }

    if (cookie != null) {
        console.log("Disable modal for cookie");
        try {
            await cookie.findElement(By.id("cookieButton")).click();
        } catch (e) {
            console.log(`Cant find button on modal for cookies`);
        }
    } else {
        console.log("There is no modal for cookies");
    }

    let modalPromotion;
    try {
        modalPromotion = await driver.findElement(By.css("#popupModal > div > div > div.modal-footer > button"));
    } catch (e) {
        console.log(`Cant find modal for promotion`);
    }

    if (modalPromotion != null) {
        console.log("Disable modal for promotions");
        modalPromotion.click();
    } else {
        console.log("There is no modal for promotions.")
    }
}

/** Function to click on search button to show all products **/
export async function clickOnSearchButton(driver) {
    let searchButton;
    try {
        searchButton = await driver.findElement(By.css("body > div.site > header.site__header.d-lg-block.d-none > div > div.site-header__middle.container > div.site-header__search > div > div > div.search__form > button"));
    } catch (e) {
        console.log(`Cant find button for search`);
    }

    if (searchButton != null) {
        console.log("Click on button for search");
        searchButton.click();
    } else {
        console.log("There is no button for search");
    }
}

/** Function to find and return number of display products at page **/
export async function findNumberOfDisplayProducts(driver) {
    let numberOfProductOnPage;
    let elementsNumbers;
    try {
        elementsNumbers = await driver.findElement(By.css("body > div.site > main > div > div.container > div > div.shop-layout__content > div > div > div.products-view__options > div > div.view-options__legend"));
    } catch (e) {
        console.log(`Cant find div where display number of product on page`);
    }

    if (elementsNumbers != null) {
        const elementsNumbersText = await elementsNumbers.getText();
        const regex = /\d+/;
        const match = elementsNumbersText.match(regex);

        if (match) {
            numberOfProductOnPage = Number(match[0]);
        }
    } else {
        console.log("There is no div where display number of product on page");
    }
    return numberOfProductOnPage;
}

/** Function to get a product price from producet element to check is go to product page*/
export async function getProductElementPrice(driver, id) {
    let productPrice;
    try {

        productPrice = await driver.findElement(By.css(`body > div.site > main > div > div.container > div > div.shop-layout__content > div > div > div.products-view__list.products-list > div > div:nth-child(${id + 1}) > div > div.product-card__actions > div.product-card__prices`)).getText();
    } catch (error) {
        try {
            productPrice = await driver.findElement(By.css(`body > div.site > main > div > div.container > div > div.shop-layout__content > div > div > div.products-view__list.products-list > div > div:nth-child(${id + 1}) > div > div.product-card__actions > div.product-card__prices > span.product-card__new-price`)).getText();
        } catch (error) {

            try {
                productPrice = await driver.findElement(By.css(`body > div.site > main > div > div.container > div > div.shop-layout__content > div > div > div.products-view__list.products-list > div > div:nth-child(${id + 1}) > div.product-card > div.product-card__actions > div.product-card__prices > span.product-card__new-price`)).getText();
            } catch (error) {

            }
        }
    }

    return productPrice;
}

/** Function to find and return article code **/
export async function getArticleCode(driver) {
    let articleCodeFull;
     try {
        articleCodeFull = await driver.findElement(By.css(`body > div.site > main > div.site__body > section > div:nth-child(1) > div > div > div.product.product--layout--standard > div > div.product__info > ul > li.js-variant-sku.product-info`)).getText();
        console.log(`article code: ${articleCodeFull}`);
    } catch (e) {
        try {
            articleCodeFull = await driver.findElement(By.css(`body > div.site > main > div > section > div > div > div > div > div > div.product__info > div.product__description > b > ul > li.js-variant-sku.product-info`)).getText();
            console.log(`article code 1: ${articleCodeFull}`);
        } catch (e) {
            try {
                articleCodeFull = await driver.findElement(By.css(`body > div.site > main > div > section > div > div:nth-child(1) > div > div > div.product__content > div.product__info > div.product__description > ul > li.js-variant-sku.product-info`)).getText();
                console.log(`article code 2: ${articleCodeFull}`);
            } catch (e) {
                try {
                    articleCodeFull = await driver.findElement(By.css(`body > div.site > main > div > section > div > div:nth-child(1) > div > div > div.product__content > div.product__info > div.product__description > ul > li:nth-child(3)`)).getText();
                    console.log(`article code 3: ${articleCodeFull}`);
                } catch (e) {
                    try {
                        articleCodeFull = await driver.findElement(By.css(`body > div.site > main > div > section > div > div:nth-child(13) > div > div > div.product__content > div.product__info > div.product__description > ul > li.js-variant-sku.product-info`)).getText();
                        console.log(`article code 3: ${articleCodeFull}`);
                    } catch (e) {
                        console.log(`Cant find div where display article code`);
                    }
                }
            }
        }
    }
    let articleCode;
    const regex = /:(.+)/;
    const match = articleCodeFull.match(regex);
    if (match) {
        articleCode = match[1].trim();
    }
    return articleCode;
}

/** Function to find and return category of product **/
export async function getCategoryText(driver) {
    let categoryText;

    try {
        categoryText = await driver.findElement(By.css('body > div.site > main > div.site__body > section > div:nth-child(1) > div > div > div.product.product--layout--standard > div > div.product__hierarchy > ul')).getText();
    } catch (e) { }

    return categoryText;
}

/** Function to find and return subcategory of product **/
export async function getSubCategoryText(driver) {
    let subCategory1Text;

    try {
        subCategory1Text = await driver.findElement(By.css('body > div.site > main > div.site__body > section > div:nth-child(1) > div > div > div.product.product--layout--standard > div > div.product__hierarchy > ul > li > ul > li > a')).getText();
    } catch (e) { }

    return subCategory1Text;
}

/** Function to find and return subcategory1 of product **/
export async function getSubCategory1Text(driver) {
    let subCategory2Text;

    try {
        subCategory2Text = await driver.findElement(By.css('body > div.site > main > div.site__body > section > div:nth-child(1) > div > div > div.product.product--layout--standard > div > div.product__hierarchy > ul > li > ul > li > ul > li > a')).getText();
    } catch (e) { }

    return subCategory2Text;
}

/** Function to find and return product brand **/
export async function getProductBrand(driver) {
    let productBrand;
    try {
        productBrand = await driver.findElement(By.css(`body > div.site > main > div.site__body > section > div:nth-child(1) > div > div > div.product.product--layout--standard > div > div.product__info > ul > li:nth-child(2) > a`)).getText();
    } catch (error) {

    }

    return productBrand;
}

/** Function to find and return product description **/
export async function getProductDescription(driver) {
    let productDescription;
    try {
        let element = await driver.findElement(By.id('tab-description'));
        productDescription = await element.getText();
        productDescription = productDescription.replace(/(\r\n|\n|\r)/gm, "\n");
    } catch (error) {

    }

    return productDescription;
}

/** Function to find and return product price **/
export async function getProductPrice(driver) {
    let productPrice;
    try {

        productPrice = await driver.findElement(By.css(`body > div.site > main > div.site__body > section > div:nth-child(1) > div > div > div.product.product--layout--standard > div > div.product__sidebar > div.product__prices.product-standard-price`)).getText();
    } catch (error) {
        try {
            productPrice = await driver.findElement(By.css(`body > div.site > main > div.site__body > section > div:nth-child(1) > div > div > div.product.product--layout--standard > div > div.product__sidebar > div.product__prices > span.product-sale-price`)).getText();
        } catch (error) {
            try {
                productPrice = await driver.findElement(By.css(`body > div.site > main > div > section > div > div > div > div > div > div.product__info > b > div.product__sidebar > div.product__prices.product-standard-price`)).getText();
            } catch (error) {
                try {
                    productPrice = await driver.findElement(By.css(`body > div.site > main > div > section > div:nth-child(1) > div:nth-child(1) > div > div > div.product__content > div.product__info > div.product__sidebar > div.product__prices.product-standard-price`)).getText();
                } catch (error) {
                    try {
                        productPrice = await driver.findElement(By.css(`body > div.site > main > div > section > div > div > div > div > div > div.product__info > b > div.product__sidebar > div.product__prices > span.product-sale-price`)).getText();
                    } catch (error) {
                        try {
                            productPrice = await driver.findElement(By.css(`body > div.site > main > div > section > div > div:nth-child(1) > div > div > div.product__content > div.product__info > div.product__sidebar > div.product__prices > span.product-sale-price`)).getText();
                        } catch (error) {
                            try {
                                productPrice = await driver.findElement(By.css(`body > div.site > main > div > section > div > div:nth-child(13) > div > div > div.product__content > div.product__info > div.product__sidebar > div.product__prices > span.product-sale-price`)).getText();
                            } catch (error) {
                                try {
                                    productPrice = await driver.findElement(By.css(`body > div.site > main > div > section > div > div:nth-child(13) > div > div > div.product__content > div.product__info > div.product__sidebar > div.product__prices.product-standard-price`)).getText();
                                } catch (error) {
                                    console.log(`Error price ${error}`)
                                }
                            }

                        }
                    }

                }
            }
        }
    }

    return productPrice;
}

/** Function to find and return urls of product images **/
export async function getProductImagesUrl(driver) {
    let productImageCarousel;
    let productImageUrls;

    productImageCarousel = await driver.findElement(By.css('body > div.site > main > div.site__body > section > div:nth-child(1) > div > div > div.product.product--layout--standard > div > div.product__gallery > div > div.product-gallery__carousel'));
    productImageUrls = await productImageCarousel.findElements(By.css('.owl-item.active > a'));
    let productImageUrlsText = null;

    try {
        productImageCarousel = await driver.findElement(By.css('body > div.site > main > div.site__body > section > div:nth-child(1) > div > div > div.product.product--layout--standard > div > div.product__gallery > div > div.product-gallery__carousel'));
        productImageUrls = await productImageCarousel.findElements(By.css('.owl-item.active > a'));
    } catch (e) { }

    for (let element of productImageUrls) {
        if (productImageUrlsText !== null) {
            productImageUrlsText = productImageUrlsText + '\n' + await element.getAttribute('href');
        } else {
            productImageUrlsText = await element.getAttribute('href');
        }
    }

    return productImageUrlsText;
}

/** Function to find and return product name **/
export async function getProductName(driver) {
    let productName;
    try {
        productName = await driver.findElement(By.css(`body > div.site > main > div.site__body > section > div:nth-child(1) > div > div > div.product.product--layout--standard > div > div.product__info > h1`)).getText();
    } catch (error) {

    }

    return productName;
}

/** Function to find and return is product available **/
export async function getAvailabilityOfProduct(driver) {
    let productName;
    try {
        productName = await driver.findElement(By.css(`body > div.site > main > div > section > div:nth-child(1) > div.block > div > div.product.product--layout--standard > div > div.product__info > ul > li.product__meta-availability.mt4 > span`)).getText();
    } catch (error) {

    }

    return productName;
}


