'use client';
import { useEffect } from 'react';

export default function BeersError({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center text-red-500 text-lg">Failed to load breweries!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
        onClick={() => window.location.reload()} // FULL reload is needed
      >
        Try again
      </button>
    </main>
  );
}