import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Box, Container } from '@mui/material';

const Layout = () => {
  return (
    <Box className="flex flex-col min-h-screen bg-primary">
      <Header />
      <Box component="main" className="flex-grow py-6 md:py-10">
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;