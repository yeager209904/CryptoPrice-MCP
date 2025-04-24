import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function testCryptoPriceServer() {
  console.log("Starting MCP crypto price server test...");
  
  // Create transport and client
  const transport = new StdioClientTransport({
    command: "node",
    args: ["server.js"]
  });

  const client = new Client({
    name: "crypto-price-test",
    version: "1.0.0"
  });

  try {
    // Connect to the server
    console.log("Connecting to server...");
    await client.connect(transport);
    console.log("Successfully connected to server");

    // Test Bitcoin price
    console.log("\nTesting 'cryptoPrice' tool with 'bitcoin'...");
    const bitcoinResult = await client.callTool({
      name: "cryptoPrice",
      arguments: {
        crypto: "bitcoin"
      }
    });
    
    console.log("Result:", bitcoinResult);
    if (bitcoinResult.content[0].text) {
      console.log("✅ Bitcoin price retrieved successfully:", bitcoinResult.content[0].text);
    } else {
      console.log("❌ Failed to get Bitcoin price, unexpected response format");
    }
    
    console.log("\nTest completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Test failed with error:", error);
    return false;
  } finally {
    try {
      // Close the transport instead of disconnecting the client
      await transport.close();
      console.log("Disconnected from server");
    } catch (disconnectError) {
      console.error("Error disconnecting:", disconnectError);
    }
  }
}

// Run the test
testCryptoPriceServer().then(success => {
  console.log(`Test ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
}); 