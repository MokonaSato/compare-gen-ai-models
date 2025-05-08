-- データベースとユーザーはdocker-composeで作成済み

-- 単語帳テーブル
CREATE TABLE IF NOT EXISTS notebooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 単語カードテーブル
CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notebook_id INT NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE CASCADE
);

-- タグテーブル
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- カードとタグの中間テーブル
CREATE TABLE IF NOT EXISTS card_tags (
    card_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (card_id, tag_id),
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- テストデータ投入
INSERT INTO notebooks (name, subject) VALUES
('英単語帳', '英語'),
('歴史用語帳', '社会');

INSERT INTO cards (notebook_id, front, back, is_favorite) VALUES
(1, 'apple', 'りんご', TRUE),
(1, 'banana', 'バナナ', FALSE),
(2, '鎌倉幕府', '1192年に成立した日本の幕府', TRUE);

INSERT INTO tags (name) VALUES
('果物'),
('重要'),
('日本史');

INSERT INTO card_tags (card_id, tag_id) VALUES
(1, 1), -- apple: 果物
(1, 2), -- apple: 重要
(3, 2), -- 鎌倉幕府: 重要
(3, 3); -- 鎌倉幕府: 日本史