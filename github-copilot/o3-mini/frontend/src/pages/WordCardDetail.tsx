import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../styles/App.css';

interface WordCard {
    id: number;
    content: string;
    favorite: boolean;
    tags: string[];
}

const WordCardDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // サンプルデータ：実際にはバックエンドとの連携を実装する想定
    const [wordCards, setWordCards] = useState<WordCard[]>([
        { id: 1, content: '**Hello** world', favorite: true, tags: ['greeting', 'english'] },
        { id: 2, content: 'こんにちは、世界', favorite: false, tags: ['挨拶', 'japanese'] },
        { id: 3, content: '- List Item 1\n- List Item 2', favorite: false, tags: ['list'] }
    ]);

    const [filter, setFilter] = useState<'all' | 'favorite' | 'notFavorite'>('all');
    const [sortCriteria, setSortCriteria] = useState<'id' | 'favorite'>('id');

    const toggleFavorite = (cardId: number) => {
        setWordCards(prev =>
            prev.map(card =>
                card.id === cardId ? { ...card, favorite: !card.favorite } : card
            )
        );
    };

    const handleEdit = (cardId: number) => {
        // 単語カード編集処理実装用
        console.log(`単語カード編集: id ${cardId}`);
    };

    const handleDelete = (cardId: number) => {
        // 単語カード削除処理実装用
        setWordCards(prev => prev.filter(card => card.id !== cardId));
    };

    const filteredCards = wordCards.filter(card => {
        if (filter === 'favorite') return card.favorite;
        if (filter === 'notFavorite') return !card.favorite;
        return true;
    });

    const sortedCards = [...filteredCards].sort((a, b) => {
        if (sortCriteria === 'id') {
            return a.id - b.id;
        }
        if (sortCriteria === 'favorite') {
            return (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1;
        }
        return 0;
    });

    return (
        <div className="wordcard-detail">
            <h1>単語帳詳細・編集（id: {id}）</h1>
            <div className="controls">
                <label>
                    フィルタ:&nbsp;
                    <select value={filter} onChange={e => setFilter(e.target.value as 'all' | 'favorite' | 'notFavorite')}>
                        <option value="all">全て</option>
                        <option value="favorite">お気に入りのみ</option>
                        <option value="notFavorite">お気に入り以外</option>
                    </select>
                </label>
                &nbsp;&nbsp;
                <label>
                    ソート:&nbsp;
                    <select value={sortCriteria} onChange={e => setSortCriteria(e.target.value as 'id' | 'favorite')}>
                        <option value="id">ID順</option>
                        <option value="favorite">お気に入り優先</option>
                    </select>
                </label>
            </div>
            <ul>
                {sortedCards.map(card => (
                    <li key={card.id} className="wordcard-item">
                        <div className="wordcard-content">
                            <ReactMarkdown>{card.content}</ReactMarkdown>
                        </div>
                        <div className="wordcard-tags">
                            {card.tags.map((tag, idx) => (
                                <span key={idx} className="tag">{tag}</span>
                            ))}
                        </div>
                        <div className="wordcard-actions">
                            <button onClick={() => toggleFavorite(card.id)}>
                                {card.favorite ? 'お気に入り解除' : 'お気に入り登録'}
                            </button>
                            <button onClick={() => handleEdit(card.id)}>編集</button>
                            <button onClick={() => handleDelete(card.id)}>削除</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WordCardDetail;