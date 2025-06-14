// frontend/pages/admin/dashboard.js
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // se não logado ou não for admin, redireciona
    if (!user) return;
    if (user.role !== 'admin') {
      router.replace('/login');
    }
  }, [user]);

  if (!user) {
    return <p className="text-center mt-10">Carregando…</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel de Gestão (Admin)</h1>
        <button
          onClick={() => { logout(); router.push('/login'); }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </header>

      <nav className="space-y-4">
        <Link href="/admin/users">
          <a className="block px-4 py-2 bg-blue-600 text-white rounded">
            Gestão de Utilizadores
          </a>
        </Link>
        <Link href="/admin/categories">
          <a className="block px-4 py-2 bg-blue-600 text-white rounded">
            Gestão de Categorias
          </a>
        </Link>
        <Link href="/admin/questions">
          <a className="block px-4 py-2 bg-blue-600 text-white rounded">
            Gestão de Questões
          </a>
        </Link>
        <Link href="/admin/audit">
          <a className="block px-4 py-2 bg-purple-600 text-white rounded">
            Auditoria
          </a>
        </Link>
        <Link href="/quiz">
          <a className="block px-4 py-2 bg-green-600 text-white rounded">
            Jogar Quiz
          </a>
        </Link>
      </nav>
    </div>
  );
}
