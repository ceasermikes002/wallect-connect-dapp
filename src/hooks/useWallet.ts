/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Provider, ethers } from 'ethers';
import axios from 'axios';

// API endpoint for Chainlist for getting network details dynamically
const CHAINLIST_API = 'https://chainid.network/chains.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [providerName, setProviderName] = useState<string>('Unknown');

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
    // Ensure that networkData is available before trying to find a match
    if (networkData.length === 0) {
      return `Unknown Network (ID: ${chainId})`;
    }

    // Chainlist API returns chainId in decimal, so ensure we are comparing as a number
    const networkInfo = networkData.find((net) => net.chainId === chainId);
    return networkInfo ? networkInfo.name : `Unknown Network (ID: ${chainId})`;
  };

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please Install MetaMask');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setProvider(provider);

      // Detect and set the provider name
      if (window.ethereum.isMetaMask) {
        setProviderName('MetaMask');
      } else if (window.ethereum.isCoinbaseWallet) {
        setProviderName('Coinbase Wallet');
      } else {
        setProviderName('Other Wallet');
      }

      // Fetch network details
      const { chainId }: any = await provider.getNetwork();
      setNetwork(getNetworkName(Number(chainId))); // Ensure chainId is treated as a number
    } catch (err) {
      console.error('Error Connecting to wallet', err);
    }
  }, [networkData]);

  const getBalance = useCallback(
    async (address: string) => {
      if (provider && ethers.isAddress(address)) {
        try {
          const balance = await provider.getBalance(address);
          setBalance(ethers.formatEther(balance));
        } catch (err) {
          console.error('Failed to fetch Balance', err);
        }
      } else {
        alert('Please enter a valid wallet address and try again.');
      }
    },
    [provider]
  );

  useEffect(() => {
    if (provider) {
      provider.on('network', (newNetwork) => {
        const chainId = newNetwork.chainId;
        setNetwork(getNetworkName(Number(chainId))); // Convert chainId to number
      });

      provider.on('accountsChanged', (changedAccounts) => {
        setAccount(changedAccounts[0] || null);
      });

      return () => {
        provider.off('network');
        provider.off('accountsChanged');
      };
    }
  }, [provider, networkData]);

  return { getBalance, connectWallet, account, balance, network, providerName };
};
