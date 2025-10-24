'use client'

import React from 'react'

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
  return (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-yellow-800 font-bold">⚠️ MiniKit Not Available</h3>
        <p className="text-yellow-700">
          MiniKit hooks are not available in this environment. This is normal for non-Base App environments.
        </p>
        <p className="text-yellow-600 text-sm mt-2">
          In a Base App environment, you would see:
        </p>
        <ul className="text-yellow-600 text-sm mt-1 ml-4 list-disc">
          <li>Context user data for UX personalization</li>
          <li>Authenticated user data for security operations</li>
          <li>Cryptographic verification of user identity</li>
        </ul>
      </div>

      {/* Example of what would be shown in Base App */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-blue-800 font-bold">👋 Welcome Message (Example)</h3>
        <p className="text-blue-700">
          Hi there, user 12345! This is just for UX personalization.
        </p>
        <p className="text-blue-600 text-sm">
          This data comes from context and should only be used for UX hints.
        </p>
      </div>
      
      {/* Example secure dashboard */}
      <SecureUserDashboard verifiedFid={12345} />

      {/* Show authentication status */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-gray-800 font-bold">🔍 Authentication Status</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Context User:</span> Not available (MiniKit not enabled)
          </p>
          <p>
            <span className="font-medium">Authenticated User:</span> Not authenticated (MiniKit not enabled)
          </p>
          <p className="text-gray-600">
            Use context for UX, authentication for security-critical operations.
          </p>
        </div>
      </div>
    </div>
  )
}
