import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Create a transport that will start the server process
const transport = new StdioClientTransport({
  command: "node",
  args: ["server.js"]
});

// Create a client
const client = new Client({
  name: "crypto-price-client",
  version: "1.0.0"
});

// Connect to the server
await client.connect(transport);

// Example: Get Bitcoin price
try {
  console.log("Fetching Bitcoin price...");
  const bitcoinResult = await client.callTool({
    name: "cryptoPrice",
    arguments: {
      crypto: "bitcoin"
    }
  });
  console.log("Bitcoin price:", bitcoinResult.content[0].text);

  // Example: Get Ethereum price
  console.log("\nFetching Ethereum price...");
  const ethereumResult = await client.callTool({
    name: "cryptoPrice",
    arguments: {
      crypto: "ethereum"
    }
  });
  console.log("Ethereum price:", ethereumResult.content[0].text);
  
  // Example: Get Dogecoin price
  console.log("\nFetching Dogecoin price...");
  const dogecoinResult = await client.callTool({
    name: "cryptoPrice",
    arguments: {
      crypto: "dogecoin"
    }
  });
  console.log("Dogecoin price:", dogecoinResult.content[0].text);
} catch (error) {
  console.error("Error:", error);
} finally {
  // Close the transport instead of disconnecting the client
  await transport.close();
} 