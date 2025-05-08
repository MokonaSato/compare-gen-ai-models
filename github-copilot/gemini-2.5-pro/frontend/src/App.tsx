import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VocabularyPage from './pages/VocabularyPage';

const App: React.FC = () => {
  return (
    <Router>
      {/* <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/vocabulary" component={VocabularyPage} />
      </Switch> */}
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/vocabulary" element={<VocabularyPage/>} />
      </Routes>
    </Router>
  );
};

export default App;