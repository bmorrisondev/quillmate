"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase"
import { useUser } from "@clerk/nextjs"

interface Item {
  id: number
  name: string
  description: string
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([])
  const { isSignedIn } = useUser()
  const supabase = createClient()

  useEffect(() => {
    const fetchItems = async () => {
      if (!isSignedIn) return

      const { data, error } = await supabase.from("items").select("*")

      if (error) {
        console.error("Error fetching items:", error)
      } else {
        setItems(data || [])
      }
    }

    fetchItems()
  }, [isSignedIn])

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-bold mb-4">Items from Supabase</h2>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="border p-2 rounded">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

