import axios from 'axios';
import { AuthResponse, User, UserCredentials } from '../types/auth';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (credentials: UserCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const signup = async (credentials: UserCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/signup`, credentials);
    return response.data;
};

// 以下追記

export const logout = async (): Promise<void> => {
    await axios.post(`${API_URL}/logout`);
};

export const getUser = async (): Promise<User> => {
    // 実装を追加
};

export const loginUser = async (credentials: UserCredentials): Promise<User> => {
    // 実装を追加
};

export const logoutUser = async (): Promise<void> => {
    // 実装を追加
};

export const signupUser = async (credentials: UserCredentials): Promise<User> => {
    // 実装を追加
};