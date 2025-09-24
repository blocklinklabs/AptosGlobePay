"use client";

import { useState } from "react";
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
  ArrowLeftRight,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { transferCoins, STABLECOINS, getTransactionDetails } from "@/lib/aptos";

interface Transaction {
  hash: string;
  status: "pending" | "success" | "failed";
  amount: number;
  recipient: string;
  timestamp: Date;
}

export default function AptosRemittance() {
  const { account, balance, isConnected, connect, refreshBalance } =
    useWallet();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("APT");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");

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
      // Get the coin type based on selection
      const coinType = STABLECOINS[selectedCoin as keyof typeof STABLECOINS];

      const txHash = await transferCoins(
        account,
        recipient,
        parseFloat(amount),
        coinType
      );

      // Add transaction to list
      const newTransaction: Transaction = {
        hash: txHash,
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
      await refreshBalance();
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

  if (!isConnected) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            <Wallet className="h-6 w-6 mr-2" />
            Connect Your Aptos Wallet
          </CardTitle>
          <CardDescription>
            Connect your wallet to start sending money globally on Aptos
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={connect} size="lg" className="w-full max-w-sm">
            <Wallet className="h-5 w-5 mr-2" />
            Connect Wallet
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            This will create a test wallet for demo purposes
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show funding guide if wallet is connected but has no balance
  if (isConnected && balance === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800">
              <AlertCircle className="h-5 w-5 mr-2" />
              Account Needs Funding
            </CardTitle>
            <CardDescription className="text-amber-700">
              Your wallet is connected but has no APT balance. Please fund it to
              start using the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Your Wallet Address:</h4>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                {account?.accountAddress.toString()}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">How to fund your account:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Visit the official Aptos testnet faucet</li>
                <li>Paste your wallet address above</li>
                <li>Complete the CAPTCHA verification</li>
                <li>Click "Request APT" to receive testnet tokens</li>
              </ol>
            </div>

            <Button asChild className="w-full">
              <a
                href="https://aptos.dev/network/faucet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Aptos Faucet
              </a>
            </Button>

            <Button
              variant="outline"
              onClick={refreshBalance}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Balance Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wallet Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Wallet Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Address
              </label>
              <p className="font-mono text-sm bg-muted p-2 rounded">
                {account?.accountAddress.toString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Balance
              </label>
              <p className="text-2xl font-bold text-green-600">
                {balance.toFixed(4)} APT
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="h-5 w-5 mr-2" />
            Send Money on Aptos
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
              <label className="text-sm font-medium mb-2 block">Amount</label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.0001"
                  min="0"
                  max={balance}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <select
                    value={selectedCoin}
                    onChange={(e) => setSelectedCoin(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium"
                  >
                    <option value="APT">APT</option>
                  </select>
                </div>
              </div>
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
            disabled={
              !amount ||
              !recipient ||
              isTransferring ||
              parseFloat(amount) > balance
            }
            className="w-full"
            size="lg"
          >
            {isTransferring ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send {amount || "0"} APT
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest Aptos transactions</CardDescription>
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
