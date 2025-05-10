import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // react-markdown をインポート
import './App.css';
import {
  getWordbooks, deleteWordbook as apiDeleteWordbook, updateWordbook as apiUpdateWordbook,
  getWordbook as apiGetWordbook, getWordCards as apiGetWordCards, createWordbook as apiCreateWordbook, createWordCard as apiCreateWordCard, deleteWordCard as apiDeleteWordCard,
  updateWordCard as apiUpdateWordCard, createTag as apiCreateTag, getTags as apiGetTags // getTags をインポート
} from './services/api';
import type { Wordbook, WordbookUpdatePayload, WordCard, GetWordCardsParams, WordCardCreatePayload, WordCardUpdatePayload, TagCreatePayload, Tag } from './types'; // Tag をインポート

// --- Pages ---
const HomePage = () => {
  const [wordbooks, setWordbooks] = useState<Wordbook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWordbooks = async () => {
      try {
        setLoading(true);
        const data = await getWordbooks();
        if (Array.isArray(data)) {
          setWordbooks(data);
          setError(null);
        } else {
          // APIがエラーオブジェクトなどを返した場合のフォールバック
          console.error('getWordbooks did not return an array:', data);
          setError('単語帳データの形式が正しくありません。');
          setWordbooks([]); // エラー時は空配列に
        }
      } catch (err) {
        setError('単語帳の読み込みに失敗しました。');
        setWordbooks([]); // エラー時は空配列に
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWordbooks();
  }, []);

  const handleUpdateWordbook = async (id: number, currentName: string) => {
    const newName = window.prompt('新しい単語帳名を入力してください:', currentName);
    if (newName && newName.trim() !== '' && newName !== currentName) {
      try {
        const payload: WordbookUpdatePayload = { name: newName };
        const updatedWordbook = await apiUpdateWordbook(id, payload);
        setWordbooks(wordbooks.map(wb => (wb.id === id ? updatedWordbook : wb)));
      } catch (err) {
        alert('単語帳の更新に失敗しました。');
        console.error(err);
      }
    }
  };

  const handleDeleteWordbook = async (id: number) => {
    if (window.confirm('本当にこの単語帳を削除しますか？')) {
      try {
        await apiDeleteWordbook(id);
        setWordbooks(wordbooks.filter(wb => wb.id !== id));
      } catch (err) {
        alert('単語帳の削除に失敗しました。');
        console.error(err);
      }
    }
  };

  if (loading) return <p className="text-center mt-8">読み込み中...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">単語帳一覧</h1>
      <div className="text-center mb-8">
        <button
          onClick={async () => {
            console.log('「新しい単語帳を作成」ボタンがクリックされました。');
            const name = window.prompt('新しい単語帳の名前を入力してください:');
            console.log('入力された名前:', name);
            if (name && name.trim() !== '') {
              console.log('API呼び出し前の処理に進みます。');
              try {
                const newWordbook = await apiCreateWordbook({ name });
                console.log('APIから返された新しい単語帳:', newWordbook);
                // newWordbookがWordbook型であることを前提とする (APIの型定義を信頼)
                setWordbooks(prevWordbooks => [...prevWordbooks, newWordbook]);
              } catch (err) {
                alert('単語帳の作成に失敗しました。');
                console.error(err);
              }
            }
          }}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          新しい単語帳を作成
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {wordbooks.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500">単語帳はまだありません。</p>
        )}
        {wordbooks.map((wordbook) => (
          <div key={wordbook.id} className="border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white">
            <h2 className="text-2xl font-semibold mb-3 text-blue-600">{wordbook.name}</h2>
            <p className="text-sm text-gray-600 mb-4">
              登録単語数: {wordbook.word_cards?.length || 0} {/* word_cardsは詳細取得時のみなので注意 */}
            </p>
            <p className="text-xs text-gray-400 mb-1">作成日: {new Date(wordbook.created_at).toLocaleDateString()}</p>
            <p className="text-xs text-gray-400 mb-4">更新日: {new Date(wordbook.updated_at).toLocaleDateString()}</p>
            <div className="flex justify-end space-x-2">
              <Link
                to={`/wordbook/${wordbook.id}`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
              >
                詳細
              </Link>
              <button
                onClick={() => handleUpdateWordbook(wordbook.id, wordbook.name)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
              >
                編集
              </button>
              <button
                onClick={() => handleDeleteWordbook(wordbook.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WordbookDetailPage = () => {
  const { wordbookId } = useParams<{ wordbookId: string }>();
  const [wordbook, setWordbook] = useState<Wordbook | null>(null);
  const [wordCards, setWordCards] = useState<WordCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterFavorite, setFilterFavorite] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at_desc');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]); // 利用可能なタグ一覧


  useEffect(() => {
    if (!wordbookId) return;

    const fetchWordbookDetails = async () => {
      try {
        setLoading(true);
        const wbId = parseInt(wordbookId, 10);
        const wordbookData = await apiGetWordbook(wbId);
        setWordbook(wordbookData);

        const tagsData = await apiGetTags(); // タグ一覧を取得
        setAvailableTags(tagsData);

        const params: GetWordCardsParams = {};
        if (filterFavorite === 'favorite') {
          params.is_favorite = true;
        } else if (filterFavorite === 'not_favorite') {
          params.is_favorite = false;
        }
        if (sortBy) {
          params.sort_by = sortBy;
        }

        const cardsData = await apiGetWordCards(wbId, params);
        setWordCards(cardsData);
        setError(null);
      } catch (err) {
        setError('単語帳詳細の読み込みに失敗しました。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWordbookDetails();
  }, [wordbookId, filterFavorite, sortBy]); // sortBy を依存配列に追加

  const handleDeleteWordCard = async (cardId: number) => {
    if (!wordbookId) return;
    if (window.confirm('本当にこの単語カードを削除しますか？')) {
      try {
        await apiDeleteWordCard(parseInt(wordbookId, 10), cardId);
        setWordCards(wordCards.filter(card => card.id !== cardId));
      } catch (err) {
        alert('単語カードの削除に失敗しました。');
        console.error(err);
      }
    }
  };

  const handleUpdateWordCard = async (card: WordCard) => {
    if (!wordbookId) return;
    const newTerm = window.prompt('用語を編集:', card.term);
    if (newTerm === null) return;
    const newDefinition = window.prompt('定義を編集:', card.definition);
    if (newDefinition === null) return;

    let tagIds: number[] = card.tags.map(t => t.id); // 現在のタグIDをデフォルトに
    const availableTagsMessage = availableTags.length > 0 ?
      `利用可能なタグ:\n${availableTags.map(t => `${t.id}: ${t.name}`).join('\n')}\n\n現在のタグID: ${tagIds.join(', ')}\n新しいタグIDをカンマ区切りで入力してください (例: 1,2,3):` :
      `利用可能なタグはありません。現在のタグID: ${tagIds.join(', ')}\n新しいタグIDをカンマ区切りで入力してください (例: 1,2,3):`;
    const tagsInput = window.prompt(availableTagsMessage, tagIds.join(','));

    if (tagsInput !== null) {
      tagIds = tagsInput.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
    }

    if (newTerm.trim() === '' || newDefinition.trim() === '') {
      alert('用語と定義は空にできません。');
      return;
    }

    // is_favorite は handleToggleFavorite で別途更新するため、ここでは変更しない
    if (newTerm !== card.term || newDefinition !== card.definition || JSON.stringify(tagIds) !== JSON.stringify(card.tags.map(t=>t.id))) {
      try {
        const payload: WordCardUpdatePayload = {
          term: newTerm,
          definition: newDefinition,
          tags: tagIds,
        };
        const updatedCard = await apiUpdateWordCard(parseInt(wordbookId, 10), card.id, payload);
        setWordCards(wordCards.map(c => (c.id === card.id ? updatedCard : c)));
      } catch (err) {
        alert('単語カードの更新に失敗しました。');
        console.error(err);
      }
    }
  };

  const handleToggleFavorite = async (card: WordCard) => {
    if (!wordbookId) return;
    try {
      const payload: WordCardUpdatePayload = { is_favorite: !card.is_favorite };
      const updatedCard = await apiUpdateWordCard(parseInt(wordbookId, 10), card.id, payload);
      setWordCards(wordCards.map(c => (c.id === card.id ? updatedCard : c)));
    } catch (err) {
      alert('お気に入り状態の更新に失敗しました。');
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-8">読み込み中...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!wordbook) return <p className="text-center mt-8">単語帳が見つかりません。</p>;

  const handleCreateTag = async () => {
    const tagName = window.prompt('新しいタグ名を入力してください:');
    if (tagName && tagName.trim() !== '') {
      try {
        const payload: TagCreatePayload = { name: tagName };
        await apiCreateTag(payload);
        alert(`タグ「${tagName}」を作成しました。`);
        // TODO: タグリストをどこかで管理・再表示する場合は更新処理が必要
      } catch (err) {
        alert('タグの作成に失敗しました。');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">{wordbook.name}</h1>
      <div className="p-4">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                if (!wordbookId) return;
                const term = window.prompt('新しい単語の用語を入力してください:');
                if (!term || term.trim() === '') return;
                const definition = window.prompt('新しい単語の定義を入力してください:');
                if (!definition || definition.trim() === '') return;

                try {
                  let tagIds: number[] = [];
                  if (availableTags.length > 0) {
                    const availableTagsMessage = `利用可能なタグ:\n${availableTags.map(t => `${t.id}: ${t.name}`).join('\n')}\n\nタグIDをカンマ区切りで入力してください (例: 1,2,3)。不要な場合は空のままOKしてください:`;
                    const tagsInput = window.prompt(availableTagsMessage);
                    if (tagsInput && tagsInput.trim() !== '') {
                      tagIds = tagsInput.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
                    }
                  } else {
                    alert('利用可能なタグがありません。先にタグを作成してください。');
                  }

                  const payload: WordCardCreatePayload = {
                    wordbook_id: parseInt(wordbookId, 10),
                    term,
                    definition,
                    tags: tagIds,
                  };
                  const newCard = await apiCreateWordCard(parseInt(wordbookId, 10), payload);
                  setWordCards([...wordCards, newCard]);
                } catch (err) {
                  alert('単語カードの作成に失敗しました。');
                  console.error(err);
                }
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
            >
              新しい単語カードを追加
            </button>
            <button
              onClick={handleCreateTag}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
            >
              新しいタグを作成
            </button>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-2 rounded text-sm bg-white shadow-sm"
            >
              <option value="created_at_desc">並び替え: 作成日（新）</option>
              <option value="created_at_asc">作成日（古）</option>
              <option value="term_asc">用語（昇順）</option>
              <option value="term_desc">用語（降順）</option>
            </select>
            <select
              value={filterFavorite}
              onChange={(e) => setFilterFavorite(e.target.value)}
              className="border p-2 rounded text-sm bg-white shadow-sm"
            >
              <option value="all">フィルター: すべて</option>
              <option value="favorite">お気に入りのみ</option>
              <option value="not_favorite">お気に入り以外</option>
            </select>
          </div>
        </div>

        {wordCards.length === 0 && (
          <p className="text-center text-gray-500">この単語帳にはまだ単語カードがありません。</p>
        )}
        <div className="space-y-4">
          {wordCards.map((card) => (
            <div key={card.id} className="border p-4 rounded-lg shadow-md bg-white">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="mb-2 sm:mb-0">
                  <h3 className="text-xl font-semibold text-gray-800">{card.term}</h3>
                  <div className="prose prose-sm mt-1 text-gray-600"> {/* proseクラスで基本的なスタイルを適用 */}
                    <ReactMarkdown>{card.definition}</ReactMarkdown>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end space-y-2 sm:space-y-1 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleToggleFavorite(card)} // ここは前回適用されていたはず
                    className={`text-sm px-3 py-1 rounded transition-colors ${card.is_favorite ? 'bg-yellow-400 hover:bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                  >
                    {card.is_favorite ? '★ お気に入り解除' : '☆ お気に入り登録'}
                  </button>
                  <div className="flex space-x-2 mt-1">
                    <button
                      onClick={() => handleUpdateWordCard(card)} // 編集ボタンのonClick
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-xs transition-colors"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteWordCard(card.id)} // 削除ボタンのonClick
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
              {card.tags && card.tags.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  {card.tags.map(tag => (
                    <span key={tag.id} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs mr-1 mb-1 inline-block">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Layout Component ---
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-200">単語帳アプリ</Link>
        {/* 他のナビゲーションリンクをここに追加可能 */}
      </nav>
    </header>
    <main className="flex-grow container mx-auto p-4">
      {children}
    </main>
    <footer className="bg-gray-800 text-white text-center p-4">
      © 2025 単語帳管理アプリ
    </footer>
  </div>
);


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wordbook/:wordbookId" element={<WordbookDetailPage />} />
          {/* 他のルート (例: ログイン画面、タグ管理画面など) をここに追加 */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
