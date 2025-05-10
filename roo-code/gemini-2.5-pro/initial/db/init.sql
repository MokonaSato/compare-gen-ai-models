-- データベースの作成 (存在しない場合のみ)
CREATE DATABASE IF NOT EXISTS wordbook_db;
USE wordbook_db;

-- 単語帳テーブル
CREATE TABLE IF NOT EXISTS wordbooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 単語カードテーブル
CREATE TABLE IF NOT EXISTS word_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wordbook_id INT NOT NULL,
    term TEXT NOT NULL, -- Markdown形式で保存
    definition TEXT NOT NULL, -- Markdown形式で保存
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wordbook_id) REFERENCES wordbooks(id) ON DELETE CASCADE
);

-- タグテーブル
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 単語カードとタグの中間テーブル
CREATE TABLE IF NOT EXISTS word_card_tags (
    word_card_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (word_card_id, tag_id),
    FOREIGN KEY (word_card_id) REFERENCES word_cards(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- テストデータの挿入
-- 単語帳
INSERT INTO wordbooks (name) VALUES
('英単語 基本'),
('IT用語集');

-- タグ
INSERT INTO tags (name) VALUES
('名詞'),
('動詞'),
('形容詞'),
('ネットワーク'),
('セキュリティ');

-- 単語カード (英単語 基本)
INSERT INTO word_cards (wordbook_id, term, definition, is_favorite) VALUES
(1, '**Apple**', 'リンゴ\n\n- *An apple a day keeps the doctor away.*', TRUE),
(1, '**Book**', '本\n\n- *I read a book yesterday.*', FALSE),
(1, '**Car**', '車\n\n- *He drives a red car.*', TRUE);

-- 単語カード (IT用語集)
INSERT INTO word_cards (wordbook_id, term, definition, is_favorite) VALUES
(2, '**API** (Application Programming Interface)', 'ソフトウェアコンポーネントが互いにやり取りするためのインターフェース。', TRUE),
(2, '**DNS** (Domain Name System)', 'ドメイン名をIPアドレスに変換するシステム。', FALSE),
(2, '**Firewall**', 'ネットワークのセキュリティを保護するためのシステム。不正なアクセスを防ぐ。', TRUE);

-- 単語カードとタグの関連付け (英単語 基本)
INSERT INTO word_card_tags (word_card_id, tag_id) VALUES
(1, 1), -- Apple - 名詞
(2, 1), -- Book - 名詞
(3, 1); -- Car - 名詞

-- 単語カードとタグの関連付け (IT用語集)
INSERT INTO word_card_tags (word_card_id, tag_id) VALUES
(4, 4), -- API - ネットワーク
(4, 5), -- API - セキュリティ
(5, 4), -- DNS - ネットワーク
(6, 5); -- Firewall - セキュリティ