import React, { useState } from 'react';
import { useStudentContext } from '../contexts/StudentContext';

const SearchStudentForm = () => {
  const { students } = useStudentContext();
  const [query, setQuery] = useState('');

  const filtered = students.filter(s =>
    s.nom.toLowerCase().includes(query.toLowerCase()) ||
    s.matricule.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <h3>Rechercher un étudiant</h3>
      <input
        type="text"
        placeholder="Nom ou matricule..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />
      {query && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filtered.length === 0 && <li>Aucun résultat</li>}
          {filtered.map(s => (
            <li key={s.id} style={{ padding: 4, borderBottom: '1px solid #eee' }}>
              {s.nom} {s.prenom} ({s.matricule})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchStudentForm; 