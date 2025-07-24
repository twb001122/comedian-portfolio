import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 前台页面
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// 后台页面
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProfileEditor from './pages/admin/ProfileEditor';
import ScheduleManager from './pages/admin/ScheduleManager';
import MediaManager from './pages/admin/MediaManager';
import Login from './pages/admin/Login';

// 创建主题
const theme = createTheme({
  palette: {
    primary: {
      light: '#FFFFFF',
      main: '#F5F2EA', // 米色
      dark: '#E5E0D5',
      contrastText: '#333333',
    },
    secondary: {
      light: '#4A4A4A',
      main: '#333333', // 深灰
      dark: '#222222',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F2EA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "sans-serif"',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* 前台路由 */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          
          {/* 后台路由 */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfileEditor />} />
            <Route path="schedule" element={<ScheduleManager />} />
            <Route path="media" element={<MediaManager />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;