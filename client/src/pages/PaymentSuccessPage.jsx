import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccessPage = () => {
    // This is a good place to trigger a refresh of the user's data
    // to reflect their new "pro" status immediately.
    useEffect(() => {
        // You could make an API call here to get the latest user info
        // and update your global state/local storage.
    }, []);

    return (
        <div style={styles.container}>
            <h2>Payment Successful!</h2>
            <p>Welcome to the Pro plan! You now have unlimited access to guide generation.</p>
            <Link to="/dashboard" style={styles.button}>Go to Dashboard</Link>
        </div>
    );
};

const styles = {
    container: { textAlign: 'center', paddingTop: '5rem' },
    button: { display: 'inline-block', marginTop: '1rem', padding: '0.8rem 1.5rem', textDecoration: 'none', color: '#000', backgroundColor: 'var(--accent-color)', borderRadius: '8px' }
};

export default PaymentSuccessPage;