"use client"

import { useState } from "react"
import { Settings, Star, PlusCircle, User, Copy, Check, List, Bookmark } from "lucide-react"
import Link from "next/link"

export default function CustomMarketsPage() {
  const [joinCode, setJoinCode] = useState("")
  const [question, setQuestion] = useState("")
  const [category, setCategory] = useState("Politics")
  const [resolutionDate, setResolutionDate] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [copied, setCopied] = useState(false)

  const myMarkets = [
    {
      id: "1",
      title: "Will Bitcoin reach $150k in 2025?",
      category: "Crypto",
      volume: "8.5k",
      probability: 62,
      code: "ABC123",
    },
    {
      id: "2",
      title: "Next US President Democrat?",
      category: "Politics",
      volume: "15.2k",
      probability: 58,
      code: "XYZ789",
    },
    {
      id: "3",
      title: "AI surpasses human intelligence?",
      category: "Technology",
      volume: "12.1k",
      probability: 45,
      code: "DEF456",
    },
  ]

  const handleCreateMarket = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setGeneratedCode(code)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleJoinMarket = () => {
    console.log("Joining market with code:", joinCode)
  }

  return (
    <div className="min-h-screen bg-[#1a2332] pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="w-6" />
        <h1 className="text-lg font-bold text-white">Kiniela</h1>
        <button className="text-white">
          <Settings className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Custom Market</h2>
          <p className="text-gray-400 text-sm">Create your own market or join a private one.</p>
        </div>

        {myMarkets.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">My Created Markets</h3>
            <div className="space-y-3">
              {myMarkets.map((market) => (
                <MyMarketCard key={market.id} market={market} />
              ))}
            </div>
          </div>
        )}

        {/* Join a Market Section */}
        <div className="bg-[#2a3544] rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Join a Market</h3>
          <p className="text-gray-400 text-sm mb-4">Enter the private code to join an existing market.</p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="flex-1 bg-[#1a2332] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoinMarket}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Join
            </button>
          </div>
        </div>

        {/* Create a New Market Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-6">Create a New Market</h3>

          {/* Market Question */}
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">Market Question</label>
            <input
              type="text"
              placeholder="e.g., Who will win the next election?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-[#2a3544] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#2a3544] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="Politics">Politics</option>
              <option value="Economy">Economy</option>
              <option value="Technology">Technology</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Sports">Sports</option>
              <option value="Environment">Environment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Resolution Date */}
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">Resolution Date</label>
            <input
              type="date"
              value={resolutionDate}
              onChange={(e) => setResolutionDate(e.target.value)}
              className="w-full bg-[#2a3544] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Make Private Checkbox */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-[#2a3544] text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-white text-sm">Make this market private</span>
            </label>
          </div>

          {/* Fee Notice */}
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-yellow-500 text-sm">Creating a market requires a small fee.</p>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateMarket}
            className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors"
          >
            Create Market
          </button>

          {/* Generated Code Display */}
          {generatedCode && (
            <div className="mt-6 bg-green-900/30 border border-green-700/50 rounded-lg p-4">
              <p className="text-green-400 text-sm mb-2 font-medium">Market created successfully!</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#1a2332] rounded-lg px-4 py-3">
                  <p className="text-gray-400 text-xs mb-1">Invitation Code</p>
                  <p className="text-white text-xl font-bold tracking-wider">{generatedCode}</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-3">Share this code with others to invite them to your market.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a2332] border-t border-white/10 px-6 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center gap-0.5">
            <Star className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">Featured</span>
          </Link>
          <Link href="/all-markets" className="flex flex-col items-center gap-0.5">
            <List className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">All Markets</span>
          </Link>
          <button className="flex flex-col items-center gap-0.5">
            <PlusCircle className="w-5 h-5 text-blue-500 fill-blue-500" />
            <span className="text-[10px] text-blue-500 font-medium">My Markets</span>
          </button>
          <Link href="/profile" className="flex flex-col items-center gap-0.5">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

function MyMarketCard({
  market,
}: { market: { id: string; title: string; category: string; volume: string; probability: number; code: string } }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showCode, setShowCode] = useState(false)

  return (
    <div className="bg-[#2a3544] rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">{market.title}</h4>
          <p className="text-gray-400 text-xs">{market.category}</p>
        </div>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`ml-2 p-1.5 rounded-md transition-all duration-300 flex-shrink-0 ${
            isBookmarked
              ? "bg-amber-500/20 text-amber-400"
              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-gray-700"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - market.probability / 100)}`}
                className={market.probability >= 50 ? "text-green-500" : "text-red-500"}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">{market.probability}%</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs">Volume: {market.volume}</p>
        </div>
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-blue-400 text-xs font-medium hover:text-blue-300 transition-colors"
        >
          {showCode ? "Hide Code" : "Show Code"}
        </button>
      </div>

      {showCode && (
        <div className="bg-[#1a2332] rounded-lg px-3 py-2">
          <p className="text-gray-400 text-[10px] mb-1">Invitation Code</p>
          <p className="text-white text-sm font-bold tracking-wider">{market.code}</p>
        </div>
      )}
    </div>
  )
}
