import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

type Card = {
  id: number;
  notebook_id: number;
  front: string;
  back: string;
  is_favorite: boolean;
  created_at?: string;
  updated_at?: string;
  tags?: Tag[];
};

type Tag = {
  id: number;
  name: string;
};

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const API_BASE = "";

const NotebookDetail: React.FC = () => {
  const { id } = useParams();
  const notebookId = Number(id);

  const [cards, setCards] = useState<Card[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filterFavorite, setFilterFavorite] = useState<null | boolean>(null);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [order, setOrder] = useState<string>("desc");
  const [openDialog, setOpenDialog] = useState(false);
  const [editCard, setEditCard] = useState<Card | null>(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [newTagName, setNewTagName] = useState("");

  // カード一覧取得
  const fetchCards = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/notebooks/${notebookId}/cards`,
        {
          params: {
            favorite: filterFavorite !== null ? filterFavorite : undefined,
            sort_by: sortBy,
            order,
          },
        }
      );
      
      // データが配列であることを確認
      if (Array.isArray(res.data)) {
        // 各カードのタグも取得
        const cardsWithTags = await Promise.all(
          res.data.map(async (card) => {
            try {
              const tagRes = await axios.get(`${API_BASE}/cards/${card.id}/tags`);
              return { 
                ...card, 
                tags: Array.isArray(tagRes.data) ? tagRes.data : [] 
              };
            } catch (error) {
              console.error(`Failed to fetch tags for card ${card.id}:`, error);
              return { ...card, tags: [] };
            }
          })
        );
        setCards(cardsWithTags);
      } else {
        console.error("Expected array but got:", res.data);
        setCards([]);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
      setCards([]);
    }
  };

  // タグ一覧取得
  const fetchTags = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tags`);
      if (Array.isArray(res.data)) {
        setTags(res.data);
      } else {
        console.error("Expected array of tags but got:", res.data);
        setTags([]);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      setTags([]);
    }
  };

  useEffect(() => {
    fetchCards();
    fetchTags();
    // eslint-disable-next-line
  }, [filterFavorite, sortBy, order]);

  // カード追加・編集ダイアログ表示
  const handleOpenDialog = (card?: Card) => {
    if (card) {
      setEditCard(card);
      setFront(card.front);
      setBack(card.back);
      setSelectedTags(card.tags && Array.isArray(card.tags) ? card.tags.map((t) => t.id) : []);
    } else {
      setEditCard(null);
      setFront("");
      setBack("");
      setSelectedTags([]);
    }
    setOpenDialog(true);
  };

  // カード追加・編集
  const handleSaveCard = async () => {
    try {
      let cardId = editCard?.id;
      if (editCard) {
        // 更新
        await axios.put(`${API_BASE}/cards/${editCard.id}`, {
          front,
          back,
        });
      } else {
        // 新規
        const res = await axios.post(`${API_BASE}/cards`, {
          notebook_id: notebookId,
          front,
          back,
          is_favorite: false,
        });
        cardId = res.data.id;
      }
      // タグ付与
      if (cardId) {
        // 既存タグを一旦全削除 (card.tagsが配列であることを確認)
        const oldTags = editCard?.tags && Array.isArray(editCard.tags) ? editCard.tags : [];
        for (const tag of oldTags) {
          if (!selectedTags.includes(tag.id)) {
            await axios.delete(`${API_BASE}/cards/${cardId}/tags/${tag.id}`);
          }
        }
        // 新規タグ付与
        for (const tagId of selectedTags) {
          if (!oldTags.find((t) => t.id === tagId)) {
            await axios.post(`${API_BASE}/cards/${cardId}/tags/${tagId}`);
          }
        }
      }
      setOpenDialog(false);
      fetchCards();
    } catch (error) {
      console.error("Failed to save card:", error);
    }
  };

  // カード削除
  const handleDeleteCard = async (cardId: number) => {
    try {
      await axios.delete(`${API_BASE}/cards/${cardId}`);
      fetchCards();
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  // お気に入りトグル
  const handleToggleFavorite = async (card: Card) => {
    try {
      await axios.put(`${API_BASE}/cards/${card.id}`, {
        is_favorite: !card.is_favorite,
      });
      fetchCards();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  // タグ新規作成
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const res = await axios.post(`${API_BASE}/tags`, { name: newTagName });
      if (res.data && res.data.id) {
        setTags([...tags, res.data]);
        setSelectedTags([...selectedTags, res.data.id]);
        setNewTagName("");
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
      alert("タグ作成に失敗しました（重複など）");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        単語帳詳細・編集（ID: {id}）
      </Typography>
      <Box mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          単語カード追加
        </Button>
      </Box>
      <Stack direction="row" spacing={2} mb={2}>
        <FormControl>
          <InputLabel>お気に入り</InputLabel>
          <Select
            value={filterFavorite === null ? "" : filterFavorite ? "1" : "0"}
            label="お気に入り"
            onChange={(e) => {
              const v = e.target.value;
              setFilterFavorite(v === "" ? null : v === "1");
            }}
            style={{ minWidth: 120 }}
          >
            <MenuItem value="">すべて</MenuItem>
            <MenuItem value="1">お気に入りのみ</MenuItem>
            <MenuItem value="0">お気に入り以外</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>ソート</InputLabel>
          <Select
            value={sortBy}
            label="ソート"
            onChange={(e) => setSortBy(e.target.value)}
            style={{ minWidth: 120 }}
          >
            <MenuItem value="created_at">作成日</MenuItem>
            <MenuItem value="front">表</MenuItem>
            <MenuItem value="back">裏</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>順序</InputLabel>
          <Select
            value={order}
            label="順序"
            onChange={(e) => setOrder(e.target.value)}
            style={{ minWidth: 120 }}
          >
            <MenuItem value="desc">降順</MenuItem>
            <MenuItem value="asc">昇順</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Box>
        {Array.isArray(cards) && cards.length > 0 ? (
          cards.map((card) => (
            <Box
              key={card.id}
              mb={2}
              p={2}
              border={1}
              borderRadius={2}
              borderColor="grey.300"
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  onClick={() => handleToggleFavorite(card)}
                  color={card.is_favorite ? "warning" : "default"}
                >
                  {card.is_favorite ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  <ReactMarkdown>{card.front}</ReactMarkdown>
                </Typography>
                <IconButton onClick={() => handleOpenDialog(card)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteCard(card.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
              <Box mt={1} mb={1}>
                <Typography variant="body2" color="textSecondary">
                  <ReactMarkdown>{card.back}</ReactMarkdown>
                </Typography>
              </Box>
              <Box>
                {card.tags && Array.isArray(card.tags) && card.tags.map((tag) => (
                  <Chip key={tag.id} label={tag.name} size="small" sx={{ mr: 1 }} />
                ))}
              </Box>
            </Box>
          ))
        ) : (
          <Typography>カードがありません。新規作成してください。</Typography>
        )}
      </Box>
      {/* カード追加・編集ダイアログ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editCard ? "単語カード編集" : "単語カード追加"}</DialogTitle>
        <DialogContent>
          <TextField
            label="表（Markdown可）"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="裏（Markdown可）"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            fullWidth
            margin="normal"
            multiline
          />
          <Box mt={2}>
            <Typography variant="subtitle2">タグ</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {Array.isArray(tags) && tags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  color={selectedTags.includes(tag.id) ? "primary" : "default"}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag.id)
                        ? prev.filter((id) => id !== tag.id)
                        : [...prev, tag.id]
                    );
                  }}
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Stack>
            <Box mt={1} display="flex" alignItems="center">
              <TextField
                label="新規タグ"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                size="small"
              />
              <Button onClick={handleCreateTag} variant="outlined" sx={{ ml: 1 }}>
                追加
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button onClick={handleSaveCard} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NotebookDetail;