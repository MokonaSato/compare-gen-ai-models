import React from 'react';
import FlashCard from './FlashCard';

interface FlashCardListProps {
  cards: {
    id: number;
    content: string;
    tags: string[];
  }[];
}

const FlashCardList: React.FC<FlashCardListProps> = ({ cards }) => {
  return (
    <div>
      {cards.map(card => (
        <FlashCard key={card.id} content={card.content} tags={card.tags} />
      ))}
    </div>
  );
};

export default FlashCardList;