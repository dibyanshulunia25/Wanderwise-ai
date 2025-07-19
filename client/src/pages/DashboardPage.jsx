import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// Helper function to get the auth token
const getAuthToken = () => {
    return JSON.parse(localStorage.getItem('userInfo'))?.token;
};

const DashboardPage = () => {
    // State for the form inputs
    const [destination, setDestination] = useState('');
    const [budget, setBudget] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [days, setDays] = useState(1);

    // State for application logic
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedGuide, setGeneratedGuide] = useState('');
    const [pastGuides, setPastGuides] = useState([]);
    const [userTier, setUserTier] = useState('normal');

    // Fetch user tier info when the component loads
    useEffect(() => {
        const currentUserTier = JSON.parse(localStorage.getItem('userInfo'))?.userTier || 'normal';
        setUserTier(currentUserTier);
    }, []);

    // Fetch past guides when the component mounts
    const fetchPastGuides = useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
            const { data } = await axios.get('http://localhost:5001/api/guides', config);
            setPastGuides(data);
        } catch (err) {
            console.error('Failed to fetch past guides:', err);
        }
    }, []);

    useEffect(() => {
        fetchPastGuides();
    }, [fetchPastGuides]);

    const handleUpgradeClick = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
            const { data } = await axios.post('http://localhost:5001/api/payments/create-checkout-session', {}, config);

            // Redirect the user to the Stripe Checkout page
            window.location.href = data.url;
        } catch (err) {
            setError('Could not initiate upgrade. Please try again later.');
            console.error(err);
        }
    };

    const handleGenerateGuide = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setGeneratedGuide('');

        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` } };
            const { data } = await axios.post(
                'http://localhost:5001/api/guides/generate',
                { destination, budget, numberOfPeople, days },
                config
            );
            setGeneratedGuide(data.guideContent);
            fetchPastGuides(); // Refresh the list of past guides
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate guide');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.dashboard}>
            <div style={styles.formSection}>
                <h2>Create a New Travel Guide</h2>
                {userTier === 'normal' && (
                    <button onClick={handleUpgradeClick} style={styles.proButton}>
                        Upgrade to Pro ✨
                    </button>
                )}
                {userTier === 'pro' && <p style={styles.proBadge}>PRO</p>}
                <form onSubmit={handleGenerateGuide} style={styles.form}>
                    <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="Destination (e.g., Paris, France)" required />
                    <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="Budget (USD)" required />
                    <input type="number" value={numberOfPeople} onChange={e => setNumberOfPeople(e.target.value)} placeholder="Number of People" min="1" required />
                    <input type="number" value={days} onChange={e => setDays(e.target.value)} placeholder="Number of Days" min="1" required />
                    <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Guide'}</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <div style={styles.guideSection}>
                <h3>Generated Guide</h3>
                <div style={styles.guideContent}>
                    {loading && <p>AI is thinking...</p>}
                    {generatedGuide ? (
                        <ReactMarkdown>{generatedGuide}</ReactMarkdown>
                    ) : (
                        <p>Your new guide will appear here.</p>
                    )}
                </div>
            </div>

            <div style={styles.pastGuidesSection}>
                <h3>Your Past Guides</h3>
                {pastGuides.length > 0 ? (
                    pastGuides.map(guide => (
                        <div key={guide._id} style={styles.pastGuideItem} onClick={() => setGeneratedGuide(guide.guideContent)}>
                            {guide.destination} - {new Date(guide.createdAt).toLocaleDateString()}
                        </div>
                    ))
                ) : (
                    <p>You have no saved guides.</p>
                )}
            </div>
        </div>
    );
};

// Styles
const styles = {
    dashboard: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', padding: '2rem 0' },
    formSection: {},
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    guideSection: {},
    guideContent: { backgroundColor: 'var(--primary-color)', padding: '1rem', borderRadius: '8px', minHeight: '400px', overflowY: 'auto' },
    pastGuidesSection: { gridColumn: 'span 2' },
    pastGuideItem: { padding: '1rem', backgroundColor: 'var(--secondary-color)', borderRadius: '5px', marginBottom: '0.5rem', cursor: 'pointer' },
     header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    proButton: { backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px' },
    proBadge: { backgroundColor: '#f59e0b', color: '#000', padding: '0.3rem 0.6rem', borderRadius: '5px', fontWeight: 'bold' }
};

export default DashboardPage;