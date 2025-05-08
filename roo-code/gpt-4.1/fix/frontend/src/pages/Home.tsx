import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Notebook = {
  id: number;
  name: string;
  subject?: string;
  created_at?: string;
};

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const API_BASE = "";

const Home: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editNotebook, setEditNotebook] = useState<Notebook | null>(null);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const navigate = useNavigate();

  const fetchNotebooks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/notebooks`);
      console.log("Fetched notebooks:", res.data);
      // データが配列であることを確認
      if (Array.isArray(res.data)) {
        setNotebooks(res.data);
      } else {
        console.error("Expected array but got:", res.data);
        setNotebooks([]); // 空の配列をセット
      }
    } catch (error) {
      console.error("Failed to fetch notebooks:", error);
      setNotebooks([]);
    }
  };

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/notebooks/${id}`);
      fetchNotebooks();
    } catch (error) {
      console.error("Failed to delete notebook:", error);
    }
  };

  const handleEdit = (notebook: Notebook) => {
    setEditNotebook(notebook);
    setName(notebook.name);
    setSubject(notebook.subject || "");
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditNotebook(null);
    setName("");
    setSubject("");
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogSave = async () => {
    try {
      if (editNotebook) {
        await axios.put(`${API_BASE}/notebooks/${editNotebook.id}`, {
          name,
          subject,
        });
      } else {
        await axios.post(`${API_BASE}/notebooks`, {
          name,
          subject,
        });
      }
      setOpenDialog(false);
      fetchNotebooks();
    } catch (error) {
      console.error("Failed to save notebook:", error);
    }
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} mb={2}>
        <Typography variant="h4">単語帳一覧</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          新規作成
        </Button>
      </Box>
      <List>
        {Array.isArray(notebooks) && notebooks.length > 0 ? (
          notebooks.map((notebook) => (
            <ListItem
              key={notebook.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(notebook)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(notebook.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
              button
              onClick={() => navigate(`/notebooks/${notebook.id}`)}
            >
              <ListItemText
                primary={notebook.name}
                secondary={notebook.subject}
              />
            </ListItem>
          ))
        ) : (
          <Typography>単語帳がありません。新規作成してください。</Typography>
        )}
      </List>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{editNotebook ? "単語帳を編集" : "単語帳を新規作成"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="単語帳名"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="科目"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>キャンセル</Button>
          <Button onClick={handleDialogSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;