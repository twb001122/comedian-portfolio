import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const navItems = [
  { name: '首页', path: '/' },
  { name: '演出行程', path: '/schedule' },
  { name: '剧照画廊', path: '/gallery' },
  { name: '联系方式', path: '/contact' }
];

const adminItem = { name: '管理后台', path: '/admin/login' };

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} className="p-4">
      <Typography variant="h6" className="mb-4 font-bold text-center">
        马达的演出行程
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.name} 
            component={RouterLink} 
            to={item.path}
            className={`rounded-md ${location.pathname === item.path ? 'bg-primary-dark' : ''}`}
          >
            <ListItemText 
              primary={item.name} 
              className={`text-center ${location.pathname === item.path ? 'font-medium' : ''}`}
            />
          </ListItem>
        ))}
        <ListItem 
          key={adminItem.name} 
          component={RouterLink} 
          to={adminItem.path}
          className={`rounded-md ${location.pathname === adminItem.path ? 'bg-primary-dark' : ''}`}
        >
          <ListItemText 
            primary={adminItem.name} 
            className={`text-center ${location.pathname === adminItem.path ? 'font-medium' : ''}`}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={0} className="bg-white border-b border-gray-200">
      <Container maxWidth="lg">
        <Toolbar disableGutters className="flex justify-between">
          <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="h6"
              className="text-secondary font-bold"
            >
              马达的演出行程
            </Typography>
            <Typography
              variant="caption"
              className="text-secondary-light"
              sx={{ 
                fontSize: '0.7rem', 
                letterSpacing: '0.05em',
                mt: -0.5
              }}
            >
              Comedy Brings People Together
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="打开菜单"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box className="flex">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    mx: 1,
                    fontWeight: 500,
                    color: location.pathname === item.path ? '#1976d2' : '#111111',
                    '&:hover': { 
                      bgcolor: 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
              <Button
                component={RouterLink}
                to={adminItem.path}
                sx={{ 
                  mx: 1,
                  fontWeight: 500,
                  color: location.pathname === adminItem.path ? '#1976d2' : '#111111',
                  '&:hover': { 
                    bgcolor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                {adminItem.name}
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // 为了更好的移动端性能
        }}
        className="block md:hidden"
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;