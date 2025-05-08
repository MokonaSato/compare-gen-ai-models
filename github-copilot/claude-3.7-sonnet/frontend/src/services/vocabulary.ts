import axios from 'axios';
import { VocabularyList } from '../types/vocabulary';

const API_URL = 'http://localhost:5000/api/vocabulary_lists';

export const getVocabularyLists = async (): Promise<VocabularyList[]> => {
    const response = await axios.get<VocabularyList[]>(API_URL);
    return response.data;
};

export const createVocabularyList = async (vocabularyList: VocabularyList): Promise<VocabularyList> => {
    const response = await axios.post<VocabularyList>(API_URL, vocabularyList);
    return response.data;
};

export const updateVocabularyList = async (id: string, vocabularyList: VocabularyList): Promise<VocabularyList> => {
    const response = await axios.put<VocabularyList>(`${API_URL}/${id}`, vocabularyList);
    return response.data;
};

export const deleteVocabularyList = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};