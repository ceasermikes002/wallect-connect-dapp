/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react';
import { Provider } from 'ethers';

interface WalletContextProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  balance: string | null;
  setBalance: React.Dispatch<React.SetStateAction<string | null>>;
  provider: Provider;  // The Provider type from ethers
  setProvider: React.Dispatch<React.SetStateAction<Provider|any>>;
  network: string | null;
  setNetwork: React.Dispatch<React.SetStateAction<string | null>>;
  providerName: string;
  setProviderName: React.Dispatch<React.SetStateAction<string>>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<Provider | any>();  // Using 'Provider' from ethers provider
  const [network, setNetwork] = useState<string | null>(null);
  const [providerName, setProviderName] = useState<string>('Unknown');

  return (
    <WalletContext.Provider
      value={{ account, setAccount, balance, setBalance, provider, setProvider, network, setNetwork, providerName, setProviderName }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
