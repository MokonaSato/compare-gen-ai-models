import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Chip,
  FormControlLabel,
  Switch,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Fab,
  Tooltip,
  Snackbar,
  Alert,
  Paper,
  SelectChangeEvent
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Sort as SortIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { useFlashcardStore } from '../hooks/useFlashcardStore';
import { CardCreate, CardUpdate, TagCreate, SortOption, SortDirection } from '../types';

const FlashcardDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const flashcardId = parseInt(id || '0');
  
  const { 
    currentFlashcard, 
    cards, 
    tags,
    fetchFlashcardById, 
    fetchCards, 
    fetchTags,
    createCard, 
    updateCard, 
    deleteCard, 
    toggleFavorite,
    createTag,
    filterOptions,
    setFilterOptions,
    sortOption,
    setSortOption,
    sortDirection,
    setSortDirection
  } = useFlashcardStore();

  // ダイアログの状態
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);
  
  // フォームデータ
  const [cardFormData, setCardFormData] = useState<CardCreate>({
    front: '',
    back: '',
    is_favorite: false,
    tag_ids: []
  });
  
  // タグ関連の状態
  const [openTagDialog, setOpenTagDialog] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  
  // フィルター関連の状態
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [tempFilterOptions, setTempFilterOptions] = useState(filterOptions);
  
  // ソート関連の状態
  const [openSortDialog, setOpenSortDialog] = useState(false);
  const [tempSortOption, setTempSortOption] = useState<SortOption>(sortOption);
  const [tempSortDirection, setTempSortDirection] = useState<SortDirection>(sortDirection);
  
  // スナックバーの状態
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // 初期データの取得
  useEffect(() => {
    const fetchData = async () => {
      if (flashcardId) {
        await fetchFlashcardById(flashcardId);
        await fetchCards(flashcardId);
        await fetchTags();
      }
    };
    fetchData();
  }, [flashcardId, fetchFlashcardById, fetchCards, fetchTags]);

  // ソート済みのカードを取得
  const getSortedCards = () => {
    if (!cards) return [];
    
    return [...cards].sort((a, b) => {
      let comparison = 0;
      
      switch (sortOption) {
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'updated_at':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case 'front':
          comparison = a.front.localeCompare(b.front);
          break;
        case 'back':
          comparison = a.back.localeCompare(b.back);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // カードダイアログ関連のハンドラー
  const handleOpenCreateCardDialog = () => {
    setDialogMode('create');
    setCardFormData({
      front: '',
      back: '',
      is_favorite: false,
      tag_ids: []
    });
    setOpenCardDialog(true);
  };

  const handleOpenEditCardDialog = (cardId: number, card: CardUpdate) => {
    setDialogMode('edit');
    setCurrentCardId(cardId);
    setCardFormData({
      front: card.front || '',
      back: card.back || '',
      is_favorite: card.is_favorite || false,
      tag_ids: card.tag_ids || []
    });
    setOpenCardDialog(true);
  };

  const handleCloseCardDialog = () => {
    setOpenCardDialog(false);
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === 'is_favorite') {
      setCardFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setCardFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagSelect = (event: SelectChangeEvent<number[]>) => {
    const { value } = event.target;
    setCardFormData(prev => ({
      ...prev,
      tag_ids: typeof value === 'string' ? [] : value as number[]
    }));
  };

  const handleCardSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await createCard(flashcardId, cardFormData);
        setSnackbar({
          open: true,
          message: 'カードを作成しました',
          severity: 'success'
        });
      } else if (dialogMode === 'edit' && currentCardId) {
        await updateCard(currentCardId, cardFormData);
        setSnackbar({
          open: true,
          message: 'カードを更新しました',
          severity: 'success'
        });
      }
      handleCloseCardDialog();
    } catch (error) {
      console.error('エラーが発生しました:', error);
      setSnackbar({
        open: true,
        message: '操作に失敗しました',
        severity: 'error'
      });
    }
  };

  // カード操作のハンドラー
  const handleDeleteCard = async (cardId: number) => {
    if (window.confirm('このカードを削除してもよろしいですか？')) {
      try {
        await deleteCard(cardId);
        setSnackbar({
          open: true,
          message: 'カードを削除しました',
          severity: 'success'
        });
      } catch (error) {
        console.error('削除中にエラーが発生しました:', error);
        setSnackbar({
          open: true,
          message: '削除に失敗しました',
          severity: 'error'
        });
      }
    }
  };

  const handleToggleFavorite = async (cardId: number) => {
    try {
      await toggleFavorite(cardId);
    } catch (error) {
      console.error('お気に入り切り替え中にエラーが発生しました:', error);
      setSnackbar({
        open: true,
        message: 'お気に入り切り替えに失敗しました',
        severity: 'error'
      });
    }
  };

  // タグ関連のハンドラー
  const handleOpenTagDialog = () => {
    setNewTagName('');
    setOpenTagDialog(true);
  };

  const handleCloseTagDialog = () => {
    setOpenTagDialog(false);
  };

  const handleCreateTag = async () => {
    if (newTagName.trim()) {
      try {
        await createTag({ name: newTagName.trim() });
        setSnackbar({
          open: true,
          message: 'タグを作成しました',
          severity: 'success'
        });
        handleCloseTagDialog();
      } catch (error) {
        console.error('タグ作成中にエラーが発生しました:', error);
        setSnackbar({
          open: true,
          message: 'タグ作成に失敗しました',
          severity: 'error'
        });
      }
    }
  };

  // フィルター関連のハンドラー
  const handleOpenFilterDialog = () => {
    setTempFilterOptions({ ...filterOptions });
    setOpenFilterDialog(true);
  };

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const handleApplyFilter = () => {
    setFilterOptions(tempFilterOptions);
    handleCloseFilterDialog();
  };

  // ソート関連のハンドラー
  const handleOpenSortDialog = () => {
    setTempSortOption(sortOption);
    setTempSortDirection(sortDirection);
    setOpenSortDialog(true);
  };

  const handleCloseSortDialog = () => {
    setOpenSortDialog(false);
  };

  const handleApplySort = () => {
    setSortOption(tempSortOption);
    setSortDirection(tempSortDirection);
    handleCloseSortDialog();
  };

  // スナックバー関連のハンドラー
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!currentFlashcard) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>単語帳が見つかりません</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {currentFlashcard.title}
        </Typography>
      </Box>
      
      {currentFlashcard.description && (
        <Typography variant="body1" color="text.secondary" paragraph>
          {currentFlashcard.description}
        </Typography>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />} 
            onClick={handleOpenFilterDialog}
            sx={{ mr: 1 }}
          >
            フィルター
            {filterOptions.favorites_only && (
              <Chip 
                label="お気に入りのみ" 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }} 
              />
            )}
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<SortIcon />} 
            onClick={handleOpenSortDialog}
          >
            並び替え
          </Button>
        </Box>
        <Box>
          <Tooltip title="新しいタグを作成">
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />} 
              onClick={handleOpenTagDialog}
              sx={{ mr: 1 }}
            >
              タグ追加
            </Button>
          </Tooltip>
          <Tooltip title="新しいカードを作成">
            <Fab 
              color="primary" 
              size="medium" 
              aria-label="add" 
              onClick={handleOpenCreateCardDialog}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {getSortedCards().length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                カードがありません。「+」ボタンをクリックして新しいカードを作成してください。
              </Typography>
            </Paper>
          </Grid>
        ) : (
          getSortedCards().map(card => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {card.front}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <div className="markdown-content">
                    <ReactMarkdown>{card.back}</ReactMarkdown>
                  </div>
                  <Box mt={2}>
                    {card.tags.map(tag => (
                      <Chip 
                        key={tag.id} 
                        label={tag.name} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton 
                    onClick={() => handleToggleFavorite(card.id)}
                    color={card.is_favorite ? "secondary" : "default"}
                  >
                    {card.is_favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <IconButton onClick={() => handleOpenEditCardDialog(
                    card.id, 
                    {
                      front: card.front,
                      back: card.back,
                      is_favorite: card.is_favorite,
                      tag_ids: card.tags.map(tag => tag.id)
                    }
                  )}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCard(card.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* カード作成・編集ダイアログ */}
      <Dialog open={openCardDialog} onClose={handleCloseCardDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? '新しいカードを作成' : 'カードを編集'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="front"
            label="表面"
            type="text"
            fullWidth
            variant="outlined"
            value={cardFormData.front}
            onChange={handleCardInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="back"
            label="裏面 (Markdown形式)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={6}
            value={cardFormData.back}
            onChange={handleCardInputChange}
            required
            sx={{ mb: 2 }}
            helperText="Markdown形式で記述できます。例: # 見出し, **太字**, *斜体*, - リスト"
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="tags-select-label">タグ</InputLabel>
            <Select
              labelId="tags-select-label"
              id="tags-select"
              multiple
              value={cardFormData.tag_ids || []}
              onChange={handleTagSelect}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as number[]).map((tagId) => {
                    const tag = tags.find(t => t.id === tagId);
                    return tag ? (
                      <Chip key={tagId} label={tag.name} />
                    ) : null;
                  })}
                </Box>
              )}
            >
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={cardFormData.is_favorite}
                onChange={handleCardInputChange}
                name="is_favorite"
              />
            }
            label="お気に入り"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCardDialog}>キャンセル</Button>
          <Button 
            onClick={handleCardSubmit} 
            variant="contained" 
            disabled={!cardFormData.front || !cardFormData.back}
          >
            {dialogMode === 'create' ? '作成' : '更新'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* タグ作成ダイアログ */}
      <Dialog open={openTagDialog} onClose={handleCloseTagDialog}>
        <DialogTitle>新しいタグを作成</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="タグ名"
            type="text"
            fullWidth
            variant="outlined"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTagDialog}>キャンセル</Button>
          <Button 
            onClick={handleCreateTag} 
            variant="contained" 
            disabled={!newTagName.trim()}
          >
            作成
          </Button>
        </DialogActions>
      </Dialog>

      {/* フィルターダイアログ */}
      <Dialog open={openFilterDialog} onClose={handleCloseFilterDialog}>
        <DialogTitle>フィルター設定</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={!!tempFilterOptions.favorites_only}
                onChange={(e) => setTempFilterOptions(prev => ({ 
                  ...prev, 
                  favorites_only: e.target.checked 
                }))}
                name="favorites_only"
              />
            }
            label="お気に入りのみ表示"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFilterDialog}>キャンセル</Button>
          <Button onClick={handleApplyFilter} variant="contained">
            適用
          </Button>
        </DialogActions>
      </Dialog>

      {/* ソートダイアログ */}
      <Dialog open={openSortDialog} onClose={handleCloseSortDialog}>
        <DialogTitle>並び替え設定</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="sort-option-label">並び替え基準</InputLabel>
            <Select
              labelId="sort-option-label"
              value={tempSortOption}
              label="並び替え基準"
              onChange={(e) => setTempSortOption(e.target.value as SortOption)}
            >
              <MenuItem value="created_at">作成日</MenuItem>
              <MenuItem value="updated_at">更新日</MenuItem>
              <MenuItem value="front">表面</MenuItem>
              <MenuItem value="back">裏面</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="sort-direction-label">並び順</InputLabel>
            <Select
              labelId="sort-direction-label"
              value={tempSortDirection}
              label="並び順"
              onChange={(e) => setTempSortDirection(e.target.value as SortDirection)}
            >
              <MenuItem value="asc">昇順</MenuItem>
              <MenuItem value="desc">降順</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSortDialog}>キャンセル</Button>
          <Button onClick={handleApplySort} variant="contained">
            適用
          </Button>
        </DialogActions>
      </Dialog>

      {/* スナックバー */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FlashcardDetailPage;