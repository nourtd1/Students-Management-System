import React, { useState } from 'react';
import { useStudentContext } from '../contexts/StudentContext';
import { useNavigate } from 'react-router-dom';

// Liste des programmes d'études disponibles
const PROGRAMS = [
  'Informatique',
  'Law',
  'Finance',
  'IBS'
];

// Liste des niveaux d'études disponibles
const LEVELS = [
  'Première année',
  'Deuxième année',
  'Troisième année',
  'Quatrième année',
  'Master 1',
  'Master 2'
];

// Composant de formulaire d'inscription d'un nouvel étudiant
const StudentRegistrationForm = () => {
  // Récupération des données et fonctions du contexte global
  const { addStudent } = useStudentContext();
  
  // État local pour les données du formulaire
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    matricule: '',
    email: '',
    dob: '',
    program: '',
    level: ''
  });
  
  // Hook de navigation pour les redirections
  const navigate = useNavigate();

  // Gestion des changements dans les champs du formulaire
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = e => {
    e.preventDefault();
    // Vérification que tous les champs sont remplis
    if (!form.firstName || !form.lastName || !form.matricule || !form.email || !form.dob || !form.program || !form.level) return;
    
    // Ajout du nouvel étudiant à la liste avec un ID unique
    addStudent(form);
    
    // Réinitialisation du formulaire
    setForm({ firstName: '', lastName: '', matricule: '', email: '', dob: '', program: '', level: '' });
    
    // Redirection vers la page d'édition
    setTimeout(() => {
      navigate('/edit-student');
    }, 1500);
  };

  return (
    <div className="card fade-in" style={{ maxWidth: 600, margin: '2rem auto' }}>
      <div className="card-header">
        <h2 className="card-title">Inscription Étudiant</h2>
        <i className="fa-solid fa-user-graduate" style={{ fontSize: '1.8rem', color: 'var(--primary)' }}></i>
      </div>
      
      <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              <i className="fa-solid fa-user" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
              Prénom
            </label>
            <input 
              id="firstName"
              name="firstName" 
              placeholder="Entrez le prénom" 
              value={form.firstName} 
              onChange={handleChange} 
              required 
              className="slide-in"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">
              <i className="fa-solid fa-user" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
              Nom
            </label>
            <input 
              id="lastName"
              name="lastName" 
              placeholder="Entrez le nom" 
              value={form.lastName} 
              onChange={handleChange} 
              required 
              className="slide-in"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="matricule">
              <i className="fa-solid fa-id-card" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
              Numéro de matricule
            </label>
            <input 
              id="matricule"
              name="matricule" 
              placeholder="Ex: MAT12345" 
              value={form.matricule} 
              onChange={handleChange} 
              required 
              className="slide-in"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <i className="fa-solid fa-envelope" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
              Email
            </label>
            <input 
              id="email"
              name="email" 
              type="email" 
              placeholder="exemple@email.com" 
              value={form.email} 
              onChange={handleChange} 
              required 
              className="slide-in"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="dob">
            <i className="fa-solid fa-calendar" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
            Date de naissance
          </label>
          <input 
            id="dob"
            name="dob" 
            type="date" 
            value={form.dob} 
            onChange={handleChange} 
            required 
            className="slide-in"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="program">
              <i className="fa-solid fa-book" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
              Programme d'études
            </label>
            <select 
              id="program"
              name="program" 
              value={form.program} 
              onChange={handleChange} 
              required
              className="slide-in"
            >
              <option value="">Sélectionnez un programme</option>
              {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="level">
              <i className="fa-solid fa-layer-group" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
              Niveau d'études
            </label>
            <select 
              id="level"
              name="level" 
              value={form.level} 
              onChange={handleChange} 
              required
              className="slide-in"
            >
              <option value="">Sélectionnez un niveau</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
          <button type="button" className="secondary slide-in" style={{ flex: 1 }} onClick={() => navigate('/dashboard')}>
            <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i>
            Annuler
          </button>
          
          <button type="submit" className="success slide-in" style={{ flex: 1 }}>
            <i className="fa-solid fa-user-plus" style={{ marginRight: '8px' }}></i>
            Inscrire l'étudiant
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentRegistrationForm; 