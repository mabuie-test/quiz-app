// frontend/pages/login.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(email, password);
      // redireciona após login bem‑sucedido, e.g. para /quiz
    } catch (err) {
      setError(err.response?.data?.msg || 'Credenciais inválidas.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">Login</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {/* campos email, password */}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Entrar
      </button>
    </form>
  );
}
