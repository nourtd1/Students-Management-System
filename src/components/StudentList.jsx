import React from 'react';
import { useStudentContext } from '../contexts/StudentContext';

const StudentList = () => {
  const { students, setStudents, results, setResults } = useStudentContext();

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet étudiant ? Cette action est irréversible.')) {
      setStudents(students.filter(s => s.id !== id));
      setResults(results.filter(r => r.studentId !== id && r.studentId !== String(id)));
    }
  };

  if (students.length === 0) return <div style={{textAlign:'center', marginTop:16}}>Aucun étudiant inscrit.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h3>Liste des étudiants</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Âge</th>
            <th>Email</th>
            <th>Matricule</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.nom}</td>
              <td>{s.prenom}</td>
              <td>{s.age}</td>
              <td>{s.email}</td>
              <td>{s.matricule}</td>
              <td>
                <button onClick={() => handleDelete(s.id)} style={{ color: 'white', background: '#e74c3c', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList; 