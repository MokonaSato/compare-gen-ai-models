import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
// import { Button } from '../components/common/Button';
// import { Input } from '../components/common/Input'
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            // await login(email, password);
            await login({email, password});
            // Redirect to dashboard or home page after successful login
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <Button onClick={handleLogin}>Login</Button>
        </div>
    );
};

export default LoginPage;