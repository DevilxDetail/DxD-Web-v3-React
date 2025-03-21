import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function SupabaseExample() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Replace 'your_table' with your actual table name
        const { data, error } = await supabase
          .from('your_table')
          .select('*')
        
        if (error) throw error
        
        setData(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Data from Supabase</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
} 