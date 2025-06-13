// frontend/pages/quiz/index.js
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

export default function QuizHome() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    if (!user) return; // só carrega após user estar definido
    api.get('/categories')
      .then(res => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Não foi possível carregar categorias.');
        setLoading(false);
      });
  }, [user]);

  if (loading) return <p className="text-center mt-10">Carregando categorias…</p>;
  if (error)   return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (categories.length === 0) {
    return (
      <div className="text-center mt-10">
        <p>Nenhuma categoria disponível.</p>
        <p>Crie categorias no painel Admin.</p>
      </div>
    );
  }

  const grouped = categories.reduce((acc, cat) => {
    acc[cat.parentGroup] = acc[cat.parentGroup] || [];
    acc[cat.parentGroup].push(cat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8">
        Seleciona a Categoria do Quiz
      </h1>

      {Object.entries(grouped).map(([group, cats]) => (
        <section key={group} className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">{group}</h2>
          <div className="grid grid-cols-2 gap-4">
            {cats.map(cat => (
              <button
                key={cat._id}
                onClick={() => router.push(`/quiz/${cat._id}`)}
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
