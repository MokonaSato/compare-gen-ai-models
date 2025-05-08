import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 仮の単語帳データ型
export interface Wordbook {
  id: number;
  title: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [wordbooks, setWordbooks] = useState<Wordbook[]>([]);

  useEffect(() => {
    // TODO: APIから単語帳一覧を取得する処理を実装
    // fetch('/api/wordbooks')
    //   .then(res => res.json())
    //   .then(data => setWordbooks(data));

    // 仮のデータを設定
    setWordbooks([
      { id: 1, title: '英単語 Basic', description: '基本的な英単語集' },
      { id: 2, title: 'プログラミング用語', description: '開発でよく使う用語' },
    ]);
  }, []);

  const handleEdit = (id: number) => {
    // TODO: 編集処理を実装
    console.log(`Edit wordbook ${id}`);
  };

  const handleDelete = (id: number) => {
    // TODO: 削除処理を実装
    console.log(`Delete wordbook ${id}`);
    // setWordbooks(wordbooks.filter(wb => wb.id !== id));
  };

  return (
    <div>
      <h1>単語帳一覧</h1>
      {/* TODO: 新規作成ボタンを追加 */}
      <ul>
        {wordbooks.map((wb) => (
          <li key={wb.id}>
            <Link to={`/wordbook/${wb.id}`}>
              <h2>{wb.title}</h2>
            </Link>
            <p>{wb.description}</p>
            <button onClick={() => handleEdit(wb.id)}>編集</button>
            <button onClick={() => handleDelete(wb.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;