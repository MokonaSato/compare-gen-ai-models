import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Wordbook } from './HomePage'

// 仮の単語カードデータ型
interface Card {
  id: number;
  front: string; // 表面 (Markdown)
  back: string;  // 裏面 (Markdown)
  isFavorite: boolean;
  tags: string[];
  createdAt: string; // ソート用に作成日時を追加 (例)
}

// 仮の単語帳詳細データ型
interface WordbookDetail extends Wordbook {
    cards: Card[];
}

// ソートオプション
type SortOption = 'createdAt_asc' | 'createdAt_desc' | 'front_asc' | 'front_desc';
// フィルターオプション
type FilterOption = 'all' | 'favorites' | 'non_favorites';


const VocabularyPage: React.FC = () => {
  const { wordbookId } = useParams<{ wordbookId: string }>();
  const [wordbook, setWordbook] = useState<WordbookDetail | null>(null);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('createdAt_asc');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');

  useEffect(() => {
    // TODO: APIから単語帳詳細とカード一覧を取得する処理を実装
    // fetch(`/api/wordbooks/${wordbookId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //      setWordbook(data);
    //      // 初期表示時はフィルタリング・ソートを適用
    //      applyFiltersAndSort(data.cards, filterOption, sortOption);
    //   });

    // 仮のデータを設定
    const mockWordbook: WordbookDetail = {
      id: parseInt(wordbookId || '1'),
      title: `単語帳 ${wordbookId}`,
      description: `単語帳 ${wordbookId} の詳細`,
      cards: [
        { id: 101, front: '**Apple**', back: 'りんご', isFavorite: true, tags: ['fruit', 'food'], createdAt: '2023-01-10T10:00:00Z' },
        { id: 102, front: '`Banana`', back: 'バナナ', isFavorite: false, tags: ['fruit'], createdAt: '2023-01-11T11:00:00Z' },
        { id: 103, front: '*Orange*', back: 'オレンジ', isFavorite: true, tags: ['fruit', 'color'], createdAt: '2023-01-09T09:00:00Z' },
      ],
    };
    setWordbook(mockWordbook);
    applyFiltersAndSort(mockWordbook.cards, filterOption, sortOption);

  }, [wordbookId]); // wordbookIdが変わったら再取得

 useEffect(() => {
    // フィルターまたはソートオプションが変更されたら再適用
    if (wordbook) {
      applyFiltersAndSort(wordbook.cards, filterOption, sortOption);
    }
  }, [filterOption, sortOption, wordbook]);


  const applyFiltersAndSort = (cards: Card[], filter: FilterOption, sort: SortOption) => {
      let processedCards = [...cards];

      // フィルタリング
      if (filter === 'favorites') {
          processedCards = processedCards.filter(card => card.isFavorite);
      } else if (filter === 'non_favorites') {
          processedCards = processedCards.filter(card => !card.isFavorite);
      }

      // ソート
      processedCards.sort((a, b) => {
          switch (sort) {
              case 'createdAt_asc':
                  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              case 'createdAt_desc':
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              case 'front_asc':
                  return a.front.localeCompare(b.front);
              case 'front_desc':
                  return b.front.localeCompare(a.front);
              default:
                  return 0;
          }
      });

      setFilteredCards(processedCards);
  };


  const handleToggleFavorite = (cardId: number) => {
    // TODO: APIでお気に入り状態を更新する処理を実装
    console.log(`Toggle favorite for card ${cardId}`);
    if (wordbook) {
        const updatedCards = wordbook.cards.map(card =>
            card.id === cardId ? { ...card, isFavorite: !card.isFavorite } : card
        );
        setWordbook({ ...wordbook, cards: updatedCards });
        // 状態更新後、フィルタリングとソートを再適用
        applyFiltersAndSort(updatedCards, filterOption, sortOption);
    }
  };

  const handleEditCard = (cardId: number) => {
    // TODO: カード編集処理を実装
    console.log(`Edit card ${cardId}`);
  };

  const handleDeleteCard = (cardId: number) => {
    // TODO: カード削除処理を実装
    console.log(`Delete card ${cardId}`);
    if (wordbook) {
        const updatedCards = wordbook.cards.filter(card => card.id !== cardId);
        setWordbook({ ...wordbook, cards: updatedCards });
        // 状態更新後、フィルタリングとソートを再適用
        applyFiltersAndSort(updatedCards, filterOption, sortOption);
    }
  };

  if (!wordbook) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h1>{wordbook.title}</h1>
      <p>{wordbook.description}</p>
      {/* TODO: 単語帳自体の編集・削除機能 */}
      {/* TODO: 新規カード作成ボタン */}

      <div>
        {/* フィルター */}
        <label>フィルター: </label>
        <select value={filterOption} onChange={(e) => setFilterOption(e.target.value as FilterOption)}>
          <option value="all">すべて</option>
          <option value="favorites">お気に入りのみ</option>
          <option value="non_favorites">お気に入り以外</option>
        </select>

        {/* ソート */}
        <label style={{ marginLeft: '1em' }}>ソート: </label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)}>
          <option value="createdAt_asc">作成日 (昇順)</option>
          <option value="createdAt_desc">作成日 (降順)</option>
          <option value="front_asc">表面 (昇順)</option>
          <option value="front_desc">表面 (降順)</option>
          {/* 他のソート基準を追加 */}
        </select>
      </div>

      <h2>単語カード一覧</h2>
      <ul>
        {filteredCards.map((card) => (
          <li key={card.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            {/* TODO: Markdownレンダリングコンポーネントを使用 */}
            <div><strong>表:</strong> {card.front}</div>
            <div><strong>裏:</strong> {card.back}</div>
            <div>
              タグ: {card.tags.map(tag => <span key={tag} style={{ background: '#eee', margin: '2px', padding: '2px' }}>{tag}</span>)}
            </div>
            <button onClick={() => handleToggleFavorite(card.id)}>
              {card.isFavorite ? '★ お気に入り解除' : '☆ お気に入り登録'}
            </button>
            <button onClick={() => handleEditCard(card.id)} style={{ marginLeft: '5px' }}>編集</button>
            <button onClick={() => handleDeleteCard(card.id)} style={{ marginLeft: '5px' }}>削除</button>
          </li>
        ))}
      </ul>
       {/* TODO: タグ管理機能 */}
    </div>
  );
};

export default VocabularyPage;