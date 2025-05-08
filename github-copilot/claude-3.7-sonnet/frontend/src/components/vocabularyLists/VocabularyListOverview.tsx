import React from 'react';
// import { VocabularyList } from './VocabularyList';
// import { VocabularyListType } from '../../types/vocabulary';
import VocabularyList from './VocabularyList';
import { VocabularyListType } from '../../types/vocabulary';

interface VocabularyListOverviewProps {
  lists: VocabularyListType[];
}

export const VocabularyListOverview: React.FC<VocabularyListOverviewProps> = ({ lists }) => {
  return (
    <div>
      <h2>Vocabulary Lists Overview</h2>
      {lists.length === 0 ? (
        <p>No vocabulary lists available.</p>
      ) : (
        <ul>
          {lists.map((list) => (
            <li key={list.id}>
              <VocabularyList
                title={list.title}
                onEdit={() => console.log(`Edit ${list.title}`)}
                onDelete={() => console.log(`Delete ${list.title}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};