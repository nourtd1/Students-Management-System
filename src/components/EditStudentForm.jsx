import React, { useState } from 'react';
import { useStudentContext } from '../contexts/StudentContext';
import { useNavigate } from 'react-router-dom';

const LEVELS = [
  'Première année',
  'Deuxième année',
  'Troisième année',
  'Quatrième année',
  'Master 1',
  'Master 2'
];

const PROGRAMS = [
  'Informatique',
  'Law',
  'Finance',
  'IBS'
];

const EditStudentForm = () => {
  const { students, setStudents } = useStudentContext();
  const [step, setStep] = useState(1);
  const [matricule, setMatricule] = useState('');
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({ email: '', level: '', program: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = e => {
    e.preventDefault();
    const found = students.find(s => s.matricule === matricule);
    if (!found) {
      setError('Aucun étudiant trouvé avec ce matricule.');
      setStudent(null);
      return;
    }
    setStudent(found);
    setForm({ email: found.email, level: found.level, program: found.program });
    setError('');
    setStep(2);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = e => {
    e.preventDefault();
    setStudents(students.map(s =>
      s.id === student.id ? { ...s, email: form.email, level: form.level, program: form.program } : s
    ));
    setSuccess('Informations mises à jour !');
    setTimeout(() => {
      setSuccess('');
      navigate('/edit-success');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <h3>Edit Student Information</h3>
      {step === 1 && (
        <form onSubmit={handleSearch}>
          <label>Step 1: Search Student by Matriculation Number</label>
          <input name="matricule" placeholder="Matriculation Number" value={matricule} onChange={e => setMatricule(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
          {error && <div className="error">{error}</div>}
          <button type="submit" style={{ width: '100%', marginTop: 8 }}>Edit Information</button>
        </form>
      )}
      {step === 2 && student && (
        <form onSubmit={handleUpdate}>
          <label>Step 2: Edit Information</label>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
          <select name="level" value={form.level} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }}>
            <option value="">Select Level</option>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select name="program" value={form.program} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }}>
            <option value="">Select Program</option>
            {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button type="submit" style={{ width: '100%', marginTop: 8 }}>Update Information</button>
          {success && <div className="success">{success}</div>}
        </form>
      )}
    </div>
  );
};

export default EditStudentForm; 