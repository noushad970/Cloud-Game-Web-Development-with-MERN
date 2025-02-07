import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DebugMessage from '../components/DebugMessage';
import './Home.css';
function enableVerticalScrollOnly() {
    document.body.style.overflowX = "hidden"; // Disable horizontal scrolling
    document.body.style.overflowY = "auto";   // Enable vertical scrolling
}
const Home = () => {
    const [games, setGames] = useState([]);
    const [user, setUser] = useState(null);
    const [debugMessage, setDebugMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        
        window.onload=enableVerticalScrollOnly;
        // Fetch games
        const fetchGames = async () => {
            try {
                
                const res = await axios.get('http://localhost:5000/api/games');
                setGames(res.data.games);
            } catch (err) {
                console.error(err.response?.data?.error || 'Failed to fetch games');
            }
        };

        // Check if user is logged in
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = JSON.parse(localStorage.getItem('user'));
            if (token && userData) {
                setUser(userData);
            }
        };

        fetchGames();
        checkAuth();
    }, []);

    const handlePlay = (link) => {
        const game=games.find((g)=>g.link===link);
        if (user.subscriptionType==="free") {
            if(game.type==="free"){
            window.open(game.link);
            }else if(game.type==="paid"){
                //pay to play
                console.log("pay to play");
            }
        }else if(user.subscriptionType==="paid")
        {
            window.open(game.link);
        }
        // if(user){
        //     window.open(link, '_blank');
        // } 
        else {
            navigate('/login');
        }
    };

    const handleBuySubscription = async () => {
        if (user && user.subscriptionType === 'free') {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.post(
                    'http://localhost:5000/api/auth/upgrade-subscription',
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Update user in local storage and state
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setUser(res.data.user);

                setDebugMessage('Subscription upgraded to paid!');
            } catch (err) {
                console.error(err.response?.data?.error || 'Failed to upgrade subscription');
                setDebugMessage('Failed to upgrade subscription');
            }
        }
    };

    return (
        <div className="home">
            <Navbar />
            <DebugMessage message={debugMessage} />
            
        window.location.reload();
            {/* Welcome Section */}
            <section className="welcome-section">
                <h1>Welcome to Cloud Gaming</h1>
                <p>Explore a wide range of free and premium games. Log in to start playing!</p>
            </section>

            {/* Buttons Section */}
            <div className="button-section">
                {user ? (
                    <>
                        
                        {user.isAdmin && (
                            <button onClick={() => navigate('/add-game')}>Admin Panel</button>
                        )}
                        {user.subscriptionType === 'free' && (
                            <button onClick={handleBuySubscription}>Buy Subscription</button>
                        )}
                    </>
                ) : (
                    <button onClick={() => navigate('/login')}>Login</button>
                )}
            </div>

            {/* Game List Section */}
            <section className="game-list-section">
                <h2>Game Library</h2>
                <div className="games-grid">
                    {games.map((game) => (
                        <div key={game._id} className="game-card">
                            <img src={game.image} alt={game.name} />
                            <h3>{game.name}</h3>
                            <p>Type: {game.type}</p>
                            <button onClick={() => handlePlay(game.link)}>
                                {user ? 'Play Now' : 'Login to Play'}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;