import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-950 p-8 text-neutral-100">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-300">
          Vite
        </span>
        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm font-medium text-cyan-300">
          React
        </span>
        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-300">
          TypeScript
        </span>
        <span className="rounded-full bg-teal-500/20 px-3 py-1 text-sm font-medium text-teal-300">
          Tailwind
        </span>
      </div>

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Проект готов
      </h1>
      <p className="max-w-md text-center text-neutral-400">
        Редактируйте <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-sm text-indigo-300">src/App.tsx</code> —
        изменения появятся мгновенно благодаря HMR.
      </p>

      <button
        onClick={() => setCount((c) => c + 1)}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium transition hover:bg-indigo-500 active:scale-95"
      >
        Счётчик: {count}
      </button>
    </main>
  )
}

export default App
