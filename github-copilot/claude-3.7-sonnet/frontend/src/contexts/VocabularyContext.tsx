import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
// import { VocabularyList } from '../types/vocabulary';
import { VocabularyListType } from '../types/vocabulary';

// interface VocabularyContextType {
//   vocabularyLists: VocabularyList[];
//   addVocabularyList: (list: VocabularyList) => void;
//   removeVocabularyList: (id: string) => void;
// }

interface VocabularyContextType {
  fetchVocabularyLists: () => void;
  vocabularyLists: VocabularyListType[];
  addVocabularyList: (list: VocabularyListType) => void;
  removeVocabularyList: (id: string) => void;
}

// const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);
export const VocabularyContext = createContext<VocabularyContextType | null>(null);

export const VocabularyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const [vocabularyLists, setVocabularyLists] = useState<VocabularyList[]>([]);
  const [vocabularyLists, setVocabularyLists] = useState<VocabularyListType[]>([]);

  // const addVocabularyList = (list: VocabularyList) => {
  //   setVocabularyLists((prevLists) => [...prevLists, list]);
  // };
  const addVocabularyList = (list: VocabularyListType) => {
    setVocabularyLists((prevLists) => [...prevLists, list]);
  };

  const removeVocabularyList = (id: string) => {
    setVocabularyLists((prevLists) => prevLists.filter((list) => list.id !== id));
  };

  // 追記
  const fetchVocabularyLists = useCallback(() => {
    // API 呼び出しなどの処理
    console.log('Fetching vocabulary lists...');
    setVocabularyLists([
        { id: '1', title: 'List 1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'List 2', createdAt: new Date(), updatedAt: new Date() },
    ]);
}, []); // 空の依存配列でメモ化

  return (
    // <VocabularyContext.Provider value={{ vocabularyLists, addVocabularyList, removeVocabularyList }}>
    <VocabularyContext.Provider value={{ fetchVocabularyLists, vocabularyLists, addVocabularyList, removeVocabularyList }}>
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = (): VocabularyContextType => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};