import React, { useState } from 'react';
import { useStudentContext } from '../contexts/StudentContext';
import { useNavigate } from 'react-router-dom';

const PROGRAMS = [
  'Informatique',
  'Law',
  'Finance',
  'IBS'
];

const LEVELS = [
  'Première année',
  'Deuxième année',
  'Troisième année',
  'Quatrième année',
  'Master 1',
  'Master 2'
];

const StudentRegistrationForm = () => {
  const { students, setStudents } = useStudentContext();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    matricule: '',
    email: '',
    dob: '',
    program: '',
    level: ''
  });
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.matricule || !form.email || !form.dob || !form.program || !form.level) return;
    setStudents([
      ...students,
      { id: Date.now(), ...form }
    ]);
    setForm({ firstName: '', lastName: '', matricule: '', email: '', dob: '', program: '', level: '' });
    setSuccess('Étudiant ajouté !');
    setTimeout(() => {
      setSuccess('');
      navigate('/edit-student');
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <h3>Inscription Étudiant</h3>
      <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
      <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
      <input name="matricule" placeholder="Matriculation Number" value={form.matricule} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
      <input name="dob" type="date" placeholder="Date of Birth" value={form.dob} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
      <select name="program" value={form.program} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }}>
        <option value="">Select Program</option>
        {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <select name="level" value={form.level} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }}>
        <option value="">Select Level</option>
        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <button type="submit" style={{ width: '100%', marginTop: 8 }}>Register Student</button>
      {success && <div className="success">{success}</div>}
    </form>
  );
};

export default StudentRegistrationForm; 