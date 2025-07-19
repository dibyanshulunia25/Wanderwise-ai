import React, { useState } from 'react';
import { Navigate} from 'react-router-dom';
import axios from 'axios';

const AuthPage = ({ isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        
        try {
            const { data } = await axios.post(`http://localhost:5001${endpoint}`, { email, password });
            console.log('User info saved to local storage:', data);
            
            // Save user info and token to local storage
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            setLoading(false);
            Navigate('/dashboard'); // Redirect to dashboard after successful auth
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
                {error && <p style={styles.error}>{error}</p>}
                <div style={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '5rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'var(--primary-color)', borderRadius: '8px' },
    formGroup: { display: 'flex', flexDirection: 'column' },
    error: { color: '#f87171', backgroundColor: '#450a0a', padding: '0.5rem', borderRadius: '5px' },
};

export default AuthPage;