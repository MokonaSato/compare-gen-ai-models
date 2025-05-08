import React from "react";
import { Container, Typography } from "@mui/material";

const Home: React.FC = () => (
  <Container>
    <Typography variant="h4" gutterBottom>
      単語帳一覧
    </Typography>
    {/* 単語帳リスト・追加ボタンなどをここに実装 */}
  </Container>
);

export default Home;