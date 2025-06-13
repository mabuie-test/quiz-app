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
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-4">Bem‑vindo ao Quiz</h1>
      <p className="mb-6 text-center">
        Teste os seus conhecimentos em Ciências e Letras.  
        Escolha “Login” ou “Registo” para começar.
      </p>
      <div className="space-x-4">
        <Link href="/login">
          <a className="px-4 py-2 bg-blue-600 text-white rounded">Login</a>
        </Link>
        <Link href="/register">
          <a className="px-4 py-2 bg-green-600 text-white rounded">Registo</a>
        </Link>
      </div>
    </div>
  );
}
