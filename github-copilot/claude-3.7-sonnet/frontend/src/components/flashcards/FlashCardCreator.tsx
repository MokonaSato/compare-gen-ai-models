import React, { useState } from 'react';

interface FlashCardCreatorProps {
  onCreate: (content: string, tags: string[]) => void;
}

const FlashCardCreator: React.FC<FlashCardCreatorProps> = ({ onCreate }) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTags(value.split(',').map(tag => tag.trim()));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (content) {
      onCreate(content, tags);
      setContent('');
      setTags([]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Content:
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Tags (comma separated):
          <input
            type="text"
            value={tags.join(', ')}
            onChange={handleTagChange}
          />
        </label>
      </div>
      <button type="submit">Create FlashCard</button>
    </form>
  );
};

export default FlashCardCreator;