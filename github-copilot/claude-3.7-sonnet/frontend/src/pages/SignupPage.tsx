import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
// import { Button } from '../components/common/Button';
// import { Input } from '../components/common/Input';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const SignupPage: React.FC = () => {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {
        try {
            // await signup(email, password);
            await signup({email, password});
            // Redirect or show success message
        } catch (err) {
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            {error && <p>{error}</p>}
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <Button onClick={handleSignup}>Sign Up</Button>
        </div>
    );
};

export default SignupPage;