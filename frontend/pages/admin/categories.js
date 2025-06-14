// frontend/pages/admin/categories.js
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { useRouter } from 'next/router';

export default function AdminCategories() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const [cats, setCats]           = useState([]);
  const [name, setName]           = useState('');
  const [parentGroup, setParentGroup] = useState('Ciências');
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(true);

  // Protege rota: só admin
  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') {
      router.replace('/login');
    }
  }, [user]);

  // Carrega categorias
  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/categories')
        .then(res => setCats(res.data))
        .catch(() => setError('Não foi possível carregar categorias.'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleAdd = async e => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Insira um nome de categoria.');
      return;
    }
    try {
      const res = await api.post('/categories', { name, parentGroup });
      setCats(prev => [...prev, res.data]);
      setName('');
    } catch {
      setError('Erro ao criar categoria.');
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/categories/${id}`);
      setCats(prev => prev.filter(c => c._id !== id));
    } catch {
      setError('Erro ao eliminar categoria.');
    }
  };

  if (!user || user.role !== 'admin') {
    return <p className="text-center mt-10">Acesso negado.</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestão de Categorias</h1>
        <button
          onClick={() => { logout(); router.push('/login'); }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </header>

      <section className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-3">Adicionar Nova Categoria</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2">
          <select
            value={parentGroup}
            onChange={e => setParentGroup(e.target.value)}
            className="p-2 border rounded"
          >
            <option>Ciências</option>
            <option>Letras</option>
          </select>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nome da subcategoria"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Criar
          </button>
        </form>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-3">Categorias Existentes</h2>
        {loading ? (
          <p>Carregando…</p>
        ) : cats.length === 0 ? (
          <p>Nenhuma categoria encontrada.</p>
        ) : (
          <ul className="space-y-2">
            {cats.map(c => (
              <li
                key={c._id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <span>{c.parentGroup} › {c.name}</span>
                <button
                  onClick={() => handleDelete(c._id)}
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
