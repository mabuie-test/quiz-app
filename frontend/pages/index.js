// frontend/pages/index.js
import { useState } from 'react';
import SplashScreen from '../components/SplashScreen';
import Link from 'next/link';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Bem‑vindo ao Quiz</h1>
      <p className="mb-6 text-center">
        Teste os seus conhecimentos em Ciências e Letras.
        <br/>
        Faça login para continuar.
      </p>
      <Link href="/login">
        <a className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">
          Login
        </a>
      </Link>
    </div>
  );
}
