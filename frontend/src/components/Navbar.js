import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav>
            <h1>Hello {user ? user.username:"Stranger"}!</h1>
            
            <div>
            {user && <button onClick={handleLogout}>Logout</button>}</div>
            
        </nav>
        
    );
};

export default Navbar;