const puppeteer = require('puppeteer');
const fs = require('fs');
const arguments = process.argv.slice(2);

const getCompetitorUrl = async url => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1200,
            height: 750
        }
    });

    const splitString = url.split("&");
    url = splitString[0];

    const page = await browser.newPage();
    await page.goto(url);
    await page.waitFor(2000);

    const getFirstPage = await page.evaluate(() => {
        let links = [];
        const productLinks = document.querySelectorAll('h2 a.a-text-normal')
        for (let element of productLinks) {
            let hrefs = element.getAttribute('href');
            links.push(hrefs);
        }
        return { links }
    });

    const nextPage = () => {
        page.$eval('.a-selected + li', el => el.click());
    };
    nextPage();
    await page.waitFor(2000);
    await page.$('[alt="Wilton W4080 method of cake decorating Course 1 Student guide (English)"]')

    const transformUrl = await page.evaluate(() => {
        const eachUrl = document.URL;
        const numberPages = document.querySelector('.a-disabled:nth-child(6)');
        eachUrl.split('&').slice(0, 3).join('&');
        return {eachUrl}
    });

    await browser.close();

    return {
        ...{ url },
        ...getFirstPage,
        ...transformUrl,
        // ...(await getOtherPages())
    }



};

let writeableStream = fs.createWriteStream('result.txt');
arguments.forEach(url => {
    getCompetitorUrl(url).then(data => {
        writeableStream.write(JSON.stringify(data, null, 2));
    });
});