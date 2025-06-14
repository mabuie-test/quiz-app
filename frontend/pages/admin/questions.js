// frontend/pages/admin/questions.js
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { useRouter } from 'next/router';

export default function AdminQuestions() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [text, setText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  // Protege rota: só admin
  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') {
      router.replace('/login');
    }
  }, [user]);

  // Carrega categorias e questões
  useEffect(() => {
    if (user?.role === 'admin') {
      Promise.all([api.get('/categories'), api.get('/questions')])
        .then(([catsRes, qsRes]) => {
          setCategories(catsRes.data);
          setQuestions(qsRes.data);
        })
        .catch(() => setError('Erro ao carregar dados.'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleAdd = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/questions', {
        text, explanation, category: categoryId, options
      });
      setQuestions(prev => [...prev, res.data]);
      // limpa form
      setText(''); setExplanation(''); setCategoryId('');
      setOptions(options.map(o => ({ text: '', isCorrect: false })));
    } catch {
      setError('Erro ao criar questão.');
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/questions/${id}`);
      setQuestions(prev => prev.filter(q => q._id !== id));
    } catch {
      setError('Erro ao eliminar questão.');
    }
  };

  if (!user || user.role !== 'admin') {
    return <p className="text-center mt-10">Acesso negado.</p>;
  }

  if (loading) return <p className="p-6">Carregando…</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestão de Questões</h1>
        <button
          onClick={() => { logout(); router.push('/login'); }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </header>

      {/* Formulário de nova questão */}
      <section className="bg-white p-4 mb-8 rounded shadow">
        <h2 className="text-xl mb-4">Adicionar Questão</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleAdd} className="space-y-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Texto da questão"
            required
            className="w-full p-2 border rounded"
          />
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
            className="p-2 border rounded"
          >
            <option value="">Selecione Categoria</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>
                {c.parentGroup} › {c.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((opt, i) => (
              <div key={i}>
                <input
                  type="text"
                  value={opt.text}
                  onChange={e => {
                    const newOpts = [...options];
                    newOpts[i].text = e.target.value;
                    setOptions(newOpts);
                  }}
                  placeholder={`Opção ${i+1}`}
                  required
                  className="w-full p-2 border rounded mb-1"
                />
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={e => {
                      const newOpts = options.map((o, idx) => ({
                        ...o,
                        isCorrect: idx === i ? e.target.checked : o.isCorrect
                      }));
                      setOptions(newOpts);
                    }}
                    className="mr-2"
                  />
                  Correcta
                </label>
              </div>
            ))}
          </div>
          <textarea
            value={explanation}
            onChange={e => setExplanation(e.target.value)}
            placeholder="Explicação (mostrada após resposta)"
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Criar Questão
          </button>
        </form>
      </section>

      {/* Lista de questões existentes */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-4">Questões Existentes</h2>
        {questions.length === 0 ? (
          <p>Nenhuma questão criada.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map(q => (
              <li
                key={q._id}
                className="p-4 border rounded flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold mb-1">{q.text}</p>
                  <p className="text-sm text-gray-600">{q.explanation}</p>
                </div>
                <button
                  onClick={() => handleDelete(q._id)}
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
