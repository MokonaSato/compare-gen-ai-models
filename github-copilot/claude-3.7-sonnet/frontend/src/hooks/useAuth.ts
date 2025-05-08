import { useState, useEffect } from 'react';
import { getUser, loginUser, logoutUser, signupUser } from '../services/auth';
import { User } from '../types/auth';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await getUser();
                setUser(fetchedUser);
            } catch (err) {
                setError('Failed to fetch user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        setLoading(true);
        try {
            const loggedInUser = await loginUser(credentials);
            setUser(loggedInUser);
        } catch (err) {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData: { email: string; password: string }) => {
        setLoading(true);
        try {
            const newUser = await signupUser(userData);
            setUser(newUser);
        } catch (err) {
            setError('Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null);
        } catch (err) {
            setError('Logout failed');
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, login, signup, logout };
};