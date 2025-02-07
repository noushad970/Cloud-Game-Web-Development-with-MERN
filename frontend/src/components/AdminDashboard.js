import React, { useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
const AdminDashboard = () => {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [type, setType] = useState('free');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/admin/games',
                { name, link, type, image, category },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Game added successfully');
        } catch (err) {
            console.error(err.response?.data?.error || 'Failed to add game');
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Game Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Game Link" value={link} onChange={(e) => setLink(e.target.value)} required />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                </select>
                <input type="text" placeholder="Game Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
                <input type="text" placeholder="Game Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                <button type="submit">Add Game</button>
            </form>
        </div>
    );
};

export default AdminDashboard;