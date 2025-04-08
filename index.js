const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

const browser = await puppeteer.browser();
const page = await browser.newPage();

await page.goto("https://developers.google.com/");
await page.setViewport({width: 1080, height: 1024});


await browser.close();