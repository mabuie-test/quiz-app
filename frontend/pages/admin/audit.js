// frontend/pages/admin/audit.js
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { useRouter } from 'next/router';

export default function AdminAudit() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [status, setStatus]   = useState(null);

  useEffect(() => {
    if (!user) return;                // aguarda user
    if (user.role !== 'admin') {
      router.replace('/login');
      return;
    }

    api.get('/audit')
      .then(res => {
        setLogs(res.data);
        setStatus(res.status);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao chamar /audit:', err);
        setStatus(err.response?.status || '---');
        setError(err.response?.data?.msg || err.message);
        setLoading(false);
      });
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <p className="text-center mt-10">Acesso negado.</p>;
  }

  if (loading) {
    return <p className="text-center mt-10">Carregando logs…</p>;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-2">Não foi possível carregar logs.</p>
        <p className="text-sm text-gray-600">HTTP Status: {status}</p>
        <p className="text-sm text-gray-600">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Logs de Auditoria</h1>
        <button
          onClick={() => { logout(); router.push('/login'); }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </header>

      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Data/Hora</th>
            <th className="p-2">Utilizador</th>
            <th className="p-2">Ação</th>
            <th className="p-2">Recurso</th>
            <th className="p-2">ID Recurso</th>
            <th className="p-2">IP</th>
            <th className="p-2">Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id} className="border-t">
              <td className="p-2 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="p-2 text-sm">{log.user.name} ({log.user.email})</td>
              <td className="p-2 text-sm">{log.action}</td>
              <td className="p-2 text-sm">{log.resource}</td>
              <td className="p-2 text-sm">{log.resourceId}</td>
              <td className="p-2 text-sm">{log.ip}</td>
              <td className="p-2 text-sm">{JSON.stringify(log.details)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
