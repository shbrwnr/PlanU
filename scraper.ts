const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    const actArr = []
    const person = {
        firstName: "",
        lastName: ""
    }
    await page.goto(url)

    // XPath is a way to navigate the page - similar to JQuery
    // Destructure and pull out the 0th element in the array 
    const [element] = await page.$x('//*[@id="field_49_8"]/div[2]');
    const text = await element.getProperty('textContent');
    const rawTxt = await text.jsonValue();

    // Spilt the paylod on caps
    const newTxt = rawTxt.split(/(?=[A-Z])/)

    newTxt.forEach(item => {
        person.lastName = ""
        if (item.endsWith(" ") || item.length == 1) {
            person.firstName = item
        }
        if (!(item.endsWith(" ")) && item.length > 1 && item != person.firstName) {
            person.lastName = item
        }
        if (person.lastName.length > 0) {
            console.log(`Name of Act: ${person.firstName}${person.lastName}`)
            actArr.push({ person: { firstname: person.firstName }, lastName: person.lastName })
            person.firstName = ""
        }
    });
    console.log(actArr)

    browser.close();
}

scrapeProduct('https://www.neon-entertainment.com/live-music/')