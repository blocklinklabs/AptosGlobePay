"use client";

import { Globe, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage = "home" }: NavigationProps) {
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
            {currentPage !== "payroll" && (
              <Button variant="ghost" asChild>
                <a href="/payroll">Payroll</a>
              </Button>
            )}
            {currentPage !== "setup" && (
              <Button variant="ghost" asChild>
                <a href="/setup">Setup</a>
              </Button>
            )}
            <Button>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
