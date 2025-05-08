import React, { useContext, useEffect } from 'react';
import { VocabularyContext } from '../contexts/VocabularyContext';
// import VocabularyListOverview from '../components/vocabularyLists/VocabularyListOverview';
import { VocabularyListOverview } from '../components/vocabularyLists/VocabularyListOverview';
import VocabularyListCreator from '../components/vocabularyLists/VocabularyListCreator';

const VocabularyListPage: React.FC = () => {
    // const { vocabularyLists, fetchVocabularyLists } = useContext(VocabularyContext);
    const vocabularyContext = useContext(VocabularyContext);
    if (!vocabularyContext) {
        throw new Error('VocabularyContext is null. Ensure the provider is set up correctly.');
    }
    const { vocabularyLists, fetchVocabularyLists } = vocabularyContext;

    useEffect(() => {
        fetchVocabularyLists();
    }, [fetchVocabularyLists]);

    return (
        <div>
            <h1>Vocabulary Lists</h1>
            {/* <VocabularyListCreator /> */}
            <VocabularyListCreator onCreate={() => {}}/>
            <VocabularyListOverview lists={vocabularyLists} />
        </div>
    );
};

export default VocabularyListPage;