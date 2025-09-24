"use client";

import { useState, useEffect } from "react";
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
  ArrowLeftRight,
  TrendingUp,
  Loader2,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Wallet,
  Send,
} from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Initialize Aptos client - will be updated dynamically
let config = new AptosConfig({ network: Network.TESTNET });
let aptos = new Aptos(config);

interface SwapTransaction {
  id: string;
  hash: string;
  status: "pending" | "success" | "failed";
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  timestamp: Date;
}

// Mock exchange rates (in production, fetch from oracle or API)
const EXCHANGE_RATES: { [key: string]: number } = {
  "APT-USDC": 8.5,
  "USDC-APT": 0.1176,
  "APT-USDT": 8.45,
  "USDT-APT": 0.1183,
  "USDC-USDT": 0.999,
  "USDT-USDC": 1.001,
};

export default function AptosForexSwap() {
  const {
    account,
    connected,
    connect,
    disconnect,
    wallet,
    wallets,
    signAndSubmitTransaction,
  } = useWallet();

  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("APT");
  const [toCurrency, setToCurrency] = useState("USDC");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapHistory, setSwapHistory] = useState<SwapTransaction[]>([]);
  const [currentRate, setCurrentRate] = useState(0);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<Network>(
    Network.TESTNET
  );
  const [error, setError] = useState("");

  // Available currencies for swap
  const currencies = [
    { code: "APT", name: "Aptos", type: "crypto" },
    { code: "USDC", name: "USD Coin", type: "stablecoin" },
    { code: "USDT", name: "Tether USD", type: "stablecoin" },
  ];

  // Switch network function
  const switchNetwork = (network: Network) => {
    console.log(`🔄 Switching FOREX to ${network}`);
    setCurrentNetwork(network);

    // Update Aptos client configuration
    config = new AptosConfig({ network });
    aptos = new Aptos(config);

    // Clear previous data and fetch new balance
    setBalance(0);
    setError("");
    fetchBalance();
  };

  // Fetch balance using SDK
  const fetchBalance = async () => {
    if (!account) return;

    setIsLoadingBalance(true);
    setError("");

    try {
      const accountBalance = await aptos.getAccountResource({
        accountAddress: account.address,
        resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
      });

      const balanceValue = Number((accountBalance as any).coin.value);
      const balanceInAPT = balanceValue / 100000000;
      console.log(
        `✅ FOREX Balance: ${balanceInAPT} APT on ${currentNetwork.toUpperCase()}`
      );
      setBalance(balanceInAPT);
    } catch (sdkError: any) {
      console.log(
        `⚠️ FOREX Balance fetch failed on ${currentNetwork.toUpperCase()}:`,
        sdkError.message
      );
      setBalance(0);
      if (
        sdkError.message?.includes("resource_not_found") ||
        sdkError.status === 404
      ) {
        setError(`No APT balance found on ${currentNetwork.toUpperCase()}.`);
      }
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Auto-fetch balance when account changes
  useEffect(() => {
    if (connected && account) {
      fetchBalance();
    }
  }, [connected, account, currentNetwork]);

  // Update exchange rate when currencies change
  useEffect(() => {
    updateExchangeRate();
  }, [fromCurrency, toCurrency]);

  // Update to amount when from amount or rate changes
  useEffect(() => {
    if (fromAmount && currentRate) {
      const calculatedAmount = (parseFloat(fromAmount) * currentRate).toFixed(
        6
      );
      setToAmount(calculatedAmount);
    } else {
      setToAmount("");
    }
  }, [fromAmount, currentRate]);

  const updateExchangeRate = async () => {
    setIsLoadingRate(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const rateKey = `${fromCurrency}-${toCurrency}`;
      const rate = EXCHANGE_RATES[rateKey] || 1;

      // Add some realistic fluctuation
      const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
      const adjustedRate = rate * (1 + fluctuation);

      setCurrentRate(adjustedRate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      setCurrentRate(1);
    } finally {
      setIsLoadingRate(false);
    }
  };

  const handleSwap = async () => {
    if (!account || !fromAmount || !currentRate || !signAndSubmitTransaction)
      return;

    setIsSwapping(true);
    setError("");

    try {
      console.log(
        `🔄 Starting swap: ${fromAmount} ${fromCurrency} → ${toCurrency}`
      );

      // For now, simulate the swap with a transfer (in production, use DEX)
      // This demonstrates the transaction flow
      const swapAmount = parseFloat(fromAmount);
      const receivedAmount = swapAmount * currentRate;

      // Create a simulated swap transaction (send to self for demonstration)
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [
            account.address,
            Math.floor(swapAmount * 100000000),
          ], // Convert to octas
        },
      });

      console.log("✅ Swap transaction submitted:", response.hash);

      // Add to swap history
      const newSwap: SwapTransaction = {
        id: response.hash,
        hash: response.hash,
        status: "success",
        fromCurrency,
        toCurrency,
        fromAmount: swapAmount,
        toAmount: receivedAmount,
        rate: currentRate,
        timestamp: new Date(),
      };

      setSwapHistory([newSwap, ...swapHistory]);

      // Reset form
      setFromAmount("");
      setToAmount("");

      // Refresh balance
      fetchBalance();
    } catch (error: any) {
      console.error("Swap failed:", error);
      setError(`Swap failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsSwapping(false);
    }
  };

  const swapCurrencies = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
  };

  const getPriceImpact = () => {
    const amount = parseFloat(fromAmount);
    if (amount > 1000) return "High";
    if (amount > 100) return "Medium";
    return "Low";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "crypto":
        return "text-orange-600 bg-orange-50";
      case "stablecoin":
        return "text-green-600 bg-green-50";
      case "fiat":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Show connect wallet if not connected
  if (!connected) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Connect Wallet for FOREX Swap
            </CardTitle>
            <CardDescription>
              Connect your Aptos wallet to start swapping currencies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => wallets.length > 0 && connect(wallets[0].name)}
              className="w-full"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wallet Info & Network Switcher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              FOREX Swap - {wallet?.name}
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
                Wallet Address
              </label>
              <p className="font-mono text-sm bg-muted p-2 rounded mt-1">
                {account?.address.toString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                APT Balance
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
            </div>
          </div>

          {/* Network Switcher */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-medium mb-3">🔄 Network</h4>
            <div className="flex space-x-2">
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
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exchange Rate Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Live Exchange Rates
            </div>
            <Button variant="outline" size="sm" onClick={updateExchangeRate}>
              <RefreshCw
                className={`h-4 w-4 ${isLoadingRate ? "animate-spin" : ""}`}
              />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(EXCHANGE_RATES)
              .slice(0, 4)
              .map(([pair, rate]) => {
                const [from, to] = pair.split("-");
                return (
                  <div
                    key={pair}
                    className="text-center p-3 bg-muted rounded-lg"
                  >
                    <div className="text-sm font-medium">
                      {from}/{to}
                    </div>
                    <div className="text-lg font-bold">{rate.toFixed(4)}</div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Swap Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowLeftRight className="h-5 w-5 mr-2" />
            Currency Swap
          </CardTitle>
          <CardDescription>
            Exchange between different currencies with competitive rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Currency */}
          <div>
            <label className="text-sm font-medium mb-2 block">From</label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.000001"
                    min="0"
                  />
                </div>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              {fromCurrency && (
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getTypeColor(
                      currencies.find((c) => c.code === fromCurrency)?.type ||
                        ""
                    )}`}
                  >
                    {currencies.find((c) => c.code === fromCurrency)?.type}
                  </span>
                  {fromCurrency === "APT" && (
                    <span className="text-sm text-muted-foreground">
                      Available: {balance.toFixed(4)} APT
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={swapCurrencies}
              className="rounded-full p-2 h-8 w-8"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div>
            <label className="text-sm font-medium mb-2 block">To</label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={toAmount}
                    readOnly
                    placeholder="0.00"
                    className="bg-muted"
                  />
                </div>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              {toCurrency && (
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getTypeColor(
                      currencies.find((c) => c.code === toCurrency)?.type || ""
                    )}`}
                  >
                    {currencies.find((c) => c.code === toCurrency)?.type}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Exchange Details */}
          {fromAmount && currentRate && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Exchange Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Exchange Rate:</span>
                    <span className="font-medium">
                      1 {fromCurrency} = {currentRate.toFixed(6)} {toCurrency}
                      {isLoadingRate && (
                        <Loader2 className="h-3 w-3 inline ml-1 animate-spin" />
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price Impact:</span>
                    <span
                      className={`font-medium ${
                        getPriceImpact() === "High"
                          ? "text-red-600"
                          : getPriceImpact() === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {getPriceImpact()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Fee:</span>
                    <span className="font-medium">0.1%</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>You'll receive:</span>
                    <span>
                      ~{toAmount} {toCurrency}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warning for large amounts */}
          {parseFloat(fromAmount) > 1000 && (
            <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                Large swaps may experience higher slippage. Consider breaking
                into smaller amounts.
              </span>
            </div>
          )}

          <Button
            onClick={handleSwap}
            disabled={
              !connected ||
              !fromAmount ||
              !currentRate ||
              isSwapping ||
              balance === 0
            }
            className="w-full"
            size="lg"
          >
            {isSwapping ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Swap...
              </>
            ) : !connected ? (
              "Connect Wallet First"
            ) : balance === 0 ? (
              "Fund Account First"
            ) : !fromAmount ? (
              "Enter Amount"
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Swap {fromAmount || "0"} {fromCurrency} → {toAmount || "0"}{" "}
                {toCurrency}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Swap History */}
      {swapHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Swap History</CardTitle>
            <CardDescription>
              Your recent currency exchanges on {currentNetwork.toUpperCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {swapHistory.map((swap) => (
                <div
                  key={swap.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        swap.status === "success"
                          ? "bg-green-100"
                          : swap.status === "pending"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      <ArrowLeftRight
                        className={`h-4 w-4 ${
                          swap.status === "success"
                            ? "text-green-600"
                            : swap.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">
                        {swap.fromAmount} {swap.fromCurrency} →{" "}
                        {swap.toAmount.toFixed(6)} {swap.toCurrency}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Rate: {swap.rate.toFixed(6)} | Status: {swap.status}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {swap.hash.slice(0, 16)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {swap.timestamp.toLocaleTimeString()}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="mt-1"
                    >
                      <a
                        href={`https://explorer.aptoslabs.com/txn/${swap.hash}?network=${currentNetwork}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </a>
                    </Button>
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
