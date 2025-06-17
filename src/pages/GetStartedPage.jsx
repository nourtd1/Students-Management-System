import React, { useState } from 'react';
import { useStudentContext } from '../contexts/StudentContext';
import { useNavigate } from 'react-router-dom';

const GetStartedPage = () => {
  const { users, setUsers, setIsLoggedIn } = useStudentContext();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.email || !form.password || !form.confirm) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (users.some(u => u.email === form.email)) {
      setError('Cet email existe déjà.');
      return;
    }
    setUsers([...users, { email: form.email, password: form.password, nom: '', prenom: '' }]);
    setIsLoggedIn(true);
    setSuccess('Compte créé ! Redirection...');
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  return (
    <div style={{ maxWidth: 350, margin: 'auto', marginTop: 100 }}>
      <form onSubmit={handleSubmit}>
        <h2>Get Started</h2>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Confirm Password</label>
          <input type="password" name="confirm" value={form.confirm} onChange={handleChange} required />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit" style={{ width: '100%', marginTop: 16 }}>Create Account</button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ color: '#3358e6', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>
            Already have an account? Log in
          </span>
        </div>
      </form>
    </div>
  );
};

export default GetStartedPage; 