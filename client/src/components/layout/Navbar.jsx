import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    // Get user info from local storage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav style={styles.navbar}>
            <Link to="/" style={styles.brand}>AI Travel Planner</Link>
            <div style={styles.navLinks}>
                {userInfo ? (
                    <>
                        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                        <button onClick={logoutHandler} style={styles.button}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.buttonLink}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

// Simple inline styles for demonstration
const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'var(--primary-color)',
    },
    brand: {
        color: 'var(--text-color)',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
    },
    link: {
        color: 'var(--text-muted-color)',
        textDecoration: 'none',
        margin: '0 1rem',
        transition: 'color 0.2s',
    },
    button: {
        backgroundColor: 'var(--accent-color)',
        color: '#000',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
    },
    buttonLink: {
        backgroundColor: 'var(--accent-color)',
        color: '#000',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        textDecoration: 'none',
    }
};

export default Navbar;