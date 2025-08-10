"use client"

import Link from "next/link";
import TableComponents from "./components/TableComponents"
import { useEffect, useState } from "react";


export default function Home() {

    type Entry = {
      id: number | string;
      table_name: string;
      [key: string]: unknown;
    };

    const [entries, setEntries] = useState<Entry[]>([])
    const [entryDetails, setEntryDetails] = useState<Record<string | number, unknown>>({})

    useEffect(() => {
      async function fetchData() {
        const res = await fetch("http://localhost:3005/recent")
        const data = await res.json()
        setEntries(data)
      }
      fetchData()
    }, [])

    useEffect(() => {
      entries.forEach((entry) => {
        if (!entryDetails[entry.id]) {
          let url = `http://localhost:3005/${entry.table_name}/${entry.id}`
          if (entry.table_name == 'beer_reviews') {
            url = `http://localhost:3005/beers/review/${entry.id}`
          }
          fetch(url)
          .then((res) => res.json())
          .then((data) => {
            setEntryDetails((prev) => ({ ...prev, [entry.id]: data}))
          })
        }
      })
    }, [entries, entryDetails])

  return (
      <main className="">
        <div className="max-w-auto mx-auto p-4 bg-yellow-300 m-5 rounded-md">
          <div className="mx-auto max-w-2xl p-20">
          <h3 className="text-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-4xl px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">登録</h3>
          <h3 className="text-center text-4xl p-4 bg-gray-400">ログイン</h3>
          </div>
        </div>
          <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Recent Entries</h1>
              {entries.length === 0 ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
            <ul className="space-y-4">
                {entries.map((entry) => {
              type TableComponentKey = keyof typeof TableComponents;
              const componentKey = entry.table_name as TableComponentKey;
              const Component = TableComponents[componentKey] || TableComponents.default;
                return (
                  <li key={entry.id}>
                  <Link href={`/${entry.table_name}/${entry.id}`}>
                  <Component entry={entryDetails[entry.id] || entry} />
                  </Link>
                  </li>
            );
          })}
        </ul>
      )}
    </div>
      </main>
  );
}
