import React, { useState } from 'react';
import { useStudentContext } from '../contexts/StudentContext';

// Liste des matières disponibles
const SUBJECTS = [
  'Mathématiques',
  'Physique',
  'Chimie',
  'Informatique',
  'Anglais',
  'Économie',
  'Droit',
  'Management'
];

const AddResultForm = () => {
  // Récupération des données et fonctions du contexte global
  const { students, addResult } = useStudentContext();

  // État local pour les données du formulaire
  const [form, setForm] = useState({
    studentId: '',
    subject: '',
    score: ''
  });

  // Gestion des changements dans les champs du formulaire
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = e => {
    e.preventDefault();
    // Vérification que tous les champs sont remplis
    if (!form.studentId || !form.subject || !form.score) return;

    // Ajout du nouveau résultat
    addResult(form);

    // Réinitialisation du formulaire
    setForm({ studentId: '', subject: '', score: '' });
  };

  return (
    <div className="card fade-in" style={{ maxWidth: 500, margin: '2rem auto' }}>
      <div className="card-header">
        <h2 className="card-title">Ajouter un résultat</h2>
        <i className="fa-solid fa-chart-simple" style={{ fontSize: '1.8rem', color: 'var(--primary)' }}></i>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
        <div className="form-group">
          <label htmlFor="studentId">
            <i className="fa-solid fa-user-graduate" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
            Étudiant
          </label>
          <select
            id="studentId"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            required
            className="slide-in"
          >
            <option key="default-student" value="">Sélectionnez un étudiant</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.firstName || student.nom} {student.lastName || student.prenom} - {student.matricule}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subject">
            <i className="fa-solid fa-book" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
            Matière
          </label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="slide-in"
          >
            <option key="default-subject" value="">Sélectionnez une matière</option>
            {SUBJECTS.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="score">
            <i className="fa-solid fa-graduation-cap" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
            Note (sur 20)
          </label>
          <input
            id="score"
            name="score"
            type="number"
            min="0"
            max="20"
            step="0.5"
            placeholder="Ex: 15.5"
            value={form.score}
            onChange={handleChange}
            required
            className="slide-in"
          />
        </div>

        <button type="submit" className="success slide-in">
          <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i>
          Ajouter le résultat
        </button>
    </form>
    </div>
  );
};

export default AddResultForm; 