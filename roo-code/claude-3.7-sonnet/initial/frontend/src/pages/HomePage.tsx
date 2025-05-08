import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Fab,
  Box,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { useFlashcardStore } from '../hooks/useFlashcardStore';
import { FlashcardCreate } from '../types';

const HomePage = () => {
  const navigate = useNavigate();
  const { flashcards, createFlashcard, updateFlashcard, deleteFlashcard } = useFlashcardStore();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FlashcardCreate>({
    title: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleOpenCreateDialog = () => {
    setDialogMode('create');
    setFormData({ title: '', description: '' });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (id: number, title: string, description: string | null) => {
    setDialogMode('edit');
    setCurrentId(id);
    setFormData({ title, description: description || '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await createFlashcard(formData);
        setSnackbar({
          open: true,
          message: '単語帳を作成しました',
          severity: 'success'
        });
      } else if (dialogMode === 'edit' && currentId) {
        await updateFlashcard(currentId, formData);
        setSnackbar({
          open: true,
          message: '単語帳を更新しました',
          severity: 'success'
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('エラーが発生しました:', error);
      setSnackbar({
        open: true,
        message: '操作に失敗しました',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('この単語帳を削除してもよろしいですか？')) {
      try {
        await deleteFlashcard(id);
        setSnackbar({
          open: true,
          message: '単語帳を削除しました',
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

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          単語帳一覧
        </Typography>
        <Tooltip title="新しい単語帳を作成">
          <Fab color="primary" aria-label="add" onClick={handleOpenCreateDialog}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {flashcards.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary" align="center">
              単語帳がありません。「+」ボタンをクリックして新しい単語帳を作成してください。
            </Typography>
          </Grid>
        ) : (
          flashcards.map(flashcard => (
            <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {flashcard.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flashcard.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    カード数: {flashcard.card_count || 0}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/flashcards/${flashcard.id}`)}
                  >
                    詳細
                  </Button>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenEditDialog(
                      flashcard.id, 
                      flashcard.title, 
                      flashcard.description
                    )}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(flashcard.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* 単語帳作成・編集ダイアログ */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === 'create' ? '新しい単語帳を作成' : '単語帳を編集'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="タイトル"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="説明"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!formData.title}
          >
            {dialogMode === 'create' ? '作成' : '更新'}
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

export default HomePage;