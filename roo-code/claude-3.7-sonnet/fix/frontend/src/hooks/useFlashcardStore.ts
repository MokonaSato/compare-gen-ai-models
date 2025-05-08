import { create } from 'zustand';
import { 
  Flashcard, 
  Card, 
  Tag, 
  FlashcardCreate, 
  FlashcardUpdate, 
  CardCreate, 
  CardUpdate, 
  TagCreate,
  FilterOptions,
  SortOption,
  SortDirection
} from '../types';
import { flashcardApi, cardApi, tagApi } from '../services/api';

interface FlashcardState {
  // 状態
  flashcards: Flashcard[];
  currentFlashcard: Flashcard | null;
  cards: Card[];
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  filterOptions: FilterOptions;
  sortOption: SortOption;
  sortDirection: SortDirection;

  // アクション
  fetchFlashcards: () => Promise<void>;
  fetchFlashcardById: (id: number) => Promise<void>;
  createFlashcard: (flashcard: FlashcardCreate) => Promise<Flashcard>;
  updateFlashcard: (id: number, flashcard: FlashcardUpdate) => Promise<void>;
  deleteFlashcard: (id: number) => Promise<void>;
  
  fetchCards: (flashcardId: number) => Promise<void>;
  createCard: (flashcardId: number, card: CardCreate) => Promise<Card>;
  updateCard: (id: number, card: CardUpdate) => Promise<void>;
  deleteCard: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  
  fetchTags: () => Promise<void>;
  createTag: (tag: TagCreate) => Promise<Tag>;
  deleteTag: (id: number) => Promise<void>;
  
  setFilterOptions: (options: FilterOptions) => void;
  setSortOption: (option: SortOption) => void;
  setSortDirection: (direction: SortDirection) => void;
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  // 初期状態
  flashcards: [],
  currentFlashcard: null,
  cards: [],
  tags: [],
  isLoading: false,
  error: null,
  filterOptions: {},
  sortOption: 'created_at',
  sortDirection: 'desc',

  // 単語帳関連のアクション
  fetchFlashcards: async () => {
    set({ isLoading: true, error: null });
    try {
      const flashcards = await flashcardApi.getAll();
      console.log('取得した単語帳:', flashcards);
      set({ flashcards, isLoading: false });
    } catch (error) {
      console.error('単語帳の取得に失敗しました:', error);
      set({ error: '単語帳の取得に失敗しました', isLoading: false });
    }
  },

  fetchFlashcardById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const flashcard = await flashcardApi.getById(id);
      set({ currentFlashcard: flashcard, isLoading: false });
    } catch (error) {
      console.error('単語帳の取得に失敗しました:', error);
      set({ error: '単語帳の取得に失敗しました', isLoading: false });
    }
  },

  createFlashcard: async (flashcard: FlashcardCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newFlashcard = await flashcardApi.create(flashcard);
      set(state => ({ 
        flashcards: [...state.flashcards, newFlashcard], 
        isLoading: false 
      }));
      return newFlashcard;
    } catch (error) {
      console.error('単語帳の作成に失敗しました:', error);
      set({ error: '単語帳の作成に失敗しました', isLoading: false });
      throw error;
    }
  },

  updateFlashcard: async (id: number, flashcard: FlashcardUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updatedFlashcard = await flashcardApi.update(id, flashcard);
      set(state => ({
        flashcards: state.flashcards.map(f => f.id === id ? updatedFlashcard : f),
        currentFlashcard: state.currentFlashcard?.id === id ? updatedFlashcard : state.currentFlashcard,
        isLoading: false
      }));
    } catch (error) {
      console.error('単語帳の更新に失敗しました:', error);
      set({ error: '単語帳の更新に失敗しました', isLoading: false });
    }
  },

  deleteFlashcard: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await flashcardApi.delete(id);
      set(state => ({
        flashcards: state.flashcards.filter(f => f.id !== id),
        currentFlashcard: state.currentFlashcard?.id === id ? null : state.currentFlashcard,
        isLoading: false
      }));
    } catch (error) {
      console.error('単語帳の削除に失敗しました:', error);
      set({ error: '単語帳の削除に失敗しました', isLoading: false });
    }
  },

  // カード関連のアクション
  fetchCards: async (flashcardId: number) => {
    const { filterOptions } = get();
    set({ isLoading: true, error: null });
    try {
      const cards = await cardApi.getByFlashcardId(flashcardId, filterOptions.favorites_only);
      set({ cards, isLoading: false });
    } catch (error) {
      console.error('カードの取得に失敗しました:', error);
      set({ error: 'カードの取得に失敗しました', isLoading: false });
    }
  },

  createCard: async (flashcardId: number, card: CardCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newCard = await cardApi.create(flashcardId, card);
      set(state => ({ 
        cards: [...state.cards, newCard], 
        isLoading: false 
      }));
      return newCard;
    } catch (error) {
      console.error('カードの作成に失敗しました:', error);
      set({ error: 'カードの作成に失敗しました', isLoading: false });
      throw error;
    }
  },

  updateCard: async (id: number, card: CardUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCard = await cardApi.update(id, card);
      set(state => ({
        cards: state.cards.map(c => c.id === id ? updatedCard : c),
        isLoading: false
      }));
    } catch (error) {
      console.error('カードの更新に失敗しました:', error);
      set({ error: 'カードの更新に失敗しました', isLoading: false });
    }
  },

  deleteCard: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await cardApi.delete(id);
      set(state => ({
        cards: state.cards.filter(c => c.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('カードの削除に失敗しました:', error);
      set({ error: 'カードの削除に失敗しました', isLoading: false });
    }
  },

  toggleFavorite: async (id: number) => {
    try {
      const updatedCard = await cardApi.toggleFavorite(id);
      set(state => ({
        cards: state.cards.map(c => c.id === id ? updatedCard : c)
      }));
    } catch (error) {
      console.error('お気に入り状態の切り替えに失敗しました:', error);
      set({ error: 'お気に入り状態の切り替えに失敗しました' });
    }
  },

  // タグ関連のアクション
  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const tags = await tagApi.getAll();
      set({ tags, isLoading: false });
    } catch (error) {
      console.error('タグの取得に失敗しました:', error);
      set({ error: 'タグの取得に失敗しました', isLoading: false });
    }
  },

  createTag: async (tag: TagCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newTag = await tagApi.create(tag);
      set(state => ({ 
        tags: [...state.tags, newTag], 
        isLoading: false 
      }));
      return newTag;
    } catch (error) {
      console.error('タグの作成に失敗しました:', error);
      set({ error: 'タグの作成に失敗しました', isLoading: false });
      throw error;
    }
  },

  deleteTag: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await tagApi.delete(id);
      set(state => ({
        tags: state.tags.filter(t => t.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('タグの削除に失敗しました:', error);
      set({ error: 'タグの削除に失敗しました', isLoading: false });
    }
  },

  // フィルタリングとソート関連のアクション
  setFilterOptions: (options: FilterOptions) => {
    set({ filterOptions: options });
    const { currentFlashcard } = get();
    if (currentFlashcard) {
      get().fetchCards(currentFlashcard.id);
    }
  },

  setSortOption: (option: SortOption) => {
    set({ sortOption: option });
  },

  setSortDirection: (direction: SortDirection) => {
    set({ sortDirection: direction });
  }
}));