import React from 'react';

interface FlashCardProps {
    content: string;
    tags: string[];
}

const FlashCard: React.FC<FlashCardProps> = ({ content, tags }) => {
    return (
        <div className="flashcard">
            <div className="flashcard-content">{content}</div>
            <div className="flashcard-tags">
                {tags.map((tag, index) => (
                    <span key={index} className="flashcard-tag">{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default FlashCard;