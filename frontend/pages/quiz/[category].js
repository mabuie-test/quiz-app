// frontend/pages/quiz/[category].js
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Timer80s from '../../components/Timer80s';
import QuestionCard from '../../components/QuestionCard';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

export default function QuizPage() {
  const router = useRouter();
  const { category } = router.query;
  const { user } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [timeUpFlag, setTimeUpFlag] = useState(false);
  const [answered, setAnswered]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // 1. Se não estiver autenticado, redireciona
  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }
  }, [user]);

  // 2. Carregar perguntas só quando tivermos user/token e category
  useEffect(() => {
    if (!user || !category) return;

    setLoading(true);
    setError(null);

    api.post('/quiz/start', { categoryId: category, numQuestions: 10 })
      .then(res => {
        setQuestions(res.data);
      })
      .catch(err => {
        console.error('Erro ao carregar questões:', err.response?.status, err.response?.data);
        if (err.response?.status === 401) {
          // token inválido ou expirado
          router.replace('/login');
        } else {
          setError('Não foi possível carregar as questões.');
        }
      })
      .finally(() => setLoading(false));
  }, [user, category]);

  const handleAnswer = async (qid, idx) => {
    setAnswered(true);
    try {
      const res = await api.post('/quiz/answer', { questionId: qid, selectedOptionIndex: idx });
      return res.data;
    } catch (err) {
      console.error('Erro ao enviar resposta:', err);
      return { correct: false, explanation: 'Erro ao verificar resposta.' };
    }
  };

  const nextQuestion = () => {
    setTimeUpFlag(false);
    setAnswered(false);
    setCurrent(prev => prev + 1);
  };

  if (loading) {
    return <p className="text-center mt-10">Carregando questões…</p>;
  }
  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }
  if (current >= questions.length) {
    return <p className="text-center mt-10">Quiz concluído!</p>;
  }

  const q = questions[current];

  return (
    <div className="max-w-xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">
          Pergunta {current + 1}/{questions.length}
        </h2>
        <Timer80s onTimeUp={() => setTimeUpFlag(true)} />
      </div>

      <QuestionCard
        question={q}
        onAnswer={handleAnswer}
        timeUp={timeUpFlag}
      />

      {(timeUpFlag || answered) && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={nextQuestion}
        >
          Seguinte
        </button>
      )}
    </div>
  );
}
