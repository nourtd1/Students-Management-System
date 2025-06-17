import React, { useState } from 'react';
import { useStudentContext } from '../contexts/StudentContext';
import { useNavigate } from 'react-router-dom';

const SUBJECTS = [
  'Math',
  'Informatique',
  'Droit',
  'Finance',
  'Anglais',
  'Économie'
];

const AddResultForm = () => {
  const { students, results, setResults } = useStudentContext();
  const [matricule, setMatricule] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const selectedStudent = students.find(s => s.matricule === matricule);

  const handleSubmit = e => {
    e.preventDefault();
    if (!matricule || !subject || !score) return;
    setResults([
      ...results,
      { id: Date.now(), studentId: selectedStudent.id, subject, score: Number(score) }
    ]);
    setMatricule('');
    setSubject('');
    setScore('');
    setSuccess('Résultat ajouté !');
    setTimeout(() => {
      setSuccess('');
      navigate('/search');
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <h3>Add Student Result</h3>
      <select name="matricule" value={matricule} onChange={e => setMatricule(e.target.value)} required style={{ width: '100%', marginBottom: 8 }}>
        <option value="">Select Matriculation Number</option>
        {students.map(s => (
          <option key={s.id} value={s.matricule}>{s.matricule}</option>
        ))}
      </select>
      {selectedStudent && (
        <div style={{ marginBottom: 8, color: '#3358e6' }}>
          {selectedStudent.firstName} {selectedStudent.lastName}
        </div>
      )}
      <select name="subject" value={subject} onChange={e => setSubject(e.target.value)} required style={{ width: '100%', marginBottom: 8 }}>
        <option value="">Select Subject</option>
        {SUBJECTS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
      </select>
      <input name="score" type="number" placeholder="Score" value={score} onChange={e => setScore(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
      <button type="submit" style={{ width: '100%', marginTop: 8 }}>Add Result</button>
      {success && <div className="success">{success}</div>}
    </form>
  );
};

export default AddResultForm; 