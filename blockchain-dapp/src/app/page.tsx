'use client'

import { useState, useEffect } from 'react'
import { client } from './utils/client'
import contractAbi from './abi.json'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!

export default function Home() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const readMessage = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (contractAddress === '0xYourContractAddress') {
        setError('Please update your contract address in .env.local')
        setLoading(false)
        return
      }

      const data = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractAbi,
        functionName: 'getMessage',
      })
      
      setMessage(data as string)
    } catch (err) {
      setError('Failed to read from contract. Make sure it\'s deployed and the address is correct.')
      console.error('Error reading contract:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    readMessage()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🚀 Vanderbilt Blockchain dApp
        </h1>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Smart Contract Message:
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading message from contract...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">Contract says:</p>
              <p className="text-green-700 text-lg font-mono">"{message}"</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={readMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh Message'}
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-600 text-center">
          <p>Contract Address: {contractAddress}</p>
          <p>Network: Sepolia Testnet</p>
        </div>
      </div>
    </main>
  )
}