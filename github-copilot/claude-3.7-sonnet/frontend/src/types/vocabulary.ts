// export interface VocabularyList {
//   id: number;
//   title: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface VocabularyListType {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
  }

export interface FlashCard {
  id: number;
  content: string;
  tags: string[];
  vocabularyListId: number;
  createdAt: Date;
  updatedAt: Date;
}