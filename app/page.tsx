"use client"

import TableComponents from "./components/TableComponents"
import { useEffect, useState } from "react";


export default function Home() {

    const [entries, setEntries] = useState([])
    const [entryDetails, setEntryDetails] = useState({})

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
          fetch(`http://localhost:3005/${entry.table_name}/${entry.id}`)
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
              const Component = TableComponents[entry.table_name] || TableComponents.default;
                return (
                  <li key={entry.id}>
                  <Component entry={entryDetails[entry.id] || entry} />
                  </li>
            );
          })}
        </ul>
      )}
    </div>
      </main>
  );
}
