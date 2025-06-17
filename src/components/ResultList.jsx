import React from 'react';
import { useStudentContext } from '../contexts/StudentContext';

const ResultList = () => {
  const { results, setResults, students } = useStudentContext();

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce résultat ?')) {
      setResults(results.filter(r => r.id !== id));
    }
  };

  if (results.length === 0) return <div style={{textAlign:'center', marginTop:16}}>Aucun résultat enregistré.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h3>Liste des résultats</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Étudiant</th>
            <th>Matière</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => {
            const student = students.find(s => s.id === Number(r.studentId) || s.id === r.studentId);
            return (
              <tr key={r.id}>
                <td>{student ? `${student.nom} ${student.prenom} (${student.matricule})` : 'Inconnu'}</td>
                <td>{r.subject}</td>
                <td>{r.score}</td>
                <td>
                  <button onClick={() => handleDelete(r.id)} style={{ color: 'white', background: '#e74c3c', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Supprimer</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultList; 