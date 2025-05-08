import React from 'react';

interface WordCardProps {
    id: string;
    title: string;
    content: string;
    isFavorite: boolean;
    tags: string[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ id, title, content, isFavorite, tags, onEdit, onDelete, onToggleFavorite }) => {
    return (
        <div className="word-card">
            <h3>{title}</h3>
            <div className="word-card-content" dangerouslySetInnerHTML={{ __html: content }} />
            <div className="tags">
                {tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>
            <div className="actions">
                <button onClick={() => onEdit(id)}>Edit</button>
                <button onClick={() => onDelete(id)}>Delete</button>
                <button onClick={() => onToggleFavorite(id)}>
                    {isFavorite ? 'Unfavorite' : 'Favorite'}
                </button>
            </div>
        </div>
    );
};

export default WordCard;