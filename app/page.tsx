"use client";

import { useState } from "react";
import {
  Send,
  ArrowLeftRight,
  Building2,
  Wallet,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AptosRemittance from "@/components/AptosRemittance";
import AptosForexSwap from "@/components/AptosForexSwap";
import AptosDemo from "@/components/AptosDemo";
import P2PRemittance from "@/components/P2PRemittance";

export default function Home() {
  const [activeTab, setActiveTab] = useState("remittance");

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">AptosGlobePay</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <a href="/dashboard">Dashboard</a>
              </Button>
              <Button>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Global Stablecoin
            <span className="text-primary"> Remittance</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Send money globally with instant settlement and ultra-low fees.
            Powered by Aptos blockchain and stablecoins.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              <span>Instant Settlement</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure & Decentralized</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-green-500" />
              <span>Low Fees (0.1%)</span>
            </div>
          </div>
        </div>

        {/* Feature Tabs */}
        <Card className="p-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              variant={activeTab === "remittance" ? "default" : "outline"}
              onClick={() => setActiveTab("remittance")}
            >
              <Send className="h-5 w-5 mr-2" />
              P2P Remittance
            </Button>
            <Button
              variant={activeTab === "forex" ? "default" : "outline"}
              onClick={() => setActiveTab("forex")}
            >
              <ArrowLeftRight className="h-5 w-5 mr-2" />
              FOREX Swap
            </Button>
            <Button
              variant={activeTab === "payroll" ? "default" : "outline"}
              onClick={() => setActiveTab("payroll")}
            >
              <Building2 className="h-5 w-5 mr-2" />
              Payroll System
            </Button>
            <Button
              variant={activeTab === "demo" ? "default" : "outline"}
              onClick={() => setActiveTab("demo")}
            >
              <Wallet className="h-5 w-5 mr-2" />
              Aptos Demo
            </Button>
            <Button
              variant="outline"
              className="flex flex-row items-center"
              asChild
            >
              <a href="/setup" className="flex flex-row items-center">
                <Building2 className="h-5 w-5 mr-2" />
                <span>Setup </span>
              </a>
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === "remittance" && <P2PRemittance />}
          {activeTab === "forex" && <AptosForexSwap />}
          {activeTab === "payroll" && <PayrollInterface />}
          {activeTab === "demo" && <AptosDemo />}
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">AptosGlobePay</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Global stablecoin remittance platform powered by Aptos
                blockchain.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>P2P Remittance</li>
                <li>FOREX Swap</li>
                <li>Payroll System</li>
                <li>Low Fees</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Contact Us</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Security</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Audited Smart Contracts</li>
                <li>Decentralized</li>
                <li>Non-Custodial</li>
                <li>Privacy First</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2024 AptosGlobePay. All rights reserved. Built on Aptos
              blockchain.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// P2P Remittance Interface
function RemittanceInterface() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USDC");
  const [toCurrency, setToCurrency] = useState("USDT");
  const [recipient, setRecipient] = useState("");

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Send Money Globally
      </h2>

      <div className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Amount to Send
          </label>
          <div className="relative">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="pr-20"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background border rounded px-2 py-1 text-sm"
            >
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
              <option value="DAI">DAI</option>
            </select>
          </div>
        </div>

        {/* Currency Exchange */}
        <div className="flex items-center justify-center">
          <div className="bg-muted rounded-full p-2">
            <ArrowLeftRight className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        {/* Recipient Currency */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Recipient Receives
          </label>
          <div className="relative">
            <Input
              type="text"
              value={`${
                amount ? (parseFloat(amount) * 0.999).toFixed(2) : "0.00"
              }`}
              readOnly
              className="pr-20"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background border rounded px-2 py-1 text-sm"
            >
              <option value="USDT">USDT</option>
              <option value="USDC">USDC</option>
              <option value="DAI">DAI</option>
            </select>
          </div>
        </div>

        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Recipient Wallet Address
          </label>
          <Input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
          />
        </div>

        {/* Fee Information */}
        <Card className="p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Network Fee:</span>
            <span>0.1%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Cost:</span>
            <span>
              {amount
                ? `${(parseFloat(amount) * 0.001).toFixed(4)} ${fromCurrency}`
                : "0.0000"}
            </span>
          </div>
        </Card>

        {/* Send Button */}
        <Button className="w-full">
          Send {amount || "0"} {fromCurrency}
        </Button>
      </div>
    </div>
  );
}

// FOREX Swap Interface
function ForexSwapInterface() {
  const [fromAmount, setFromAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USDC");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [toAmount, setToAmount] = useState("");

  const exchangeRates = {
    "USDC-EUR": 0.92,
    "USDC-GBP": 0.79,
    "USDC-JPY": 150.0,
    "USDC-CAD": 1.35,
  };

  const rate =
    exchangeRates[
      `${fromCurrency}-${toCurrency}` as keyof typeof exchangeRates
    ] || 1;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Multi-Currency FOREX Swap
      </h2>

      <div className="space-y-6">
        {/* From Currency */}
        <div>
          <label className="block text-sm font-medium mb-2">From</label>
          <div className="relative">
            <Input
              type="number"
              value={fromAmount}
              onChange={(e) => {
                setFromAmount(e.target.value);
                setToAmount(
                  e.target.value
                    ? (parseFloat(e.target.value) * rate).toFixed(2)
                    : ""
                );
              }}
              placeholder="0.00"
              className="pr-20"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background border rounded px-2 py-1 text-sm"
            >
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
              <option value="DAI">DAI</option>
            </select>
          </div>
        </div>

        {/* Exchange Rate Display */}
        <div className="text-center">
          <Card className="p-3">
            <span className="text-sm text-muted-foreground">
              1 {fromCurrency} = {rate} {toCurrency}
            </span>
          </Card>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          <div className="relative">
            <Input type="text" value={toAmount} readOnly className="pr-20" />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background border rounded px-2 py-1 text-sm"
            >
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CAD">CAD</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <Button className="w-full">
          Swap {fromAmount || "0"} {fromCurrency} → {toAmount || "0"}{" "}
          {toCurrency}
        </Button>
      </div>
    </div>
  );
}

// Payroll Interface
function PayrollInterface() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      wallet: "0x1234...5678",
      amount: "2500",
      currency: "USDC",
    },
    {
      id: 2,
      name: "Jane Smith",
      wallet: "0x8765...4321",
      amount: "3200",
      currency: "USDC",
    },
    {
      id: 3,
      name: "Mike Johnson",
      wallet: "0xabcd...efgh",
      amount: "1800",
      currency: "USDC",
    },
  ]);

  const totalAmount = employees.reduce(
    (sum, emp) => sum + parseFloat(emp.amount),
    0
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Employee Payroll System
      </h2>

      <div className="space-y-6">
        {/* Payroll Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payroll Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {employees.length}
              </div>
              <div className="text-sm text-muted-foreground">Employees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${totalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0.1%</div>
              <div className="text-sm text-muted-foreground">Network Fee</div>
            </div>
          </div>
        </Card>

        {/* Employee List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Employee Payments</h3>
          {employees.map((employee) => (
            <Card key={employee.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {employee.wallet}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {employee.amount} {employee.currency}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Fee: {(parseFloat(employee.amount) * 0.001).toFixed(2)}{" "}
                    {employee.currency}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Batch Payment Button */}
        <div className="space-y-4">
          <Button className="w-full">
            Process Payroll ({employees.length} employees)
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href="/payroll">Open Full Payroll System</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
