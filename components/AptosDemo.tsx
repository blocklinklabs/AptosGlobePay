"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Send,
  ArrowLeftRight,
} from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import {
  checkAccountStatus,
  checkFaucetStatus,
  getBalanceAlternative,
} from "@/lib/aptos";

export default function AptosDemo() {
  const {
    account,
    balance,
    isConnected,
    connect,
    refreshBalance,
    createNewWallet,
  } = useWallet();
  const [copied, setCopied] = useState(false);
  const [accountStatus, setAccountStatus] = useState<{
    exists: boolean;
    hasResources: boolean;
    balance: number;
    isInitialized: boolean;
    sequenceNumber: string;
  } | null>(null);
  const [faucetStatus, setFaucetStatus] = useState<{
    hasTransactions: boolean;
    transactionCount: number;
    lastTransactionHash?: string;
  } | null>(null);
  const [alternativeBalance, setAlternativeBalance] = useState<number>(0);

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account.accountAddress.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const checkStatus = async () => {
    if (account) {
      const status = await checkAccountStatus(
        account.accountAddress.toString()
      );
      setAccountStatus(status);

      const faucet = await checkFaucetStatus(account.accountAddress.toString());
      setFaucetStatus(faucet);

      const altBalance = await getBalanceAlternative(
        account.accountAddress.toString()
      );
      setAlternativeBalance(altBalance);
    }
  };

  // Check status when account changes
  React.useEffect(() => {
    if (account) {
      checkStatus();
    }
  }, [account]);

  const steps = [
    {
      title: "Connect Wallet",
      description: "Create a new test wallet for demo purposes",
      icon: Wallet,
      completed: isConnected,
      action: !isConnected ? (
        <Button onClick={connect} size="sm">
          <Wallet className="h-4 w-4 mr-2" />
          Connect
        </Button>
      ) : null,
    },
    {
      title: "Fund Account",
      description: "Get testnet APT from the official faucet",
      icon: ExternalLink,
      completed: balance > 0,
      action:
        balance === 0 ? (
          <Button asChild size="sm">
            <a
              href="https://aptos.dev/network/faucet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Faucet
            </a>
          </Button>
        ) : null,
    },
    {
      title: "Start Using",
      description: "Send APT or swap currencies on Aptos",
      icon: Send,
      completed: balance > 0,
      action: null,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Aptos DeFi Demo</h2>
        <p className="text-muted-foreground">
          Experience blockchain-powered remittance and FOREX swaps on Aptos
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card
              key={index}
              className={`${
                step.completed
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      step.completed
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  {step.title}
                </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {step.action && step.action}
                {step.completed && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Wallet Info */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Wallet Information
              </div>
              <Button variant="outline" size="sm" onClick={refreshBalance}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="font-mono text-sm bg-muted p-2 rounded flex-1">
                    {account?.accountAddress.toString()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAddress}
                    className="shrink-0"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Wallet Management */}
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    💾 Wallet is saved locally and will persist between sessions
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={createNewWallet}
                    className="w-full"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Create New Wallet
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Balance
                </label>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    balance > 0 ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {balance.toFixed(4)} APT
                </p>
              </div>
            </div>

            {balance === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-800">
                      Account needs funding
                    </h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Copy your address above and visit the Aptos faucet to get
                      testnet APT. After funding, click "Check Balance Again" to
                      update.
                    </p>
                    {accountStatus && !accountStatus.isInitialized && (
                      <div className="mt-2 p-2 bg-yellow-100 rounded text-xs text-yellow-800">
                        ⚠️ Account exists but is not initialized yet. This is
                        normal for new accounts. The faucet transaction will
                        initialize the account and create resources.
                      </div>
                    )}
                    {accountStatus && accountStatus.sequenceNumber === "0" && (
                      <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
                        ℹ️ Sequence number is 0, meaning no transactions have
                        been processed yet. The faucet request will be your
                        first transaction.
                      </div>
                    )}
                    <div className="flex space-x-2 mt-3">
                      <Button asChild size="sm">
                        <a
                          href="https://aptos.dev/network/faucet"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Faucet
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshBalance}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Check Balance
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://explorer.aptoslabs.com/account/${account?.accountAddress.toString()}?network=testnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Explorer
                        </a>
                      </Button>
                    </div>

                    {/* Solution for Address Mismatch */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-800 text-sm mb-2">
                        🔧 Solution:
                      </h5>
                      <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                        <li>
                          Copy the address above:{" "}
                          <code className="bg-blue-100 px-1 rounded">
                            {account?.accountAddress.toString()}
                          </code>
                        </li>
                        <li>
                          Visit the Aptos faucet:{" "}
                          <a
                            href="https://aptos.dev/network/faucet"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            https://aptos.dev/network/faucet
                          </a>
                        </li>
                        <li>Paste the correct address (the one shown above)</li>
                        <li>Complete the CAPTCHA and request APT</li>
                        <li>Wait 1-2 minutes for the transaction to process</li>
                        <li>Click "Check Balance" to verify</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {balance > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">
                      Ready to use!
                    </h4>
                    <p className="text-sm text-green-700">
                      Your wallet is funded and ready for P2P transfers and
                      FOREX swaps.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Debug Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Debug Info</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Connected: {isConnected ? "Yes" : "No"}</p>
                <p>Balance (SDK): {balance} APT</p>
                <p>Balance (REST API): {alternativeBalance} APT</p>
                <p>Account: {account?.accountAddress.toString()}</p>
                <p>Network: Aptos Testnet</p>

                {/* Address Verification */}
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 font-medium text-xs">
                    ⚠️ Address Mismatch Detected!
                  </p>
                  <p className="text-red-700 text-xs mt-1">
                    Your app account:{" "}
                    <code>{account?.accountAddress.toString()}</code>
                  </p>
                  <p className="text-red-700 text-xs">
                    Faucet transaction was sent to: <code>0xf7c2...4658</code>
                  </p>
                  <p className="text-red-600 text-xs mt-1">
                    These are different addresses! You need to fund the correct
                    account.
                  </p>
                </div>
                {accountStatus && (
                  <>
                    <p>Account Exists: {accountStatus.exists ? "Yes" : "No"}</p>
                    <p>
                      Is Initialized:{" "}
                      {accountStatus.isInitialized ? "Yes" : "No"}
                    </p>
                    <p>
                      Has Resources: {accountStatus.hasResources ? "Yes" : "No"}
                    </p>
                    <p>Sequence Number: {accountStatus.sequenceNumber}</p>
                    <p>Status Balance: {accountStatus.balance} APT</p>
                  </>
                )}
                {faucetStatus && (
                  <>
                    <p>
                      Has Transactions:{" "}
                      {faucetStatus.hasTransactions ? "Yes" : "No"}
                    </p>
                    <p>Transaction Count: {faucetStatus.transactionCount}</p>
                    {faucetStatus.lastTransactionHash && (
                      <p>
                        Last TX: {faucetStatus.lastTransactionHash.slice(0, 10)}
                        ...
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className="flex space-x-2 mt-2">
                <Button variant="outline" size="sm" onClick={refreshBalance}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Balance
                </Button>
                <Button variant="outline" size="sm" onClick={checkStatus}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {isConnected && balance > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Start using the Aptos DeFi features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild className="h-20 flex flex-col">
                <a href="/aptos">
                  <Send className="h-6 w-6 mb-2" />
                  P2P Remittance
                </a>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <a href="/aptos">
                  <ArrowLeftRight className="h-6 w-6 mb-2" />
                  FOREX Swap
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
