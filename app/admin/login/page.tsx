'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminLoginPage = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const login = async () => {
        if (!password) return;
        setLoading(true);
        setError('');
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ password }),
        })
        if (res.ok) {
            router.push('/admin')
        } else {
            setError('Incorrect password.')
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg shadow p-8 w-full max-w-sm'>
                <h1 className='text-xl font-bold text-gray-900 mb-6'>Admin Login</h1>
                <input 
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && login()}
                    placeholder='Password'
                    className='w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {error && (
                    <p className='text-red-600 text-sm mb-3'>{error}</p>
                )}
                <button
                    onClick={login}
                    disabled={loading}
                    className='w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50'
                >
                    {loading ? 'Logging in...' : 'Log in'}
                </button>
            </div>
        </div>
    );
};

export default AdminLoginPage;