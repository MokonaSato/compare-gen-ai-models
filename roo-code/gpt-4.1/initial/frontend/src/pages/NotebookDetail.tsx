import React from "react";
import { Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const NotebookDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        単語帳詳細・編集（ID: {id}）
      </Typography>
      {/* 単語カード一覧・編集UIなどをここに実装 */}
    </Container>
  );
};

export default NotebookDetail;