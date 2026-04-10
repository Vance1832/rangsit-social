'use client';

import { useState } from 'react';

export default function AuthForm({ type, onSubmit }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setError('Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-4 max-w-md mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">{type === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {type === 'signup'
            ? 'Create your account and complete your profile to join.'
            : 'Log in to continue connecting with Rangsit Social.'}
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          className="input mt-2"
          type="email"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Password</label>
        <input
          className="input mt-2"
          type="password"
          value={form.password}
          onChange={(e) => updateField('password', e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <button className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Please wait...' : type === 'signup' ? 'Sign up' : 'Log in'}
      </button>
    </form>
  );
}
