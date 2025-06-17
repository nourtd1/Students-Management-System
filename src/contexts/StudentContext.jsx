import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

export const useStudentContext = () => useContext(StudentContext);

const STUDENTS_KEY = 'students';
const RESULTS_KEY = 'results';
const USERS_KEY = 'users';
const LOGGEDIN_KEY = 'isLoggedIn';
const DEFAULT_ADMIN = { email: 'admin@school.com', password: 'admin123', nom: 'Admin', prenom: 'Admin' };

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const data = localStorage.getItem(STUDENTS_KEY);
    return data ? JSON.parse(data) : [];
  });
  const [results, setResults] = useState(() => {
    const data = localStorage.getItem(RESULTS_KEY);
    return data ? JSON.parse(data) : [];
  });
  const [users, setUsers] = useState(() => {
    const data = localStorage.getItem(USERS_KEY);
    if (data) {
      const arr = JSON.parse(data);
      if (arr.length === 0) return [DEFAULT_ADMIN];
      return arr;
    }
    return [DEFAULT_ADMIN];
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(LOGGEDIN_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LOGGEDIN_KEY, isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  return (
    <StudentContext.Provider value={{ students, setStudents, results, setResults, users, setUsers, isLoggedIn, setIsLoggedIn }}>
      {children}
    </StudentContext.Provider>
  );
}; 