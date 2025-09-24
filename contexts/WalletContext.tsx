"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Account } from "@aptos-labs/ts-sdk";
import {
  connectWallet,
  getAccountBalance,
  clearSavedWallet,
  aptos,
} from "@/lib/aptos";

interface WalletContextType {
  account: Account | null;
  balance: number;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  createNewWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isConnected = account !== null;

  const connect = async () => {
    setIsLoading(true);
    try {
      const connectedAccount = await connectWallet();
      if (connectedAccount) {
        setAccount(connectedAccount);
        await updateBalance(connectedAccount);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setBalance(0);
  };

  const createNewWallet = async () => {
    setIsLoading(true);
    try {
      // Clear the saved wallet first
      clearSavedWallet();

      // Connect to create a new wallet
      const connectedAccount = await connectWallet();
      if (connectedAccount) {
        setAccount(connectedAccount);
        await updateBalance(connectedAccount);
      }
    } catch (error) {
      console.error("Failed to create new wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = async (accountToCheck?: Account) => {
    const accountToUse = accountToCheck || account;
    if (accountToUse) {
      try {
        console.log(
          "Updating balance for account:",
          accountToUse.accountAddress.toString()
        );
        const currentBalance = await getAccountBalance(
          accountToUse.accountAddress.toString()
        );
        console.log("Updated balance:", currentBalance);
        setBalance(currentBalance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    }
  };

  const refreshBalance = async () => {
    await updateBalance();
  };

  // Auto-refresh balance every 30 seconds when connected
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(refreshBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const value: WalletContextType = {
    account,
    balance,
    isConnected,
    isLoading,
    connect,
    disconnect,
    refreshBalance,
    createNewWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
