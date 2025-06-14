import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { useRouter } from 'next/router';

export default function Auditoria() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    } else {
      api.get('/auditoria').then(res => setLogs(res.data)).catch(() => {
        alert("Erro ao carregar logs.");
      });
    }
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Registos de Auditoria</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-4 py-2 border">Usuário</th>
              <th className="px-4 py-2 border">Ação</th>
              <th className="px-4 py-2 border">IP</th>
              <th className="px-4 py-2 border">Data</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="text-sm text-gray-700">
                <td className="px-4 py-2 border">{log.user?.name || 'Sistema'}</td>
                <td className="px-4 py-2 border">{log.acao}</td>
                <td className="px-4 py-2 border">{log.ip}</td>
                <td className="px-4 py-2 border">
                  {new Date(log.data).toLocaleString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4">Nenhum registo encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
