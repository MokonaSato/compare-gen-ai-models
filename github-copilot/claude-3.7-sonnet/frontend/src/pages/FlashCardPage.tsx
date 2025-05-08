import React, { useContext } from 'react';
import { VocabularyContext } from '../contexts/VocabularyContext';
import FlashCardList from '../components/flashcards/FlashCardList';
import FlashCardCreator from '../components/flashcards/FlashCardCreator';

const FlashCardPage: React.FC = () => {
    const { flashCards, addFlashCard } = useContext(VocabularyContext);

    const handleCreateFlashCard = (newCard: { content: string; tags: string[] }) => {
        addFlashCard(newCard);
    };

    return (
        <div>
            <h1>Flash Cards</h1>
            <FlashCardCreator onCreate={handleCreateFlashCard} />
            <FlashCardList cards={flashCards} />
        </div>
    );
};

export default FlashCardPage;