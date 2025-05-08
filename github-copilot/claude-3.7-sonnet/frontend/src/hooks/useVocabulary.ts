import { useEffect, useState } from 'react';
import { getVocabularyLists, createVocabularyList, deleteVocabularyList } from '../services/vocabulary';
import { VocabularyList } from '../types/vocabulary';

export const useVocabulary = () => {
    const [vocabularyLists, setVocabularyLists] = useState<VocabularyList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVocabularyLists = async () => {
            try {
                const lists = await getVocabularyLists();
                setVocabularyLists(lists);
            } catch (err) {
                setError('Failed to fetch vocabulary lists');
            } finally {
                setLoading(false);
            }
        };

        fetchVocabularyLists();
    }, []);

    const addVocabularyList = async (title: string) => {
        try {
            const newList = await createVocabularyList(title);
            setVocabularyLists((prev) => [...prev, newList]);
        } catch (err) {
            setError('Failed to create vocabulary list');
        }
    };

    const removeVocabularyList = async (id: number) => {
        try {
            await deleteVocabularyList(id);
            setVocabularyLists((prev) => prev.filter((list) => list.id !== id));
        } catch (err) {
            setError('Failed to delete vocabulary list');
        }
    };

    return {
        vocabularyLists,
        loading,
        error,
        addVocabularyList,
        removeVocabularyList,
    };
};