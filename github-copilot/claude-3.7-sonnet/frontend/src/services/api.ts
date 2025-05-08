import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

export const fetchVocabularyLists = async () => {
    const response = await axios.get(`${API_BASE_URL}/vocabulary_lists`);
    return response.data;
};

export const createVocabularyList = async (data: { title: string }) => {
    const response = await axios.post(`${API_BASE_URL}/vocabulary_lists`, data);
    return response.data;
};

export const deleteVocabularyList = async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/vocabulary_lists/${id}`);
    return response.data;
};

export const fetchFlashcards = async (listId: string) => {
    const response = await axios.get(`${API_BASE_URL}/vocabulary_lists/${listId}/flashcards`);
    return response.data;
};

export const createFlashcard = async (listId: string, data: { content: string; tags: string[] }) => {
    const response = await axios.post(`${API_BASE_URL}/vocabulary_lists/${listId}/flashcards`, data);
    return response.data;
};

export const deleteFlashcard = async (listId: string, flashcardId: string) => {
    const response = await axios.delete(`${API_BASE_URL}/vocabulary_lists/${listId}/flashcards/${flashcardId}`);
    return response.data;
};