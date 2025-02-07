import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import Navbar from '../components/Navbar';

const AddGame = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div>
            <Navbar />
            {user && user.isAdmin ? <AdminDashboard /> : <h1>You are not an Admin</h1>}
        </div>
    );
};

export default AddGame;