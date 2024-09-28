import {useState, useEffect, useCallback} from 'react'
import {Provider, ethers} from 'ethers'

declare global {
    interface Window {
      ethereum: never; 
    }
  }
  
export const useWallet = () => {
  

    // Account State
    const [account, setAccount] = useState<string | null>(null)
    // Balance State
    const [balance, setBalance] = useState<string | null>(null)
    // Provider State ie MetaMask
    const [provider, setProvider] = useState<Provider| null>(null)
    //Network State
    const [network, setNetwork] = useState<string | null>(null)

    // Connect Wallet Method
    const connectWallet = useCallback(async () => {
        if(!window.ethereum) {
            alert('Please Install MetaMask')
            return
        }
        try{
            const provider = new ethers.BrowserProvider(window.ethereum)
            const accounts = await provider.send("eth_requestAccounts", [])
            setAccount(accounts[0])
            setProvider(provider)
        }catch(err) {
            console.error('Error Conecting to wallet', err)
        }
    }, [])

    // Wallet Balance Function
    const getBalance = useCallback(async (address:string) => {
        if (provider && ethers.isAddress(address)) {
            try{
                const balance = await provider.getBalance(address)
                setBalance(ethers.formatEther(balance))
            }catch(err) {
                console.error("Failed to fetch Balance", err)
            }
        }else{
            alert("Please enter a valid wallet address and try again.")
        }
    }, [provider])

    // Network and account change events
    useEffect(() => {
        if(provider) {
            provider.on("network", (newNetwork) => setNetwork(newNetwork.name))
            provider.on("accountsChanges", (changedAccount) => setAccount(changedAccount[0] || null))
        }
    },[provider])

    return {getBalance, connectWallet, account, balance, network}
}