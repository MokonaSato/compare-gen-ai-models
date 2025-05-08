// 単語帳の型定義
export interface Flashcard {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  cards?: Card[];
  card_count?: number;
}

// 単語カードの型定義
export interface Card {
  id: number;
  flashcard_id: number;
  front: string;
  back: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

// タグの型定義
export interface Tag {
  id: number;
  name: string;
  created_at: string;
}

// 単語帳作成用の型定義
export interface FlashcardCreate {
  title: string;
  description?: string;
}

// 単語帳更新用の型定義
export interface FlashcardUpdate {
  title?: string;
  description?: string;
}

// 単語カード作成用の型定義
export interface CardCreate {
  front: string;
  back: string;
  is_favorite?: boolean;
  tag_ids?: number[];
}

// 単語カード更新用の型定義
export interface CardUpdate {
  front?: string;
  back?: string;
  is_favorite?: boolean;
  tag_ids?: number[];
}

// タグ作成用の型定義
export interface TagCreate {
  name: string;
}

// APIレスポンスの型定義
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// ソートオプションの型定義
export type SortOption = 'created_at' | 'updated_at' | 'front' | 'back';

// ソート方向の型定義
export type SortDirection = 'asc' | 'desc';

// フィルターオプションの型定義
export interface FilterOptions {
  favorites_only?: boolean;
  tag_ids?: number[];
}