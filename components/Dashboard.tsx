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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Send,
  ArrowLeftRight,
  Building2,
  Wallet,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Navigation from "./Navigation";

interface Transaction {
  id: string;
  type: "send" | "receive" | "swap";
  amount: string;
  currency: string;
  recipient?: string;
  status: "pending" | "completed" | "failed";
  timestamp: string;
}

export default function Dashboard() {
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "send",
      amount: "500",
      currency: "USDC",
      recipient: "0x1234...5678",
      status: "completed",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "swap",
      amount: "1000",
      currency: "USDC → EUR",
      status: "completed",
      timestamp: "1 day ago",
    },
    {
      id: "3",
      type: "receive",
      amount: "2500",
      currency: "USDC",
      status: "completed",
      timestamp: "3 days ago",
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <Send className="h-4 w-4 text-red-500" />;
      case "receive":
        return <Send className="h-4 w-4 text-green-500 rotate-180" />;
      case "swap":
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="dashboard" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your global payments and track your transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450.00</div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,250.00</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transactions
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Fee</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.1%</div>
              <p className="text-xs text-muted-foreground">
                -90% vs traditional
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Send</CardTitle>
              <CardDescription>
                Send money instantly to any wallet address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input placeholder="0.00" />
              </div>
              <div>
                <label className="text-sm font-medium">Recipient Address</label>
                <Input placeholder="0x..." />
              </div>
              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currency Swap</CardTitle>
              <CardDescription>
                Exchange between different currencies instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">From</label>
                <Input placeholder="USDC" />
              </div>
              <div>
                <label className="text-sm font-medium">To</label>
                <Input placeholder="EUR" />
              </div>
              <Button className="w-full">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Swap Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <div className="font-medium">
                        {transaction.type === "send" && "Sent"}
                        {transaction.type === "receive" && "Received"}
                        {transaction.type === "swap" && "Swapped"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.amount} {transaction.currency}
                        {transaction.recipient && (
                          <span className="ml-2">
                            to {transaction.recipient}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    <span className="text-sm text-muted-foreground">
                      {transaction.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
