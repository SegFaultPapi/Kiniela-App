'use client'

import { useAuthenticate, useMiniKit } from '@coinbase/onchainkit/minikit'

interface SecureUserDashboardProps {
  verifiedFid: number
}

function SecureUserDashboard({ verifiedFid }: SecureUserDashboardProps) {
  return (
    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
      <h3 className="text-green-800 font-bold">🔒 Secure Dashboard</h3>
      <p className="text-green-700">
        This is a secure area for verified user FID: {verifiedFid}
      </p>
      <p className="text-green-600 text-sm">
        This data is cryptographically verified and safe for sensitive operations.
      </p>
    </div>
  )
}

export function SecurityExample() {
  const { user } = useAuthenticate() // For security
  const { context } = useMiniKit()   // For UX 

  return (
    <div className="space-y-4">
      {/* Safe: UX personalization with context */}
      {context.user.fid && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-blue-800 font-bold">👋 Welcome Message</h3>
          <p className="text-blue-700">
            Hi there, user {context.user.fid}! This is just for UX personalization.
          </p>
          <p className="text-blue-600 text-sm">
            This data comes from context and should only be used for UX hints.
          </p>
        </div>
      )}
      
      {/* Safe: Security with authentication */}
      {user && (
        <SecureUserDashboard verifiedFid={user.fid} />
      )}

      {/* Show authentication status */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-gray-800 font-bold">🔍 Authentication Status</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Context User:</span> {context.user.fid ? `FID ${context.user.fid}` : 'Not available'}
          </p>
          <p>
            <span className="font-medium">Authenticated User:</span> {user ? `FID ${user.fid} (Verified)` : 'Not authenticated'}
          </p>
          <p className="text-gray-600">
            Use context for UX, authentication for security-critical operations.
          </p>
        </div>
      </div>
    </div>
  )
}
