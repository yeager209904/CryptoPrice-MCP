import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

// Create an MCP server
const server = new McpServer({
  name: "CryptoPrice",
  version: "1.0.0"
});

// Function to fetch crypto price from coinmarketcap.com
async function fetchCryptoPrice(crypto) {
  try {
    const response = await fetch(`https://coinmarketcap.com/currencies/${crypto.toLowerCase()}/`);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract price from meta tag
    const metaDescription = $('meta[property="og:description"]').attr('content');
    if (metaDescription) {
      const priceMatch = metaDescription.match(/\$([0-9,]+\.[0-9]+)/);
      if (priceMatch && priceMatch[1]) {
        return priceMatch[1].replace(',', '');
      }
    }
    
    throw new Error(`Could not find price for ${crypto}`);
  } catch (error) {
    console.error(`Error fetching ${crypto} price:`, error);
    throw error;
  }
}

// Add crypto price tool
server.tool("cryptoPrice",
  { crypto: z.string().describe("The cryptocurrency name (e.g. bitcoin, ethereum)") },
  async ({ crypto }) => {
    try {
      const price = await fetchCryptoPrice(crypto);
      return {
        content: [{ type: "text", text: `$${price}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport); 