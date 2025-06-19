import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordPage = () => {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }
    
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setMessage(result.message || 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.');
        setSubmitted(true);
      } else {
        setError(result.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la demande de réinitialisation');
    }
  };

  return (
    <div className="page-center">
      <div className="card fade-in" style={{ textAlign: 'center', maxWidth: 450 }}>
        <div className="card-header" style={{ justifyContent: 'center', borderBottom: 'none' }}>
          <div>
            <i className="fa-solid fa-key" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
            <h2 className="card-title" style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>Mot de passe oublié</h2>
            <p style={{ color: 'var(--gray-600)', fontSize: '1rem' }}>
              {!submitted 
                ? 'Entrez votre adresse email pour réinitialiser votre mot de passe' 
                : 'Vérifiez votre boîte de réception'}
            </p>
          </div>
        </div>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ boxShadow: 'none', padding: '1.5rem 2rem 2rem', border: 'none' }}>
            <div className="form-group">
              <label htmlFor="email">
                <i className="fa-solid fa-envelope" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                Email
              </label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Entrez votre email"
                required 
                className="slide-in"
                disabled={loading}
              />
            </div>
            
            {error && <div className="error slide-in">{error}</div>}
            {message && <div className="success slide-in">{message}</div>}
            
            <button type="submit" className="slide-in" disabled={loading}>
              {loading ? (
                <span><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Envoi en cours...</span>
              ) : (
                <span><i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }}></i>Envoyer le lien</span>
              )}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link 
                to="/login" 
                style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: '500' }}
                className="slide-in"
              >
                Retour à la connexion
              </Link>
            </div>
        </form>
        ) : (
          <div style={{ padding: '1.5rem 2rem 2rem' }}>
            <div className="success-icon">
              <i className="fa-solid fa-check-circle" style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '1rem' }}></i>
            </div>
            
            <div className="success slide-in" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
              {message}
            </div>
            
            <p className="slide-in" style={{ marginBottom: '1.5rem', color: 'var(--gray-600)' }}>
              Si vous ne recevez pas d'email dans les prochaines minutes, vérifiez votre dossier de spam ou essayez à nouveau.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => {
                  setEmail('');
                  setSubmitted(false);
                  setMessage('');
                }} 
                className="secondary slide-in"
              >
                <i className="fa-solid fa-rotate" style={{ marginRight: '8px' }}></i>
                Essayer à nouveau
              </button>
              
              <Link to="/login" className="button slide-in">
                <i className="fa-solid fa-sign-in" style={{ marginRight: '8px' }}></i>
                Retour à la connexion
              </Link>
            </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 