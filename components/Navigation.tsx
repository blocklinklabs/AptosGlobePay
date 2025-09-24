"use client";

import { Globe, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage = "home" }: NavigationProps) {
  const { connected, connect, disconnect, account, wallets } = useWallet();

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">AptosGlobePay</span>
          </div>
          <div className="flex items-center space-x-4">
            {currentPage !== "home" && (
              <Button variant="ghost" asChild>
                <a href="/">Home</a>
              </Button>
            )}
            {currentPage !== "dashboard" && (
              <Button variant="ghost" asChild>
                <a href="/dashboard">Dashboard</a>
              </Button>
            )}
            {currentPage !== "remittance" && (
              <Button variant="ghost" asChild>
                <a href="/remittance">Remittance</a>
              </Button>
            )}
            {currentPage !== "payroll" && (
              <Button variant="ghost" asChild>
                <a href="/payroll">Payroll</a>
              </Button>
            )}
            {currentPage !== "aptos" && (
              <Button variant="ghost" asChild>
                <a href="/aptos">Aptos DeFi</a>
              </Button>
            )}
            {currentPage !== "setup" && (
              <Button variant="ghost" asChild>
                <a href="/setup">Setup</a>
              </Button>
            )}
            {connected && account ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  {account.address.toString().slice(0, 6)}...
                  {account.address.toString().slice(-4)}
                </span>
                <Button variant="outline" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => wallets.length > 0 && connect(wallets[0].name)}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
