/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { useWalletContext } from '../WalletContext';
import { Network } from 'ethers';

// API endpoint for Chainlist to get network details dynamically
const CHAINLIST_API = 'https://chainid.network/chains.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const { account, setAccount, balance, setBalance, provider, setProvider, network, setNetwork, providerName, setProviderName } = useWalletContext();
  const [networkData, setNetworkData] = useState<any[]>([]);

  // Fetch network data from Chainlist
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const { data } = await axios.get(CHAINLIST_API);
        setNetworkData(data);
      } catch (err) {
        console.error('Failed to fetch network data', err);
      }
    };
    fetchNetworkData();
  }, []);

  const getNetworkName = (chainId: number): string => {
    if (networkData.length === 0) {
      return `Unknown Network (ID: ${chainId})`;
    }
    const networkInfo = networkData.find((net) => net.chainId === chainId);
    return networkInfo ? networkInfo.name : `Unknown Network (ID: ${chainId})`;
  };

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please Install a wallet provider');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setProvider(provider);

      if (window.ethereum.isMetaMask) {
        setProviderName('MetaMask');
      } else if (window.ethereum.isCoinbaseWallet) {
        setProviderName('Coinbase Wallet');
      } else {
        setProviderName('Other Wallet');
      }

      const { chainId }: Network = await provider.getNetwork();
      setNetwork(getNetworkName(Number(chainId)));
    } catch (err) {
      console.error('Error connecting to wallet', err);
    }
  }, [networkData, setAccount, setProvider, setNetwork, setProviderName]);

  const getBalance = useCallback(
    async (address: string) => {
      if (provider && ethers.isAddress(address)) {
        try {
          const balance = await provider.getBalance(address);
          setBalance(ethers.formatEther(balance));
        } catch (err) {
          console.error('Failed to fetch balance', err);
        }
      } else {
        alert('Please enter a valid wallet address and try again.');
      }
    },
    [provider, setBalance]
  );

  useEffect(() => {
    if (provider) {
      const handleChainChanged = (chainId: string) => {
        setNetwork(getNetworkName(Number(chainId)));
      };

      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      };

      const walletProvider = window.ethereum
      
      walletProvider.on('chainChanged', handleChainChanged);
      walletProvider.on('accountsChanged', handleAccountsChanged);

      return () => {
        walletProvider.removeListener('chainChanged', handleChainChanged);
        walletProvider.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [provider, networkData, setNetwork, setAccount]);

  return { connectWallet, getBalance, account, balance, network, providerName };
};
