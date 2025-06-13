import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    login(email, password);
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">Login</h1>
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
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Entrar
      </button>
    </form>
  );
}
