// frontend/pages/admin/users.js
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { useRouter } from 'next/router';

export default function AdminUsers() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Protege rota: só admin
  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') {
      router.replace('/login');
    }
  }, [user]);

  // Carrega utilizadores
  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/users')
        .then(res => setUsers(res.data))
        .catch(() => setError('Não foi possível carregar utilizadores.'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleDelete = async id => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch {
      setError('Erro ao eliminar utilizador.');
    }
  };

  if (!user || user.role !== 'admin') {
    return <p className="text-center mt-10">Acesso negado.</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestão de Utilizadores</h1>
        <button
          onClick={() => { logout(); router.push('/login'); }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </header>

      {loading ? (
        <p>Carregando utilizadores…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <ul className="space-y-4">
          {users.map(u => (
            <li key={u._id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <p><strong>{u.name}</strong> ({u.email})</p>
                <p className="text-sm text-gray-600">Role: {u.role}</p>
              </div>
              <button
                onClick={() => handleDelete(u._id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
