import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-5xl mx-auto p-8 text-center">
      <div className="flex justify-center gap-8">
        <a href="https://vite.dev" target="_blank" className="transition-all hover:drop-shadow-[0_0_2em_#646cffaa]">
          <img src={viteLogo} className="h-24 p-6" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="transition-all hover:drop-shadow-[0_0_2em_#61dafbaa]">
          <img src={reactLogo} className="h-24 p-6 animate-[spin_20s_linear_infinite]" alt="React logo" />
        </a>
      </div>
      <h1 className="text-5xl font-bold leading-tight mb-8">React Starter Kit</h1>
      <div className="p-8">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-neutral-800 dark:bg-neutral-800 cursor-pointer transition-colors hover:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code className="font-mono bg-neutral-800/20 p-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-neutral-500 dark:text-neutral-400">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
