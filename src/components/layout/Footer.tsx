import { Box, Container, Typography, Link } from '@mui/material';
import { Email } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className="bg-white py-6 mt-auto border-t border-gray-200">
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'space-between' }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
            <Typography variant="h6" className="font-bold mb-2 text-secondary">
              马达的演出行程
            </Typography>
            <Typography variant="body2" className="text-secondary-light">
              Comedy Brings People Together
            </Typography>
          </Box>
          
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" className="font-medium mb-2 text-secondary">
              关注我
            </Typography>
            <Box className="flex space-x-4">
              <Link href="https://www.xiaohongshu.com/user/profile/54840dc82e1d934b1aa88842" target="_blank" color="inherit" className="hover:text-accent">
                <Box className="w-6 h-6 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="#FE2C55"/>
                    <path d="M17.5 7.5H6.5C6.5 7.5 6 8 6 8.5V15.5C6 16 6.5 16.5 7 16.5H17C17.5 16.5 18 16 18 15.5V8.5C18 8 17.5 7.5 17.5 7.5Z" fill="white"/>
                    <path d="M12 10.5C13.1046 10.5 14 11.3954 14 12.5C14 13.6046 13.1046 14.5 12 14.5C10.8954 14.5 10 13.6046 10 12.5C10 11.3954 10.8954 10.5 12 10.5Z" fill="#FE2C55"/>
                  </svg>
                </Box>
              </Link>
              <Link href="mailto:1120490088@qq.com" color="inherit" className="hover:text-accent">
                <Email />
              </Link>
            </Box>
          </Box>
          
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="body2" className="text-secondary-light">
              © {currentYear} 脱口秀艺人. 保留所有权利.
            </Typography>
            <Box className="mt-1">
              <Link href="/admin/login" className="text-sm text-secondary-light hover:text-accent">
                管理入口
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;