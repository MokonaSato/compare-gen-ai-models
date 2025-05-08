import { Outlet } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider 
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Home as HomeIcon, 
  Book as BookIcon, 
  Bookmark as BookmarkIcon, 
  Label as LabelIcon 
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            単語帳管理アプリ
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
        >
          <List>
            <ListItem button onClick={() => handleNavigation('/')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="ホーム" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={() => handleNavigation('/')}>
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
              <ListItemText primary="単語帳一覧" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/?favorites=true')}>
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
              <ListItemText primary="お気に入り" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/?tags=true')}>
              <ListItemIcon>
                <LabelIcon />
              </ListItemIcon>
              <ListItemText primary="タグ管理" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', mt: 'auto' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} 単語帳管理アプリ
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;