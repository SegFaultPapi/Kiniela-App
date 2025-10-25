'use client'

import { MobileLayout } from "@/components/MobileLayout"
import { User, Settings, Bell, HelpCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAccount, useDisconnect } from "wagmi"
import { Avatar, Name, Address, Identity } from "@coinbase/onchainkit/identity"

export default function Profile() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // Si no está conectado, mostrar mensaje
  if (!isConnected) {
    return (
      <MobileLayout title="Profile" activeTab="profile">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Wallet Connected</h3>
          <p className="text-gray-400 mb-6">Connect your wallet to view your profile</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Home
          </button>
        </div>
      </MobileLayout>
    )
  }
  
  return (
    <MobileLayout title="Profile" activeTab="profile">
      {/* User Info Section - REAL DATA */}
      <section className="mb-6">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <Identity address={address} className="flex items-center gap-4">
            <Avatar className="w-16 h-16" />
            <div className="flex-1">
              <Name className="text-lg font-semibold text-white" />
              <Address className="text-sm text-gray-400" />
              {isConnected && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Wallet Connected</span>
                </div>
              )}
            </div>
          </Identity>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Your Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">24</div>
            <div className="text-sm text-gray-400">Predictions</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-sm text-gray-400">Markets Created</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">75%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">1,250</div>
            <div className="text-sm text-gray-400">Points</div>
          </div>
        </div>
      </section>

      {/* Settings Section */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Settings</h3>
        <div className="space-y-2">
          <button 
            onClick={() => alert('Settings functionality coming soon!')}
            className="w-full touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-white">General Settings</span>
            </div>
            <div className="text-gray-400">›</div>
          </button>
          
          <button 
            onClick={() => alert('Notifications functionality coming soon!')}
            className="w-full touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="text-white">Notifications</span>
            </div>
            <div className="text-gray-400">›</div>
          </button>
          
          <button 
            onClick={() => alert('Help & Support functionality coming soon!')}
            className="w-full touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <span className="text-white">Help & Support</span>
            </div>
            <div className="text-gray-400">›</div>
          </button>
        </div>
      </section>

      {/* Logout Section */}
      <section className="mb-6">
        <button 
          onClick={() => {
            disconnect()
            router.push('/')
          }}
          className="w-full touch-target bg-red-600 text-white rounded-lg p-4 flex items-center justify-center gap-3 hover:bg-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Disconnect Wallet</span>
        </button>
      </section>
    </MobileLayout>
  )
}