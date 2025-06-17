import React from 'react';

const steps = [
  '1. Connexion',
  '2. Ajouter un étudiant',
  '3. Modifier les informations',
  '4. Ajouter un résultat',
  '5. Rechercher un étudiant'
];

const WorkflowHeader = () => (
  <div style={{
    background: '#f1f5fa',
    color: '#3358e6',
    padding: '10px 0',
    textAlign: 'center',
    fontWeight: 500,
    fontSize: '1.05rem',
    letterSpacing: 0.5,
    borderBottom: '1px solid #e0e7ef',
    marginBottom: 24
  }}>
    {steps.join('  →  ')}
  </div>
);

export default WorkflowHeader; 