import { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LogoutIcon from '@mui/icons-material/Logout';
import { supabase } from '../../lib/supabase';

const drawerWidth = 240;

const menuItems = [
  { name: '仪表盘', path: '/admin', icon: <DashboardIcon /> },
  { name: '个人信息', path: '/admin/profile', icon: <PersonIcon /> },
  { name: '演出行程', path: '/admin/schedule', icon: <EventIcon /> },
  { name: '媒体管理', path: '/admin/media', icon: <PhotoLibraryIcon /> },
];

const AdminLayout = () => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // 检查用户是否已登录
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/admin/login');
      }
      setLoading(false);
    };
    
    checkUser();
  }, [navigate]);

  useEffect(() => {
    // 在移动设备上默认关闭抽屉
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography>加载中...</Typography>
      </Box>
    );
  }

  return (
    <Box className="flex">
      <AppBar 
        position="fixed" 
        className={`bg-white text-secondary ${open ? `ml-[${drawerWidth}px]` : 'ml-0'} transition-all duration-200`}
        sx={{ 
          width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: open ? `${drawerWidth}px` : 0 }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="打开菜单"
            edge="start"
            onClick={handleDrawerToggle}
            className="mr-2"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" className="font-medium">
            脱口秀艺人管理后台
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        className="w-[240px]"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box className="flex items-center justify-between p-4">
          <Typography variant="h6" className="font-bold">
            管理面板
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.name} 
              component={RouterLink}
              to={item.path}
              className="hover:bg-primary"
            >
              <ListItemIcon className="text-secondary">
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem onClick={handleLogout} className="hover:bg-primary">
            <ListItemIcon className="text-secondary">
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="退出登录" />
          </ListItem>
        </List>
      </Drawer>

      <Box 
        component="main" 
        className="flex-grow p-6"
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: open ? `${drawerWidth}px` : 0 },
          mt: '64px', // AppBar height
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container maxWidth="lg" className="py-4">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;