import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './components/Home';
// import WordCardDetail from './components/WordCardDetail';
import Home from './pages/Home';
import WordCardDetail from './pages/WordCardDetail';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        {/* <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/wordcard/:id" component={WordCardDetail} />
        </Switch> */}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/wordcard/:id" element={<WordCardDetail/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;