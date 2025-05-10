import axios from 'axios';
import type {
    Wordbook,
    WordbookCreatePayload,
    WordbookUpdatePayload,
    WordCard,
    WordCardCreatePayload,
    WordCardUpdatePayload,
    Tag,
    TagCreatePayload,
    AuthToken,
    GetWordCardsParams
} from '../types';

// APIエンドポイントのベースURLを設定
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const TOKEN_ENDPOINT = '/token';

// デバッグ用のログ出力
console.log('API_BASE_URL:', API_BASE_URL);

// APIクライアントの作成
const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // バックエンドのポートを8000に修正
  headers: {
    'Content-Type': 'application/json'
  }
});

// トークンをローカルストレージから取得する関数
const getToken = () => localStorage.getItem('accessToken');

// axiosリクエストインターセプターを設定
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- API関数 ---

// 認証
export const login = async (credentials: URLSearchParams): Promise<AuthToken> => {
  const response = await apiClient.post<AuthToken>(
    TOKEN_ENDPOINT,
    credentials,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );
  if (response.data.access_token) {
    localStorage.setItem('accessToken', response.data.access_token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('accessToken');
};

// --- Wordbook ---
export const getWordbooks = async (): Promise<Wordbook[]> => {
  try {
    console.log('Requesting wordbooks from:', `/wordbooks`);
    const response = await apiClient.get<Wordbook[]>(`/wordbooks`);
    console.log('Response received:', response.status);
    return response.data;
  } catch (error: any) {
    console.error('Error in getWordbooks:', error);
    if (error.request) {
      console.error('Error request details:', error.request);
    }
    if (error.response) {
      console.error('Error response details:', error.response);
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    throw error;
  }
};

export const getWordbook = async (id: number): Promise<Wordbook> => {
  const response = await apiClient.get<Wordbook>(`/wordbooks/${id}`);
  return response.data;
};

export const createWordbook = async (data: WordbookCreatePayload): Promise<Wordbook> => {
  const response = await apiClient.post<Wordbook>(`/wordbooks`, data);
  return response.data;
};

export const updateWordbook = async (id: number, data: WordbookUpdatePayload): Promise<Wordbook> => {
  const response = await apiClient.put<Wordbook>(`/wordbooks/${id}`, data);
  return response.data;
};

export const deleteWordbook = async (id: number): Promise<Wordbook> => {
  const response = await apiClient.delete<Wordbook>(`/wordbooks/${id}`);
  return response.data;
};

// --- WordCard ---
export const getWordCards = async (wordbookId: number, params?: GetWordCardsParams): Promise<WordCard[]> => {
  const response = await apiClient.get<WordCard[]>(`/wordbooks/${wordbookId}/cards`, { params });
  return response.data;
};

export const getWordCard = async (wordbookId: number, cardId: number): Promise<WordCard> => {
  const response = await apiClient.get<WordCard>(`/wordbooks/${wordbookId}/cards/${cardId}`);
  return response.data;
};

export const createWordCard = async (wordbookId: number, data: WordCardCreatePayload): Promise<WordCard> => {
  const payload = { ...data, wordbook_id: wordbookId };
  const response = await apiClient.post<WordCard>(`/wordbooks/${wordbookId}/cards`, payload);
  return response.data;
};

export const updateWordCard = async (wordbookId: number, cardId: number, data: WordCardUpdatePayload): Promise<WordCard> => {
  const response = await apiClient.put<WordCard>(`/wordbooks/${wordbookId}/cards/${cardId}`, data);
  return response.data;
};

export const deleteWordCard = async (wordbookId: number, cardId: number): Promise<WordCard> => {
  const response = await apiClient.delete<WordCard>(`/wordbooks/${wordbookId}/cards/${cardId}`);
  return response.data;
};

// --- Tag ---
export const getTags = async (): Promise<Tag[]> => {
  const response = await apiClient.get<Tag[]>(`/tags`);
  return response.data;
};

export const createTag = async (data: TagCreatePayload): Promise<Tag> => {
  const response = await apiClient.post<Tag>(`/tags`, data);
  return response.data;
};

export const deleteTag = async (id: number): Promise<Tag> => {
  const response = await apiClient.delete<Tag>(`/tags/${id}`);
  return response.data;
};