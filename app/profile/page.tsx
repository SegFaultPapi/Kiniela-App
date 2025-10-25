'use client'

import { MobileLayout } from "@/components/MobileLayout"
import { User, Settings, Bell, HelpCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Profile() {
  const router = useRouter()
  
  return (
    <MobileLayout title="Profile" activeTab="profile">
      {/* User Info Section */}
      <section className="mb-6">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Base User</h3>
              <p className="text-sm text-gray-400">0x1234...5678</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-400">Base Account Connected</span>
              </div>
            </div>
          </div>
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
          onClick={() => alert('Wallet disconnection functionality coming soon!')}
          className="w-full touch-target bg-red-600 text-white rounded-lg p-4 flex items-center justify-center gap-3 hover:bg-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Disconnect Wallet</span>
        </button>
      </section>
    </MobileLayout>
  )
}