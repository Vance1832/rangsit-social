'use client';

import { useState } from 'react';
import BrandLogo from './BrandLogo';

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
    <form onSubmit={handleSubmit} className="glass-panel mx-auto max-w-md space-y-5 p-8">
      <div className="space-y-4">
        <BrandLogo compact />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {type === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
          {type === 'signup'
            ? 'Create your account and complete your profile to join.'
            : 'Log in to continue connecting with Rangsit Social.'}
          </p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          className="input mt-2"
          type="email"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Password</label>
        <input
          className="input mt-2"
          type="password"
          value={form.password}
          onChange={(e) => updateField('password', e.target.value)}
          required
        />
      </div>

      {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

      <button className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Please wait...' : type === 'signup' ? 'Sign up' : 'Log in'}
      </button>
    </form>
  );
}
