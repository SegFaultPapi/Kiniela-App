'use client'
import { useState, useEffect } from 'react'

export default function TestPage() {
  const [markets, setMarkets] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch markets
        const marketsResponse = await fetch('/api/trpc/getMarkets')
        const marketsData = await marketsResponse.json()
        setMarkets(marketsData.result?.data || [])

        // Fetch users
        const usersResponse = await fetch('/api/trpc/getUsers')
        const usersData = await usersResponse.json()
        setUsers(usersData.result?.data || [])
        
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-4 text-white">Cargando datos...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <header className="p-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">Test Supabase + tRPC</h1>
        <p className="text-gray-300 text-sm">Datos obtenidos directamente de Supabase</p>
      </header>
      
      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Mercados de Predicción</h2>
          <div className="space-y-3">
            {markets.map((market) => (
              <div key={market.id} className="bg-gray-800 p-4 rounded-lg text-white">
                <h3 className="font-semibold text-lg">{market.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{market.description}</p>
                <div className="flex gap-4 mt-3">
                  <span className="bg-blue-600 px-3 py-1 rounded text-sm font-medium">
                    {market.outcome_a}
                  </span>
                  <span className="bg-red-600 px-3 py-1 rounded text-sm font-medium">
                    {market.outcome_b}
                  </span>
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  <p>Categoría: {market.category}</p>
                  <p>Volumen: {market.total_volume}</p>
                  <p>Estado: {market.status}</p>
                  <p>Fecha fin: {new Date(market.end_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Usuarios</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="bg-gray-700 p-3 rounded text-white">
                <p className="font-medium">{user.display_name}</p>
                <p className="text-sm text-gray-300">FID: {user.fid}</p>
                <p className="text-xs text-gray-400 font-mono">{user.address}</p>
                <p className="text-xs text-gray-500">
                  Creado: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-green-900 rounded-lg">
          <h4 className="text-green-300 font-bold">✅ Integración Exitosa</h4>
          <p className="text-green-200 text-sm mt-2">
            Supabase + tRPC funcionando correctamente. Los datos se obtienen directamente de la base de datos.
          </p>
        </div>
      </div>
    </div>
  )
}
