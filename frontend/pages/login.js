// frontend/pages/login.js
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login(email, password);
      // Redireciona consoante o papel
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/quiz');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

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
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
