import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('/api/auth/register', { name, email, password });
    router.push('/login');
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">Registo</h1>
      <input
        type="text" placeholder="Nome"
        value={name} onChange={e => setName(e.target.value)}
        className="block w-full mb-3 p-2 border"
      />
      <input
        type="email" placeholder="Email"
        value={email} onChange={e => setEmail(e.target.value)}
        className="block w-full mb-3 p-2 border"
      />
      <input
        type="password" placeholder="Password"
        value={password} onChange={e => setPassword(e.target.value)}
        className="block w-full mb-3 p-2 border"
      />
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
        Registar
      </button>
    </form>
  );
}
