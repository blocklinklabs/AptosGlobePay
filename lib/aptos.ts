import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
  AccountAddress,
  SimpleTransaction,
} from "@aptos-labs/ts-sdk";

// Aptos configuration
const config = new AptosConfig({
  network: Network.TESTNET, // Use testnet for development
});

export const aptos = new Aptos(config);

// Supported stablecoins on Aptos (testnet addresses)
export const STABLECOINS = {
  USDC: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
  USDT: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
  // For demo purposes, we'll use APT as our base currency
  APT: "0x1::aptos_coin::AptosCoin",
};

// Exchange rates (mock data - in production this would come from an oracle)
export const EXCHANGE_RATES = {
  "APT-USDC": 8.5,
  "APT-USDT": 8.52,
  "USDC-USDT": 1.001,
  "USDT-USDC": 0.999,
  "APT-EUR": 7.82,
  "APT-GBP": 6.73,
  "APT-JPY": 1275.0,
  "APT-CAD": 11.48,
};

// Utility functions
export const createAccount = async (): Promise<Account> => {
  return Account.generate();
};

export const getAccountBalance = async (
  accountAddress: string,
  coinType: string = STABLECOINS.APT
): Promise<number> => {
  try {
    console.log("🔍 Fetching balance for:", accountAddress);
    console.log("💰 Coin type:", coinType);

    // First check if account exists
    try {
      const accountInfo = await aptos.getAccountInfo({
        accountAddress: accountAddress,
      });
      console.log("📋 Account info:", accountInfo);
    } catch (error) {
      console.log("❌ Account not found or not initialized:", error);
      return 0;
    }

    const resources = await aptos.getAccountResources({
      accountAddress: accountAddress,
    });

    console.log("📦 Account resources count:", resources.length);
    console.log("📦 Account resources:", resources);

    // If no resources, account might not be initialized
    if (resources.length === 0) {
      console.log("⚠️ Account has no resources - not initialized yet");
      console.log(
        "This is normal for new accounts. The first transaction (like from faucet) will initialize the account."
      );
      return 0;
    }

    // Log all resource types for debugging
    console.log("🔍 Available resource types:");
    resources.forEach((resource, index) => {
      console.log(`  ${index}: ${resource.type}`);
    });

    const coinStoreType = `0x1::coin::CoinStore<${coinType}>`;

    const coinResource = resources.find(
      (resource) => resource.type === coinStoreType
    );

    console.log("🎯 Looking for coin store type:", coinStoreType);
    console.log("🎯 Found coin resource:", !!coinResource);

    if (coinResource) {
      const balance = (coinResource.data as any).coin.value;
      const balanceInAPT = parseInt(balance) / 100000000; // Convert from octas to APT
      console.log("✅ Raw balance:", balance, "Balance in APT:", balanceInAPT);
      return balanceInAPT;
    }

    console.log("❌ No coin resource found for type:", coinType);

    // Try to find any APT-related resources
    const aptResources = resources.filter(
      (resource) =>
        resource.type.includes("AptosCoin") ||
        resource.type.includes("0x1::coin::CoinStore")
    );
    console.log("🔍 APT-related resources found:", aptResources);

    return 0;
  } catch (error) {
    console.error("💥 Error fetching balance:", error);
    return 0;
  }
};

export const fundAccount = async (
  accountAddress: string,
  amount: number = 100000000 // 1 APT in octas
): Promise<void> => {
  try {
    // Note: Programmatic funding is no longer available on testnet
    // Users must use the official faucet at https://aptos.dev/network/faucet
    console.log(
      `Account ${accountAddress} needs to be funded via the official faucet`
    );
    console.log(`Please visit: https://aptos.dev/network/faucet`);
    console.log(`Enter address: ${accountAddress}`);

    // Return success to not break the flow, but user needs to fund manually
    return;
  } catch (error) {
    console.error("Error funding account:", error);
    throw error;
  }
};

// P2P Transfer function
export const transferCoins = async (
  senderAccount: Account,
  recipientAddress: string,
  amount: number,
  coinType: string = STABLECOINS.APT
): Promise<string> => {
  try {
    const transaction = await aptos.transaction.build.simple({
      sender: senderAccount.accountAddress,
      data: {
        function: "0x1::coin::transfer",
        typeArguments: [coinType],
        functionArguments: [recipientAddress, amount * 100000000], // Convert to octas
      },
    });

    const senderAuthenticator = aptos.transaction.sign({
      signer: senderAccount,
      transaction,
    });

    const pendingTransaction = await aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator,
    });

    await aptos.waitForTransaction({
      transactionHash: pendingTransaction.hash,
    });

    console.log(`Transfer completed: ${pendingTransaction.hash}`);
    return pendingTransaction.hash;
  } catch (error) {
    console.error("Error in transfer:", error);
    throw error;
  }
};

// FOREX Swap function (simplified - in production would use DEX)
export const swapCoins = async (
  senderAccount: Account,
  fromCoinType: string,
  toCoinType: string,
  amount: number
): Promise<{
  txHash: string;
  exchangeRate: number;
  receivedAmount: number;
}> => {
  try {
    // Get exchange rate
    const rateKey = `${fromCoinType}-${toCoinType}`;
    const exchangeRate = (EXCHANGE_RATES as any)[rateKey] || 1;
    const receivedAmount = amount * exchangeRate;

    // For demo purposes, we'll simulate a swap by doing two transfers
    // In production, this would interact with a DEX like PancakeSwap on Aptos

    console.log(
      `Simulating swap: ${amount} ${fromCoinType} -> ${receivedAmount} ${toCoinType}`
    );
    console.log(`Exchange rate: ${exchangeRate}`);

    // Return mock transaction hash for demo
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    return {
      txHash: mockTxHash,
      exchangeRate,
      receivedAmount,
    };
  } catch (error) {
    console.error("Error in swap:", error);
    throw error;
  }
};

// Batch transfer for payroll
export const batchTransfer = async (
  senderAccount: Account,
  recipients: Array<{ address: string; amount: number }>,
  coinType: string = STABLECOINS.APT
): Promise<string[]> => {
  const txHashes: string[] = [];

  try {
    for (const recipient of recipients) {
      const txHash = await transferCoins(
        senderAccount,
        recipient.address,
        recipient.amount,
        coinType
      );
      txHashes.push(txHash);
    }

    return txHashes;
  } catch (error) {
    console.error("Error in batch transfer:", error);
    throw error;
  }
};

// Get transaction details
export const getTransactionDetails = async (txHash: string) => {
  try {
    const transaction = await aptos.getTransactionByHash({
      transactionHash: txHash,
    });
    return transaction;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }
};

// Wallet connection utilities
export const connectWallet = async (): Promise<Account | null> => {
  try {
    // Check if we have a saved account in localStorage
    const savedAccountData = localStorage.getItem("aptos-wallet-account");

    if (savedAccountData) {
      try {
        // Restore the saved account
        const accountData = JSON.parse(savedAccountData);
        const privateKey = new Ed25519PrivateKey(accountData.privateKey);
        const account = Account.fromPrivateKey({ privateKey });

        console.log(
          "Restored existing account:",
          account.accountAddress.toString()
        );
        return account;
      } catch (error) {
        console.error("Error restoring saved account:", error);
        // Clear invalid saved data
        localStorage.removeItem("aptos-wallet-account");
      }
    }

    // Create a new account only if no saved account exists
    const account = Account.generate();

    // Save the account data to localStorage
    const accountData = {
      privateKey: account.privateKey.toString(),
      address: account.accountAddress.toString(),
    };
    localStorage.setItem("aptos-wallet-account", JSON.stringify(accountData));

    console.log(
      "New account created and saved:",
      account.accountAddress.toString()
    );
    console.log(
      "Please fund this account at: https://aptos.dev/network/faucet"
    );

    return account;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
  }
};

// Check if account has been funded
export const checkAccountStatus = async (
  accountAddress: string
): Promise<{
  exists: boolean;
  hasResources: boolean;
  balance: number;
  isInitialized: boolean;
  sequenceNumber: string;
}> => {
  try {
    // Check if account exists
    const accountInfo = await aptos.getAccountInfo({
      accountAddress: accountAddress,
    });

    // Check resources
    const resources = await aptos.getAccountResources({
      accountAddress: accountAddress,
    });

    const balance = await getAccountBalance(accountAddress);

    return {
      exists: !!accountInfo,
      hasResources: resources.length > 0,
      balance: balance,
      isInitialized: resources.length > 0,
      sequenceNumber: accountInfo?.sequence_number || "0",
    };
  } catch (error) {
    console.error("Error checking account status:", error);
    return {
      exists: false,
      hasResources: false,
      balance: 0,
      isInitialized: false,
      sequenceNumber: "0",
    };
  }
};

// Check if faucet transaction has been processed
export const checkFaucetStatus = async (
  accountAddress: string
): Promise<{
  hasTransactions: boolean;
  transactionCount: number;
  lastTransactionHash?: string;
}> => {
  try {
    const transactions = await aptos.getAccountTransactions({
      accountAddress: accountAddress,
    });

    return {
      hasTransactions: transactions.length > 0,
      transactionCount: transactions.length,
      lastTransactionHash: transactions[0]?.hash,
    };
  } catch (error) {
    console.error("Error checking faucet status:", error);
    return {
      hasTransactions: false,
      transactionCount: 0,
    };
  }
};

// Alternative balance check using different approach
export const getBalanceAlternative = async (
  accountAddress: string
): Promise<number> => {
  try {
    console.log("🔄 Alternative balance check for:", accountAddress);

    // Try using the REST API directly
    const response = await fetch(
      `https://fullnode.testnet.aptoslabs.com/v1/accounts/${accountAddress}/resource/0x1::coin::CoinStore%3C0x1::aptos_coin::AptosCoin%3E`
    );

    if (response.ok) {
      const data = await response.json();
      console.log("🌐 REST API response:", data);

      if (data?.data?.coin?.value) {
        const balance = parseInt(data.data.coin.value) / 100000000;
        console.log("✅ Alternative balance found:", balance, "APT");
        return balance;
      }
    } else {
      console.log("❌ REST API response not OK:", response.status);
    }

    return 0;
  } catch (error) {
    console.error("💥 Alternative balance check failed:", error);
    return 0;
  }
};

// Clear saved wallet
export const clearSavedWallet = (): void => {
  localStorage.removeItem("aptos-wallet-account");
  console.log("Saved wallet cleared");
};

export default aptos;
