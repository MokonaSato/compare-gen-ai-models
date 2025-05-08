import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import VocabularyListPage from './pages/VocabularyListPage';
import FlashCardPage from './pages/FlashCardPage';
import { AuthProvider } from './contexts/AuthContext';
import { VocabularyProvider } from './contexts/VocabularyContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <VocabularyProvider>
        {/* <Router> */}
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          {/* <Switch> */}
          <Routes>
            {/* <Route path="/" exact component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/vocabulary-lists" component={VocabularyListPage} />
            <Route path="/flashcards" component={FlashCardPage} /> */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vocabulary-lists" element={<VocabularyListPage />} />
            <Route path="/flashcards" element={<FlashCardPage />} />
          {/* </Switch> */}
          </Routes>
        </Router>
      </VocabularyProvider>
    </AuthProvider>
  );
};

export default App;