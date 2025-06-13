// frontend/pages/register.js
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
    try {
      await api.post('/auth/register', { name, email, password });
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro no registo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">Registo</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {/* campos name, email, password */}
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
        Registar
      </button>
    </form>
  );
}
