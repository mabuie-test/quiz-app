// frontend/pages/quiz/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/api';

export default function QuizHome() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Carrega categorias do back‑end
    api.get('/categories')
       .then(res => setCategories(res.data))
       .catch(err => console.error('Erro a carregar categorias:', err));
  }, []);

  // Agrupa por parentGroup
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
