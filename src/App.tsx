import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Header } from './common/components/Header/Header';

/**
 * Main application component that displays the Vite and React logos,
 * a counter button, and some instructional text.
 */
export const App = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto p-8 text-center">
          <div className="flex justify-center gap-8">
            <a href="https://vite.dev" target="_blank">
              <img
                src={viteLogo}
                className="h-24 p-6 transition-all hover:drop-shadow-[0_0_2em_rgba(100,108,255,0.67)]"
                alt="Vite logo"
              />
            </a>
            <a href="https://react.dev" target="_blank">
              <img
                src={reactLogo}
                className="h-24 p-6 transition-all hover:drop-shadow-[0_0_2em_rgba(97,218,251,0.67)] animate-[spin_20s_linear_infinite]"
                alt="React logo"
              />
            </a>
          </div>
          <h1 className="text-3xl font-bold my-4">Vite + React</h1>
          <div className="p-8">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-zinc-800 hover:border-blue-400 transition-colors"
            >
              count is {count}
            </button>
            <p className="mt-4">
              Edit <code className="font-mono bg-zinc-700 p-1 rounded">src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="text-zinc-400">Click on the Vite and React logos to learn more</p>
        </div>
      </main>
    </div>
  );
};

export default App;
