// src/App.tsx
import { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { Flex, Text, Button, Card } from "@radix-ui/themes"; 

import '@radix-ui/themes/styles.css';

const App = () => {
  const { account, balance, network, connectWallet, getBalance } = useWallet();
  const [address, setAddress] = useState("");

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="min-h-screen bg-gray-50 p-4"
    >
      <Card className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <Text size="4" className="text-2xl font-bold text-center mb-4">
          Wallet Connection
        </Text>

        {/* Connect Wallet Button */}
        <Flex direction="column" gap="2">
          <Button onClick={connectWallet} className="w-full">
            {account ? "Wallet Connected" : "Connect Wallet"}
          </Button>

          {account && (
            <Flex direction="column" gap="1">
              <Text className="mb-2">
                <strong>Account:</strong> {account}
              </Text>
              <Text className="mb-2">
                <strong>Network:</strong> {network || "Unknown"}
              </Text>
            </Flex>
          )}

          {/* Input for Address */}
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          {/* Get Balance Button */}
          <Button onClick={() => getBalance(address)} className="w-full">
            Get Balance
          </Button>

          {balance && (
            <Text align="center" className="text-center">
              <strong>Balance:</strong> {balance} ETH
            </Text>
          )}
        </Flex>
      </Card>
    </Flex>
  );
};

export default App;
