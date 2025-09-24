"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send, ArrowLeftRight, Building2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import AptosRemittance from "@/components/AptosRemittance";
import AptosForexSwap from "@/components/AptosForexSwap";

export default function AptosPage() {
  const [activeTab, setActiveTab] = useState("remittance");

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="aptos" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Aptos-Powered
            <span className="text-primary"> Finance</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience the future of decentralized finance with instant P2P
            transfers and FOREX swaps on the Aptos blockchain.
          </p>
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
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in-up">
            {activeTab === "remittance" && <AptosRemittance />}
            {activeTab === "forex" && <AptosForexSwap />}
          </div>
        </Card>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="h-5 w-5 mr-2 text-blue-500" />
                Instant Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Send APT and other tokens instantly to any Aptos wallet address
                with sub-second finality and minimal fees.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowLeftRight className="h-5 w-5 mr-2 text-green-500" />
                DEX Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access competitive exchange rates through integrated DEX
                protocols for seamless currency swapping.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-purple-500" />
                Enterprise Ready
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Built for scale with batch transactions, multi-sig support, and
                enterprise-grade security features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
