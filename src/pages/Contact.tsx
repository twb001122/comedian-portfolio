import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Link,
  Skeleton,
  Avatar,
  Divider
} from '@mui/material';
import { supabase } from '../lib/supabase';
import EmailIcon from '@mui/icons-material/Email';

interface ContactInfo {
  id: number;
  email: string;
  phone?: string;
  xiaohongshu_id?: string;
  xiaohongshu_url?: string;
  other_contacts?: Record<string, string>;
}

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [profileData, setProfileData] = useState<{
    id: number;
    name: string;
    avatar_url: string;
    bio: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 获取联系方式数据
        const { data: contactData, error: contactError } = await supabase
          .from('contacts')
          .select('*')
          .single();
          
        if (contactError) {
          console.error('获取联系方式数据失败:', contactError);
        } else {
          setContactInfo(contactData);
        }
        
        // 获取个人资料数据
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .single();
          
        if (profileError) {
          console.error('获取个人资料数据失败:', profileError);
        } else {
          setProfileData(profileData);
        }
      } catch (error) {
        console.error('数据获取失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // 临时数据
  const tempContactInfo: ContactInfo = {
    id: 1,
    email: '1120490088@qq.com',
    phone: '+86 138 8888 8888',
    xiaohongshu_id: '@脱口秀马达',
    xiaohongshu_url: 'https://www.xiaohongshu.com/user/profile/54840dc82e1d934b1aa88842'
  };
  
  const displayContactInfo = contactInfo || tempContactInfo;
  
  return (
    <Box sx={{ py: 6, px: { xs: 2, sm: 4, md: 6 } }}>
      <Typography 
        variant="h1" 
        sx={{ 
          fontSize: { xs: '2rem', md: '2.5rem' }, 
          fontWeight: 700, 
          mb: 6,
          position: 'relative',
          display: 'inline-block',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: '-12px',
            left: 0,
            width: '60px',
            height: '3px',
            backgroundColor: '#FAF7F0',
            borderRadius: '2px'
          }
        }}
      >
        联系方式
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
              transform: 'translateY(-2px)'
            }
          }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                mb: 6 
              }}>
                {loading ? (
                  <Skeleton variant="circular" width={120} height={120} className="mb-4" />
                ) : (
                  <Avatar
                    src={profileData?.avatar_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3"}
                    alt="马达"
                    sx={{ 
                      width: 140, 
                      height: 140, 
                      mb: 3,
                      border: '4px solid white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                )}
                
                {loading ? (
                  <>
                    <Skeleton variant="text" width={150} height={40} />
                    <Skeleton variant="text" width={250} height={30} />
                  </>
                ) : (
                  <>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1.5,
                        fontSize: '1.5rem'
                      }}
                    >
                      马达
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '1rem',
                        letterSpacing: '0.5px'
                      }}
                    >
                      脱口秀演员 / 主持人 / 喜剧编剧
                    </Typography>
                  </>
                )}
              </Box>
              
              <Divider sx={{ 
                my: 4, 
                width: '80%', 
                mx: 'auto',
                borderColor: '#f0f0f0'
              }} />
              
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 3.5
              }}>
                {loading ? (
                  Array(4).fill(0).map((_, index) => (
                    <Skeleton key={index} variant="text" height={40} />
                  ))
                ) : (
                  <>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(4px)'
                      }
                    }}>
                      <EmailIcon sx={{ 
                        mr: 3, 
                        color: '#333',
                        fontSize: '1.8rem',
                        p: 0.8,
                        bgcolor: '#FAF7F0',
                        borderRadius: '50%'
                      }} />
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary', 
                            mb: 0.5,
                            fontSize: '0.85rem',
                            fontWeight: 500
                          }}
                        >
                          电子邮箱
                        </Typography>
                        <Link 
                          href={`mailto:${displayContactInfo.email}`} 
                          sx={{ 
                            color: '#333',
                            fontWeight: 500,
                            textDecoration: 'none',
                            '&:hover': {
                              color: '#000',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {displayContactInfo.email}
                        </Link>
                      </Box>
                    </Box>
                    
                    {displayContactInfo.xiaohongshu_id && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(4px)'
                        }
                      }}>
                        <Box sx={{ 
                          width: '2.8rem', 
                          height: '2.8rem', 
                          mr: 3, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: '#FAF7F0',
                          borderRadius: '50%'
                        }}>
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              bgcolor: '#FE2C55',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: '16px',
                                height: '16px',
                                bgcolor: 'white',
                                borderRadius: '3px'
                              },
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: '7px',
                                height: '7px',
                                bgcolor: '#FE2C55',
                                borderRadius: '50%',
                                zIndex: 1
                              }
                            }}
                          />
                        </Box>
                        <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary', 
                            mb: 0.5,
                            fontSize: '0.85rem',
                            fontWeight: 500
                          }}
                        >
                          小红书
                        </Typography>
                          <Link 
                            href={displayContactInfo.xiaohongshu_url || "https://www.xiaohongshu.com/user/profile/54840dc82e1d934b1aa88842"} 
                            target="_blank"
                            sx={{ 
                              color: '#333',
                              fontWeight: 500,
                              textDecoration: 'none',
                              '&:hover': {
                                color: '#000',
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            {displayContactInfo.xiaohongshu_id}
                          </Link>
                        </Box>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
              transform: 'translateY(-2px)'
            }
          }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 4,
                  fontSize: '1.5rem',
                  position: 'relative',
                  display: 'inline-block',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '40px',
                    height: '2px',
                    backgroundColor: '#FAF7F0',
                    borderRadius: '2px'
                  }
                }}
              >
                演出预约与合作
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 5, 
                  lineHeight: 1.7,
                  color: '#555',
                  fontSize: '1rem'
                }}
              >
                如果您有演出邀请、商务合作或媒体采访需求，请通过以下方式联系：
              </Typography>
              
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 3.5,
                mb: 5
              }}>
                {loading ? (
                  <Skeleton variant="text" height={40} />
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateX(4px)'
                    }
                  }}>
                    <EmailIcon sx={{ 
                      mr: 3, 
                      color: '#333',
                      fontSize: '1.8rem',
                      p: 0.8,
                      bgcolor: '#FAF7F0',
                      borderRadius: '50%'
                    }} />
                    <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary', 
                            mb: 0.5,
                            fontSize: '0.85rem',
                            fontWeight: 500
                          }}
                        >
                          电子邮箱
                        </Typography>
                      <Link 
                        href={`mailto:${displayContactInfo.email}`}
                        sx={{ 
                          color: '#333',
                          fontWeight: 500,
                          textDecoration: 'none',
                          '&:hover': {
                            color: '#000',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {displayContactInfo.email}
                      </Link>
                    </Box>
                  </Box>
                )}
                
                {loading ? (
                  <Skeleton variant="text" height={40} />
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateX(4px)'
                    }
                  }}>
                    <Box sx={{ 
                      width: '2.8rem', 
                      height: '2.8rem', 
                      mr: 3, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: '#FAF7F0',
                      borderRadius: '50%'
                    }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: '#FE2C55',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '14px',
                            height: '14px',
                            bgcolor: 'white',
                            borderRadius: '2px'
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: '6px',
                            height: '6px',
                            bgcolor: '#FE2C55',
                            borderRadius: '50%',
                            zIndex: 1
                          }
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" className="mb-1">
                        小红书
                      </Typography>
                      <Link 
                        href={displayContactInfo.xiaohongshu_url || "https://www.xiaohongshu.com/user/profile/54840dc82e1d934b1aa88842"} 
                        target="_blank"
                        sx={{ 
                          color: '#333',
                          fontWeight: 500,
                          textDecoration: 'none',
                          '&:hover': {
                            color: '#000',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {displayContactInfo.xiaohongshu_id}
                      </Link>
                    </Box>
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ 
                my: 4, 
                width: '80%', 
                mx: 'auto',
                borderColor: '#f0f0f0'
              }} />
              
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  fontSize: '1.2rem'
                }}
              >
                演出城市
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                {loading ? (
                  Array(6).fill(0).map((_, index) => (
                    <Box key={index} sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '120px' }}>
                      <Skeleton variant="text" height={30} />
                    </Box>
                  ))
                ) : (
                  ['北京', '上海', '广州', '深圳', '成都', '杭州'].map((city) => (
                    <Box key={city} sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '120px' }}>
                      <Box sx={{ 
                        textAlign: 'center', 
                        p: 1.5, 
                        bgcolor: '#FAF7F0',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: '#F5F2EA',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }
                      }}>
                        <Typography sx={{ fontWeight: 500 }}>{city}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;