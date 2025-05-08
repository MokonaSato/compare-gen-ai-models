import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FlashcardDetailPage from './pages/FlashcardDetailPage';
import { useFlashcardStore } from './hooks/useFlashcardStore';

function App() {
  const [loading, setLoading] = useState(true);
  const { fetchFlashcards } = useFlashcardStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await fetchFlashcards();
      } catch (error) {
        console.error('アプリケーションの初期化中にエラーが発生しました:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [fetchFlashcards]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="flashcards/:id" element={<FlashcardDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;