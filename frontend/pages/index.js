// frontend/pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // redireciona imediatamente para /login
    router.replace('/login');
  }, []);
  return null;
}
