"use client";

import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

// Initialize Aptos client - will be updated dynamically
let config = new AptosConfig({ network: Network.TESTNET });
let aptos = new Aptos(config);

interface Transaction {
  hash: string;
  status: "pending" | "success" | "failed";
  amount: number;
  recipient: string;
  timestamp: Date;
}

export default function P2PRemittance() {
  const {
    account,
    connected,
    connect,
    disconnect,
    wallet,
    wallets,
    signAndSubmitTransaction,
  } = useWallet();

  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<Network>(
    Network.TESTNET
  );

  // Switch network function
  const switchNetwork = (network: Network) => {
    console.log(`🔄 Switching to ${network}`);
    setCurrentNetwork(network);

    // Update Aptos client configuration
    config = new AptosConfig({ network });
    aptos = new Aptos(config);

    // Clear previous data and fetch new balance
    setBalance(0);
    setError("");
    fetchBalance();
  };

  // Fetch balance using SDK only (recommended by Aptos docs)
  const fetchBalance = async () => {
    if (!account) return;

    setIsLoadingBalance(true);
    setError("");

    const currentAddress = account.address.toString();
    console.log(
      `🔍 Fetching balance for: ${currentAddress} on ${currentNetwork.toUpperCase()}`
    );

    try {
      // Use SDK getAccountResource (recommended by docs) - SDK handles network automatically
      const accountBalance = await aptos.getAccountResource({
        accountAddress: account.address,
        resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
      });

      const balanceValue = Number((accountBalance as any).coin.value);
      const balanceInAPT = balanceValue / 100000000; // Convert from octas to APT
      console.log(
        `✅ SDK Success: ${balanceInAPT} APT found on ${currentNetwork.toUpperCase()}!`
      );
      setBalance(balanceInAPT);
      setError(""); // Clear any previous errors
    } catch (sdkError: any) {
      console.log(
        `⚠️ SDK failed on ${currentNetwork.toUpperCase()}:`,
        sdkError.message || sdkError
      );

      // Check if it's a "resource not found" error (account has no APT)
      if (
        sdkError.message?.includes("resource_not_found") ||
        sdkError.status === 404
      ) {
        console.log(`❌ No APT found on ${currentNetwork.toUpperCase()}`);
        setBalance(0);
        setError(
          `No APT balance found on ${currentNetwork.toUpperCase()}. Try switching networks or fund your account.`
        );
      } else {
        // Some other error occurred
        console.error(
          `💥 Unexpected SDK error on ${currentNetwork.toUpperCase()}:`,
          sdkError
        );
        setBalance(0);
        setError(
          `Failed to fetch balance from ${currentNetwork.toUpperCase()}: ${
            sdkError.message || "Unknown error"
          }`
        );
      }
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Check balance for a specific address using SDK (for debugging)
  const checkSpecificAddress = async (address: string) => {
    console.log(
      `🔍 Checking specific address: ${address} on ${currentNetwork.toUpperCase()}`
    );

    try {
      // Use SDK to check the specific address
      const accountBalance = await aptos.getAccountResource({
        accountAddress: address,
        resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
      });

      const balanceValue = Number((accountBalance as any).coin.value);
      const balance = balanceValue / 100000000;
      console.log(
        `✅ Address ${address.slice(
          0,
          10
        )}... has ${balance} APT on ${currentNetwork.toUpperCase()}`
      );
      alert(
        `✅ Address ${address.slice(
          0,
          10
        )}... has ${balance} APT on ${currentNetwork.toUpperCase()}`
      );

      // Check if this matches current wallet
      if (
        account &&
        account.address.toString().toLowerCase() === address.toLowerCase()
      ) {
        console.log("✅ Address matches current wallet!");
        setBalance(balance);
      } else {
        console.log("⚠️ Address DOES NOT match current wallet");
        console.log("Current wallet:", account?.address.toString());
        console.log("Checked address:", address);
      }
    } catch (error: any) {
      console.log(
        `❌ Address ${address.slice(
          0,
          10
        )}... has no APT on ${currentNetwork.toUpperCase()}`
      );
      alert(
        `❌ Address ${address.slice(
          0,
          10
        )}... has no APT on ${currentNetwork.toUpperCase()}`
      );
    }
  };

  // Import wallet from private key (to fix wallet mismatch)
  const importWalletFromFundedAddress = () => {
    const fundedAddress =
      "0xe39ef7784d0d9863c3399418cd99310537d29a6f1f94aa8572624c340924eb13";
    const currentAddress = account?.address.toString();

    const message = `
🔧 WALLET MISMATCH FIX OPTIONS

Current wallet: ${currentAddress?.slice(0, 20)}...
Funded address: ${fundedAddress.slice(0, 20)}...

SOLUTION 1: Import Private Key (Recommended)
- If you have the private key for ${fundedAddress.slice(0, 10)}...
- Import it into your wallet (Petra/Pontem/etc.)
- This will give you access to the 1 APT

SOLUTION 2: Fund Current Wallet
- Copy your current address: ${currentAddress}
- Go to: https://aptos.dev/network/faucet
- Paste and get free testnet APT

SOLUTION 3: Transfer (Need Private Key)
- Use the private key of ${fundedAddress.slice(0, 10)}... to send APT
- To your current wallet: ${currentAddress?.slice(0, 10)}...

SOLUTION 4: Reset Wallet
- Create a new wallet and fund it fresh
- Or reconnect with the wallet that owns ${fundedAddress.slice(0, 10)}...

Choose the option that works best for you!
    `;

    // Also copy current address to clipboard if possible
    if (navigator.clipboard && currentAddress) {
      navigator.clipboard.writeText(currentAddress);
      alert(
        message +
          "\n\n📋 Your current wallet address has been copied to clipboard!"
      );
    } else {
      alert(message);
    }
  };

  // Check for wallet mismatch on load
  const checkWalletMismatch = async () => {
    if (!account) return;

    const fundedAddress =
      "0xe39ef7784d0d9863c3399418cd99310537d29a6f1f94aa8572624c340924eb13";
    const currentAddress = account.address.toString();

    // Check if addresses match
    if (currentAddress.toLowerCase() === fundedAddress.toLowerCase()) {
      console.log("✅ Wallet addresses match - no mismatch!");
      return;
    }

    // Check if funded address has balance
    try {
      const response = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/accounts/${fundedAddress}/resource/0x1::coin::CoinStore%3C0x1::aptos_coin::AptosCoin%3E`
      );

      if (response.ok) {
        const data = await response.json();
        const fundedBalance = Number(data.data.coin.value) / 100000000;

        if (fundedBalance > 0) {
          console.log("🚨 WALLET MISMATCH DETECTED!");
          console.log(
            `Funded address ${fundedAddress} has ${fundedBalance} APT`
          );
          console.log(`But current wallet ${currentAddress} is different`);

          setError(
            `⚠️ Wallet Mismatch: You have ${fundedBalance} APT in a different address. Click "Fix Wallet Mismatch" for solutions.`
          );
        }
      }
    } catch (error) {
      console.log("Could not check funded address:", error);
    }
  };

  // Auto-fetch balance when account changes
  React.useEffect(() => {
    if (connected && account) {
      fetchBalance();
      checkWalletMismatch(); // Also check for mismatch
    }
  }, [connected, account]);

  const handleTransfer = async () => {
    if (!account || !amount || !recipient) {
      setError("Please fill in all fields");
      return;
    }

    if (parseFloat(amount) > balance) {
      setError("Insufficient balance");
      return;
    }

    setIsTransferring(true);
    setError("");

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [
            recipient,
            Math.floor(parseFloat(amount) * 100000000),
          ], // Convert to octas
        },
      });

      // Wait for transaction to be confirmed
      await aptos.waitForTransaction({ transactionHash: response.hash });

      // Add transaction to list
      const newTransaction: Transaction = {
        hash: response.hash,
        status: "success",
        amount: parseFloat(amount),
        recipient,
        timestamp: new Date(),
      };

      setTransactions([newTransaction, ...transactions]);

      // Reset form
      setAmount("");
      setRecipient("");

      // Refresh balance
      await fetchBalance();
    } catch (error) {
      console.error("Transfer failed:", error);
      setError("Transfer failed. Please try again.");
    } finally {
      setIsTransferring(false);
    }
  };

  const getExplorerUrl = (txHash: string) => {
    return `https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`;
  };

  if (!connected) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            <Wallet className="h-6 w-6 mr-2" />
            Connect Your Aptos Wallet
          </CardTitle>
          <CardDescription>
            Connect your wallet to start sending APT globally on Aptos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {wallets.length > 0 ? (
              <div className="space-y-2">
                {wallets.map((wallet) => (
                  <Button
                    key={wallet.name}
                    onClick={() => connect(wallet.name)}
                    className="w-full"
                    variant="outline"
                  >
                    <img
                      src={wallet.icon}
                      alt={wallet.name}
                      className="w-5 h-5 mr-2"
                    />
                    Connect {wallet.name}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No Aptos wallets detected. Please install a wallet like Petra.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wallet Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Wallet Information
              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                {currentNetwork.toUpperCase()}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={disconnect}>
              Disconnect
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Connected Wallet
              </label>
              <p className="font-medium">{wallet?.name}</p>
              <p className="font-mono text-sm bg-muted p-2 rounded mt-1">
                {account?.address.toString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Balance
              </label>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-green-600">
                  {isLoadingBalance ? "..." : balance.toFixed(4)} APT
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchBalance}
                  disabled={isLoadingBalance}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isLoadingBalance ? "animate-spin" : ""
                    }`}
                  />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Address: {account?.address.toString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Switcher */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">🔄 Network Switcher</CardTitle>
          <CardDescription className="text-blue-700">
            Test different networks to find your APT balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button
              variant={
                currentNetwork === Network.TESTNET ? "default" : "outline"
              }
              size="sm"
              onClick={() => switchNetwork(Network.TESTNET)}
            >
              TESTNET
            </Button>
            <Button
              variant={
                currentNetwork === Network.MAINNET ? "default" : "outline"
              }
              size="sm"
              onClick={() => switchNetwork(Network.MAINNET)}
              className="bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
            >
              MAINNET 💰
            </Button>
            <Button
              variant={
                currentNetwork === Network.DEVNET ? "default" : "outline"
              }
              size="sm"
              onClick={() => switchNetwork(Network.DEVNET)}
            >
              DEVNET
            </Button>
          </div>
          <p className="text-xs text-blue-700">
            💡 Your APT might be on MAINNET instead of TESTNET. Click "MAINNET
            💰" to check!
          </p>
        </CardContent>
      </Card>

      {/* Transfer Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="h-5 w-5 mr-2" />
            Send APT - P2P Remittance
          </CardTitle>
          <CardDescription>
            Send APT instantly to any Aptos wallet address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Amount (APT)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.0001"
                min="0"
                max={balance}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Available: {balance.toFixed(4)} APT
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Recipient Address
              </label>
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="font-mono"
              />
            </div>
          </div>

          {/* Transaction Preview */}
          {amount && recipient && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Transaction Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{amount} APT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Fee:</span>
                    <span className="font-medium">~0.0001 APT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recipient:</span>
                    <span className="font-mono text-xs">
                      {recipient.slice(0, 10)}...{recipient.slice(-8)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total Cost:</span>
                    <span>~{(parseFloat(amount) + 0.0001).toFixed(4)} APT</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleTransfer}
            disabled={!amount || !recipient || isTransferring}
            className="w-full"
            size="lg"
          >
            {isTransferring ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : !amount ? (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enter Amount
              </>
            ) : !recipient ? (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enter Recipient Address
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send {amount} APT
              </>
            )}
          </Button>

          {balance === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">
                    Account needs funding
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Fund your account with testnet APT to start sending
                    transactions.
                  </p>
                  <div className="mt-2 p-2 bg-white rounded border">
                    <p className="text-xs font-mono text-gray-600">
                      Your address: {account?.address.toString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button asChild size="sm">
                      <a
                        href="https://aptos.dev/network/faucet"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Get Testnet APT
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchBalance}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Check Balance
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        checkSpecificAddress(
                          "0xe39ef7784d0d9863c3399418cd99310537d29a6f1f94aa8572624c340924eb13"
                        )
                      }
                    >
                      Check Funded Address
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={importWalletFromFundedAddress}
                      className="bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100"
                    >
                      Fix Wallet Mismatch
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
                    >
                      <a
                        href={`https://explorer.aptoslabs.com/account/${account?.address.toString()}?network=${currentNetwork}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Explorer
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest APT transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.hash}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Sent {tx.amount} APT</p>
                      <p className="text-sm text-muted-foreground">
                        To: {tx.recipient.slice(0, 10)}...
                        {tx.recipient.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {tx.timestamp.toLocaleTimeString()}
                    </p>
                    <a
                      href={getExplorerUrl(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                    >
                      View on Explorer
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
