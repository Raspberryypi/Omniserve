import { useState, useEffect } from 'react'
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/')
    .then((response) => {
      setMessage(response.data.message);
    })
    .catch((error) => {
      setMessage('Error fetching message from server');
      console.error(error);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center  justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl  shadow-lg border-slate-700 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">Omniserve Dashboard</h1>
        <p className="text-slate-300 mb-2">Backend Connection Status</p>
        <div className="bg-slate-900 p-3 rounded border border-slate-600 text-green-400 font-mono text-sm">
          {message}
        </div>
      </div>
    </div>
  );
}

export default App;
