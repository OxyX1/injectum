const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

const PORT = process.env.PORT || 8080;

const browser = await puppeteer.browser();
const page = await browser.newPage();

await page.goto("https://developers.google.com/");
await page.setViewport({width: 1080, height: 1024});

app.listen(PORT, () => {
    console.log("backend running on port 8080");
});
await browser.close();