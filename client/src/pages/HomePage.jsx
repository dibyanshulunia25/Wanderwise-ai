import React from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

const HomePage = () => {
    return (
        <div style={styles.container}>
            <div style={styles.left}>
                <h1 style={styles.title}>Plan Your Next Adventure with AI</h1>
                <p style={styles.subtitle}>
                    Provide your destination, budget, and preferences, and get a personalized travel itinerary in seconds.
                </p>
                <Link to="/register" style={styles.ctaButton}>Get Started</Link>
            </div>
            <div style={styles.right}>
                <Canvas>
                    <OrbitControls enableZoom={false} autoRotate />
                    <ambientLight intensity={1} />
                    <directionalLight position={[3, 2, 1]} />
                    <Sphere args={[1, 100, 200]} scale={2.4}>
                        <MeshDistortMaterial
                            color="#38bdf8"
                            attach="material"
                            distort={0.5}
                            speed={2}
                        />
                    </Sphere>
                </Canvas>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 80px)', // Full height minus navbar
        gap: '2rem',
    },
    left: {
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    right: {
        flex: 3,
        height: '100%',
    },
    title: {
        fontSize: '4rem',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: '1.25rem',
        color: 'var(--text-muted-color)',
    },
    ctaButton: {
        padding: '1rem 2rem',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#000',
        backgroundColor: 'var(--accent-color)',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        textDecoration: 'none',
        maxWidth: '150px',
        textAlign: 'center',
    }
};

export default HomePage;