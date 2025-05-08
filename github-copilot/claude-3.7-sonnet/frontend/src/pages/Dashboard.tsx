import React, { useContext, useEffect } from 'react';
import { VocabularyContext } from '../contexts/VocabularyContext';
// import VocabularyListOverview from '../components/vocabularyLists/VocabularyListOverview';
import { VocabularyListOverview } from '../components/vocabularyLists/VocabularyListOverview';

const Dashboard: React.FC = () => {
    // const { fetchVocabularyLists, vocabularyLists } = useContext(VocabularyContext);
    const vocabularyContext = useContext(VocabularyContext);

    if (!vocabularyContext) {
        throw new Error('VocabularyContext is null. Please ensure it is properly provided.');
    }

    const { fetchVocabularyLists, vocabularyLists } = vocabularyContext;

    useEffect(() => {
        fetchVocabularyLists();
    }, [fetchVocabularyLists]);

    return (
        <div>
            <h1>Dashboard</h1>
            <VocabularyListOverview lists={vocabularyLists} />
        </div>
    );
};

export default Dashboard;