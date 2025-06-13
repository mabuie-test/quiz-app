import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';

export default function Register() {
  const router = useRouter();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/register', { name, email, password });
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro no registo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h1 className="text-2xl font-bold mb-4">Registo</h1>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <label className="block mb-2">
          <span className="text-gray-700">Nome</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Jorge Augusto"
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="exemplo@dominio.com"
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
        >
          Registar
        </button>
      </form>
    </div>
  );
}
