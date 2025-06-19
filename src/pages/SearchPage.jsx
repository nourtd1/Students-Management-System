// Importation des dépendances React et du contexte
import React, { useState } from 'react';
import { useStudentContext } from '../contexts/StudentContext';

// Composant de la page de recherche d'étudiants
const SearchPage = () => {
  // Récupération des données d'étudiants et de résultats depuis le contexte global
  const { students, results } = useStudentContext();
  // État local pour la requête de recherche
  const [query, setQuery] = useState('');
  // État local pour l'étudiant sélectionné
  const [selected, setSelected] = useState(null);

  // Filtrage des étudiants en fonction de la requête de recherche
  // Recherche dans le nom, prénom et matricule (gère les différents formats de données)
  const filtered = students.filter(s =>
    (s.firstName?.toLowerCase() ?? '').includes(query.toLowerCase()) ||
    (s.lastName?.toLowerCase() ?? '').includes(query.toLowerCase()) ||
    (s.nom?.toLowerCase() ?? '').includes(query.toLowerCase()) ||
    (s.prenom?.toLowerCase() ?? '').includes(query.toLowerCase()) ||
    (s.matricule?.toLowerCase() ?? '').includes(query.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h2>Rechercher un étudiant</h2>
      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Nom, prénom ou matricule..."
        value={query}
        onChange={e => { setQuery(e.target.value); setSelected(null); }}
        style={{ width: '100%', marginBottom: 8 }}
      />
      
      {/* Affichage des résultats de recherche uniquement si une requête est saisie */}
      {query && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filtered.length === 0 && <li>Aucun résultat</li>}
          {/* Liste des étudiants filtrés */}
          {filtered.map(s => (
            <li key={s.id} style={{ padding: 4, borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => setSelected(s)}>
              {s.firstName || s.nom} {s.lastName || s.prenom} ({s.matricule})
            </li>
          ))}
        </ul>
      )}
      {/* Affichage détaillé de l'étudiant sélectionné */}
      {selected && (
        <div style={{ marginTop: 24 }}>
          <h3>Fiche étudiant</h3>
          {/* Informations personnelles de l'étudiant */}
          <div><b>Nom :</b> {selected.lastName || selected.nom}</div>
          <div><b>Prénom :</b> {selected.firstName || selected.prenom}</div>
          <div><b>Date de naissance :</b> {selected.dob}</div>
          <div><b>Email :</b> {selected.email}</div>
          <div><b>Matricule :</b> {selected.matricule}</div>
          <div><b>Programme :</b> {selected.program}</div>
          <div><b>Niveau :</b> {selected.level}</div>
          
          {/* Section des notes de l'étudiant */}
          <h4 style={{ marginTop: 16 }}>Notes</h4>
          <ul>
            {/* Message si aucune note n'est trouvée */}
            {results.filter(r => r.studentId === selected.id || r.studentId === String(selected.id)).length === 0 && <li>Aucune note</li>}
            {/* Liste des notes de l'étudiant (gère les ID sous forme de string ou de nombre) */}
            {results.filter(r => r.studentId === selected.id || r.studentId === String(selected.id)).map(r => (
              <li key={r.id}>{r.subject} : {r.score}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage; 