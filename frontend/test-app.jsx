import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EditPost from './src/pages/EditPost';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default App;