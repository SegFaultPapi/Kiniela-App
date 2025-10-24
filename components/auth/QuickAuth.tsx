'use client'

import { useQuickAuth } from '@/hooks/useQuickAuth'

interface QuickAuthProps {
  children: React.ReactNode
}

export function QuickAuth({ children }: QuickAuthProps) {
  const { 
    token, 
    userData, 
    isAuthenticated, 
    isLoading, 
    error, 
    signIn, 
    signOut 
  } = useQuickAuth()

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Authenticating...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">Authentication error: {error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          onClick={signIn}
        >
          Try Again
        </button>
      </div>
    )
  }

  // Not authenticated - show sign in button
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <h2 className="text-xl font-bold text-white">Welcome to Kiniela</h2>
        <p className="text-gray-400 text-center">
          Sign in with Farcaster to start betting on prediction markets
        </p>
        <button 
          onClick={signIn}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
        >
          Sign In with Farcaster
        </button>
      </div>
    )
  }

  // Authenticated - show app with user info
  return (
    <div className="min-h-screen bg-[#1a2332]">
      {/* User info bar */}
      <div className="bg-[#2a3544] px-6 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {userData?.displayName?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">
              {userData?.displayName || `FID: ${userData?.fid}`}
            </p>
            <p className="text-gray-400 text-xs">
              @{userData?.username || 'user'}
            </p>
          </div>
        </div>
        <button 
          onClick={signOut}
          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
        >
          Sign Out
        </button>
      </div>
      
      {/* App content */}
      {children}
    </div>
  )
}
