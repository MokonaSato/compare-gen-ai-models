import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';

interface Wordbook {
    id: number;
    title: string;
}

const Home: React.FC = () => {
    const [wordbooks, setWordbooks] = useState<Wordbook[]>([
        { id: 1, title: '数学単語帳' },
        { id: 2, title: '英単語帳' }
    ]);

    const handleEdit = (id: number) => {
        // 単語帳編集処理実装用
        console.log(`単語帳編集: id ${id}`);
    };

    const handleDelete = (id: number) => {
        // 単語帳削除処理実装用
        setWordbooks(prev => prev.filter(wordbook => wordbook.id !== id));
    };

    return (
        <div className="home">
            <h1>単語帳一覧</h1>
            <ul>
                {wordbooks.map(wordbook => (
                    <li key={wordbook.id}>
                        <Link to={`/wordcard/${wordbook.id}`}>{wordbook.title}</Link>
                        <button onClick={() => handleEdit(wordbook.id)}>編集</button>
                        <button onClick={() => handleDelete(wordbook.id)}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;