// バックエンドのschemas.pyに対応する型定義

export interface Tag {
  id: number;
  name: string;
  created_at: string; // datetimeはstringとして扱うことが多い
}

export interface WordCard {
  id: number;
  wordbook_id: number;
  term: string;
  definition: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

export interface Wordbook {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  word_cards: WordCard[]; // WordbookDetailでは含まれる
}

// APIリクエスト・レスポンス用の型
export interface WordbookCreatePayload {
  name: string;
}
export type WordbookUpdatePayload = Partial<WordbookCreatePayload>;

export interface WordCardCreatePayload {
  wordbook_id: number;
  term: string;
  definition: string;
  is_favorite?: boolean;
  tags?: number[]; // Tag IDのリスト
}
export type WordCardUpdatePayload = Partial<Omit<WordCardCreatePayload, 'wordbook_id'>>;


export interface TagCreatePayload {
  name: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

// フィルタリングやソートのパラメータ用 (例)
export interface GetWordCardsParams {
    skip?: number;
    limit?: number;
    is_favorite?: boolean;
    sort_by?: string; // 'created_at_asc', 'created_at_desc', 'term_asc', 'term_desc'
    tags?: number[];
}