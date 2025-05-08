import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotebookDetail from "./pages/NotebookDetail";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notebooks/:id" element={<NotebookDetail />} />
    </Routes>
  </BrowserRouter>
);

export default App;