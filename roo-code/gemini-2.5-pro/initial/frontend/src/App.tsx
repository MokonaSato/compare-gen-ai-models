import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // App.css はTailwindと共存可能、または削除してTailwindに完全移行

// --- Placeholder Pages ---
const HomePage = () => (
  <div>
    <h1 className="text-3xl font-bold underline text-center my-8">単語帳一覧</h1>
    {/* ここに単語帳リストが表示される */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {/* 例: 単語帳カード */}
      <div className="border p-4 rounded shadow hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">英単語 基本</h2>
        <p className="text-sm text-gray-600 mb-4">登録単語数: 3</p>
        <div className="flex justify-end space-x-2">
          <Link to="/wordbook/1" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
            詳細・編集
          </Link>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm">
            削除
          </button>
        </div>
      </div>
      <div className="border p-4 rounded shadow hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">IT用語集</h2>
        <p className="text-sm text-gray-600 mb-4">登録単語数: 3</p>
        <div className="flex justify-end space-x-2">
          <Link to="/wordbook/2" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
            詳細・編集
          </Link>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm">
            削除
          </button>
        </div>
      </div>
      {/* 新規作成ボタン */}
      <div className="border-2 border-dashed border-gray-300 p-4 rounded flex items-center justify-center hover:border-gray-400 cursor-pointer">
        <button className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新しい単語帳を作成
        </button>
      </div>
    </div>
  </div>
);

const WordbookDetailPage = () => {
  // const { wordbookId } = useParams<{ wordbookId: string }>(); // IDを取得する場合
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center my-8">単語帳詳細・編集 (ID: {/*wordbookId*/1})</h1>
      {/* ここに単語カード一覧と編集機能が表示される */}
      <div className="p-4">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 text-sm">
              新しい単語カードを追加
            </button>
          </div>
          <div className="flex space-x-2">
            <select className="border p-2 rounded text-sm">
              <option value="">並び替え: 作成日順</option>
              <option value="term_asc">用語昇順</option>
              <option value="term_desc">用語降順</option>
            </select>
            <select className="border p-2 rounded text-sm">
              <option value="">フィルター: すべて</option>
              <option value="favorite">お気に入りのみ</option>
              <option value="not_favorite">お気に入り以外</option>
            </select>
          </div>
        </div>

        {/* 単語カードの例 */}
        <div className="border p-4 rounded shadow mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">**Apple**</h3>
              <p className="text-sm text-gray-700 mt-1">リンゴ\n\n- *An apple a day keeps the doctor away.*</p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <button className="text-yellow-500 hover:text-yellow-600 text-sm">
                お気に入り登録
              </button>
              <div className="flex space-x-1">
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs">編集</button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">削除</button>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs mr-1">名詞</span>
          </div>
        </div>
         <div className="border p-4 rounded shadow mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">**API** (Application Programming Interface)</h3>
              <p className="text-sm text-gray-700 mt-1">ソフトウェアコンポーネントが互いにやり取りするためのインターフェース。</p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <button className="text-gray-400 hover:text-yellow-500 text-sm">
                お気に入り解除
              </button>
              <div className="flex space-x-1">
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs">編集</button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">削除</button>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs mr-1">ネットワーク</span>
            <span className="bg-red-200 text-red-700 px-2 py-1 rounded-full text-xs mr-1">セキュリティ</span>
          </div>
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
