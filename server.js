// redeploy trigger

import express from "express";
import fetch from "node-fetch";
import cheerio from "cheerio";

const app = express();

app.get("/seraphim", async (req, res) => {
  try {
    const response = await fetch("https://www.seraphimsl.com/category/super-sales/");
    const html = await response.text();
    const $ = cheerio.load(html);

    let sales = [];
    $(".post").each((i, el) => {
      const title = $(el).find(".entry-title a").text().trim();
      const link = $(el).find(".entry-title a").attr("href");
      const description = $(el).find(".entry-content p").first().text().trim();
      const priceMatch = $(el).find(".entry-content").text().match(/\d+L|\bfree\b/i);
      const slurl = $(el).find("a[href*='maps.secondlife.com']").attr("href");

      sales.push({
        title,
        description,
        price: priceMatch ? priceMatch[0] : "N/A",
        slurl,
        link
      });
    });

    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: "Failed to scrape Seraphim" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
