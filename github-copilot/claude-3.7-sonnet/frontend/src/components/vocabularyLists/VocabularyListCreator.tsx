import React, { useState } from 'react';

interface VocabularyListCreatorProps {
  onCreate: (title: string) => void;
}

const VocabularyListCreator: React.FC<VocabularyListCreatorProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title.trim()) {
      onCreate(title);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter vocabulary list title"
        required
      />
      <button type="submit">Create Vocabulary List</button>
    </form>
  );
};

export default VocabularyListCreator;