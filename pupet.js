const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {

    console.log('launching browser');
    const browser = await puppeteer.launch({ headless: true }); // default is true
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${"neural networks"}`);

    const URLs = await page.$$eval('.r a', links => {
        return links.map(l => {

            return l.href;

        })
    });

    let batches = [];
    let newBatch = [];

    URLs.forEach((url, index) => {
        newBatch.push(url);

        if (index % 2 === 0) {
            //flush the batch to batches
            batches.push(newBatch);
            newBatch = [];
        }
    })

    let results = [];
    console.log('batches.length:', batches.length)
    for (let batch of batches) {
        console.log(`Starting to proccess batch: ${batch}`)
        for(let url of batch){
            console.log(`Opening page ${url}`)
            let newPage = await browser.newPage();
                await newPage.goto(url);

                let result = await newPage.evaluate(()=>{
                    return Array.from(document.querySelectorAll("*")).filter(el => el.childElementCount === 0 && !(el.tagName === "SCRIPT" || el.tagName === "STYLE" || el.tagName === "NOSCRIPT")).filter(el =>  el.textContent.replace(/\s/g, "").length > 200).reduce((acc, curr) => acc+curr.textContent, "")
                })

                results.push(result);
        }
    }

    console.log("Done!")



    await browser.close();
})();