'use client'

import { Star, List, User, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { WalletConnection } from "@/components/wallet-connection"

interface MobileLayoutProps {
  children: React.ReactNode
  title?: string
  showQuickActions?: boolean
  activeTab?: 'featured' | 'markets' | 'my-markets' | 'profile'
}

export function MobileLayout({ 
  children, 
  title = "Kiniela", 
  showQuickActions = false,
  activeTab = 'featured'
}: MobileLayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#1a2332] pb-20 safe-area-top">
      {/* Header - Consistent across all pages */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#1a2332] sticky top-0 z-40">
        <button 
          onClick={() => router.push('/')}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="text-2xl">🎯</span>
        </button>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        <WalletConnection />
      </header>

      {/* Main Content */}
      <main className="px-4 pt-4">
        {/* Quick Actions - Show on main pages */}
        {showQuickActions && (
          <section className="mb-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => router.push('/custom-markets')}
                className="touch-target bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Create Market
              </button>
              <button 
                onClick={() => router.push('/my-positions')}
                className="touch-target bg-purple-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-purple-500 transition-colors"
              >
                <Star className="w-4 h-4" />
                My Positions
              </button>
            </div>
          </section>
        )}

        {/* Page Content */}
        {children}
      </main>

      {/* Bottom Navigation - Consistent across all pages */}
      <nav className="mobile-nav bg-[#1a2332] border-white/10">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link href="/" className={`mobile-nav-item ${activeTab === 'featured' ? 'active text-blue-500' : 'text-gray-400 hover:text-gray-300'}`}>
            <Star className={`w-5 h-5 ${activeTab === 'featured' ? 'fill-current' : ''}`} />
            <span className="mobile-nav-label">Featured</span>
          </Link>
          <Link href="/all-markets" className={`mobile-nav-item ${activeTab === 'markets' ? 'active text-blue-500' : 'text-gray-400 hover:text-gray-300'}`}>
            <List className="w-5 h-5" />
            <span className="mobile-nav-label">All Markets</span>
          </Link>
          <Link href="/custom-markets" className={`mobile-nav-item ${activeTab === 'my-markets' ? 'active text-blue-500' : 'text-gray-400 hover:text-gray-300'}`}>
            <PlusCircle className="w-5 h-5" />
            <span className="mobile-nav-label">My Markets</span>
          </Link>
          <Link href="/profile" className={`mobile-nav-item ${activeTab === 'profile' ? 'active text-blue-500' : 'text-gray-400 hover:text-gray-300'}`}>
            <User className="w-5 h-5" />
            <span className="mobile-nav-label">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
