import React, { useState } from 'react';
import { useStudentContext } from '../contexts/StudentContext';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const { users } = useStudentContext();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmail = e => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez entrer votre email.');
      return;
    }
    if (!users.some(u => u.email === email)) {
      setError("Aucun compte n'est associé à cet email.");
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div style={{ maxWidth: 350, margin: 'auto', marginTop: 100 }}>
      <h2>Forgot Password</h2>
      {step === 1 && (
        <form onSubmit={handleEmail}>
          <label>Entrez l'adresse email associée à votre compte</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
          {error && <div className="error">{error}</div>}
          <button type="submit" style={{ width: '100%', marginTop: 16 }}>Email</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>Nous allons vous envoyer un lien pour réinitialiser votre mot de passe.</div>
          <button type="submit" style={{ width: '100%' }}>Submit</button>
        </form>
      )}
      {step === 3 && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div className="success" style={{ marginBottom: 16 }}>Check your email for a password reset link.<br />If you don't receive it within a few minutes, check your spam folder.</div>
          <button onClick={() => navigate('/login')} style={{ width: '100%' }}>Retour à la connexion</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage; 