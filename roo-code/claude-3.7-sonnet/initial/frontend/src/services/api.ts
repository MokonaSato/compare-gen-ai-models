import axios from 'axios';
import { 
  Flashcard, 
  Card, 
  Tag, 
  FlashcardCreate, 
  FlashcardUpdate, 
  CardCreate, 
  CardUpdate, 
  TagCreate 
} from '../types';

// APIのベースURL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Axiosインスタンスの作成
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 単語帳関連のAPI
export const flashcardApi = {
  // 全ての単語帳を取得
  getAll: async (): Promise<Flashcard[]> => {
    const response = await api.get('/flashcards/');
    return response.data;
  },

  // 特定の単語帳を取得
  getById: async (id: number): Promise<Flashcard> => {
    const response = await api.get(`/flashcards/${id}`);
    return response.data;
  },

  // 新しい単語帳を作成
  create: async (flashcard: FlashcardCreate): Promise<Flashcard> => {
    const response = await api.post('/flashcards/', flashcard);
    return response.data;
  },

  // 単語帳を更新
  update: async (id: number, flashcard: FlashcardUpdate): Promise<Flashcard> => {
    const response = await api.put(`/flashcards/${id}`, flashcard);
    return response.data;
  },

  // 単語帳を削除
  delete: async (id: number): Promise<void> => {
    await api.delete(`/flashcards/${id}`);
  }
};

// 単語カード関連のAPI
export const cardApi = {
  // 特定の単語帳に属する全てのカードを取得
  getByFlashcardId: async (flashcardId: number, favoritesOnly?: boolean): Promise<Card[]> => {
    const params = favoritesOnly !== undefined ? { favorites_only: favoritesOnly } : {};
    const response = await api.get(`/flashcards/${flashcardId}/cards/`, { params });
    return response.data;
  },

  // 特定のカードを取得
  getById: async (id: number): Promise<Card> => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  // 新しいカードを作成
  create: async (flashcardId: number, card: CardCreate): Promise<Card> => {
    const response = await api.post(`/flashcards/${flashcardId}/cards/`, card);
    return response.data;
  },

  // カードを更新
  update: async (id: number, card: CardUpdate): Promise<Card> => {
    const response = await api.put(`/cards/${id}`, card);
    return response.data;
  },

  // カードを削除
  delete: async (id: number): Promise<void> => {
    await api.delete(`/cards/${id}`);
  },

  // お気に入り状態を切り替え
  toggleFavorite: async (id: number): Promise<Card> => {
    const response = await api.put(`/cards/${id}/toggle-favorite`);
    return response.data;
  }
};

// タグ関連のAPI
export const tagApi = {
  // 全てのタグを取得
  getAll: async (): Promise<Tag[]> => {
    const response = await api.get('/tags/');
    return response.data;
  },

  // 新しいタグを作成
  create: async (tag: TagCreate): Promise<Tag> => {
    const response = await api.post('/tags/', tag);
    return response.data;
  },

  // タグを削除
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tags/${id}`);
  }
};

export default api;