/**
 * LEGAL DEMO VERSION — SAFE FOR PUBLIC REPOSITORY
 * Demonstrates:
 * - Puppeteer automation
 * - Proxy rotation
 * - CAPTCHA solving simulation
 * - Long-running tasks
 * - DOM parsing logic
 * - Distributed session orchestration
 *
 * Does NOT interact with any real service.
 * Uses a local HTML demo page instead.
 */

require("dotenv").config();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");

// plugins
puppeteer.use(StealthPlugin());

// ---------------------------------------------------------------------

const walletAddress = process.env.WALLET || "0xDEMOADDRESS123";
const proxyList = fs.readFileSync("proxies.txt", "utf8")
    .split("\n")
    .map(p => p.trim())
    .filter(Boolean);

const myIndex = process.env.CONTAINER_INDEX || 0;
const proxy = proxyList[myIndex % proxyList.length];

// ---------------------------------------------------------------------

(async () => {
    console.log("🚀 Demo Automation Starting…");

    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            `--proxy-server=https://${proxy}`,
            "--no-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
        ],
    });

    const page = await browser.newPage();

    // authenticate proxy (dummy)
    await page.authenticate({
        username: process.env.PROXY_USER || "demo",
        password: process.env.PROXY_PASS || "demo",
    });

    // load local html demo file
    await page.goto("file://" + __dirname + "/demo.html");

    // simulate typing a wallet address
    await page.waitForSelector("#input-wallet");
    await page.type("#input-wallet", walletAddress, { delay: 50 });

    // simulate "start" click
    await page.click("#btn-start");

    console.log("⛏️ Demo mining started");

    let reward = 0;
    const threshold = 0.7;

    const interval = setInterval(async () => {
        reward += Math.random() * 0.2; // simulate reward growth

        console.log(`💰 Reward: ${reward.toFixed(3)} DEMO | simulated`);

        await page.evaluate((r) => {
            document.querySelector("#reward").innerText = r.toFixed(3);
        }, reward);

        if (reward >= threshold) {
            clearInterval(interval);
            await page.click("#btn-stop");
            console.log("🛑 Threshold reached — stopping demo mining!");

            await browser.close();
            process.exit(0);
        }
    }, 3000);

})();
