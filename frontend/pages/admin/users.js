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

  // Estados de criação
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]       = useState('player');
  const [createError, setCreateError] = useState(null);

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

  // Criação
  const handleCreate = async e => {
    e.preventDefault();
    setCreateError(null);
    try {
      const res = await api.post('/users', { name, email, password, role });
      setUsers(prev => [...prev, res.data]);
      setName(''); setEmail(''); setPassword(''); setRole('player');
    } catch (err) {
      setCreateError(err.response?.data?.msg || 'Erro ao criar utilizador.');
    }
  };

  // Eliminação
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

      {/* Formulário de Criação */}
      <section className="bg-white p-4 mb-8 rounded shadow">
        <h2 className="text-xl mb-4">Criar Novo Utilizador</h2>
        {createError && <p className="text-red-600 mb-2">{createError}</p>}
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text" placeholder="Nome"
            value={name} onChange={e => setName(e.target.value)}
            required className="p-2 border rounded"
          />
          <input
            type="email" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)}
            required className="p-2 border rounded"
          />
          <input
            type="password" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)}
            required className="p-2 border rounded"
          />
          <select
            value={role} onChange={e => setRole(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="player">Player</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Criar
          </button>
        </form>
      </section>

      {/* Listagem */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-4">Utilizadores Existentes</h2>
        {loading ? (
          <p>Carregando utilizadores…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <ul className="space-y-4">
            {users.map(u => (
              <li key={u._id} className="p-4 bg-gray-50 rounded flex justify-between items-center">
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
      </section>
    </div>
  );
}
