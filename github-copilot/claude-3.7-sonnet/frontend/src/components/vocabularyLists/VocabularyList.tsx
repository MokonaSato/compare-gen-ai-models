import React from 'react';

interface VocabularyListProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}

const VocabularyList: React.FC<VocabularyListProps> = ({ title, onEdit, onDelete }) => {
  return (
    <div className="vocabulary-list">
      <h3>{title}</h3>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default VocabularyList;