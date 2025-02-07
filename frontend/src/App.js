import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddGame from './pages/AddGame';
import LoginRegister from './pages/LoginRegister';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-game" element={<AddGame />} />
                <Route path="/login" element={<LoginRegister />} />
            </Routes>
        </Router>
    );
};

export default App;