import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button,
  Skeleton,
  Container,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import { supabase } from '../lib/supabase';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ProfileData {
  id: number;
  name: string;
  avatar_url: string;
  bio: string;
  achievements: string[];
  hero_image: string;
  tagline: string;
}

const Home = () => {
  interface Photo {
    id: number;
    url: string;
    title: string;
    description?: string;
    event_id?: number;
    event_name?: string;
    created_at: string;
  }
  
  interface ShowType {
    id: number;
    name: string;
  }
  
  interface Show {
    id: number;
    title: string;
    date: string;
    time: string;
    city: string;
    venue: string;
    description: string;
    ticket_price: string;
    ticket_link?: string;
    types?: number[]; // 演出类型ID数组
  }

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingShows, setUpcomingShows] = useState<Show[]>([]);
  const [showTypes, setShowTypes] = useState<ShowType[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  
  // 用于调试
  useEffect(() => {
    console.log('photos状态更新:', photos);
  }, [photos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取个人资料数据
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .single();

        if (profileError) {
          console.error('获取个人资料失败:', profileError);
        } else {
          setProfile(profileData);
        }

        // 获取演出类型数据
        const { data: typesData, error: typesError } = await supabase
          .from('show_types')
          .select('*');
          
        if (typesError) {
          console.error('获取演出类型失败:', typesError);
        } else {
          setShowTypes(typesData || []);
        }

        // 获取即将到来的演出
        const now = new Date().toISOString();
        const { data: showsData, error: showsError } = await supabase
          .from('shows')
          .select('*, show_type_relations(type_id)')
          .gt('date', now)
          .order('date', { ascending: true })
          .limit(10);

        if (showsError) {
          console.error('获取演出数据失败:', showsError);
        } else {
          // 处理演出类型数据
          const processedShows = showsData?.map(show => {
            const types = show.show_type_relations?.map((relation: { type_id: number }) => relation.type_id) || [];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { show_type_relations: _, ...showData } = show;
            return { ...showData, types };
          });
          
          setUpcomingShows(processedShows || []);
        }
        
        // 获取最新的3张照片
        try {
          console.log('开始获取照片数据');
          const { data: photosData, error: photosError } = await supabase
            .from('photos')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);
            
          if (photosError) {
            console.error('获取照片数据失败:', photosError);
          } else {
            console.log('首页获取的照片数据:', photosData);
            
            if (photosData && photosData.length > 0) {
              setPhotos(photosData);
            } else {
              console.log('没有获取到照片数据');
            }
          }
        } catch (photoError) {
          console.error('获取照片时发生异常:', photoError);
        }
      } catch (error) {
        console.error('数据获取失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 临时数据（当数据库中没有数据时使用）
  const tempProfile: ProfileData = {
    id: 1,
    name: '马达',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3',
    bio: '马达，常驻北京，是一名脱口秀舞台上的新生力量。擅长观察生活中的细节与荒谬，将日常生活的幽默与观众产生共鸣。我的风格以诙谐风趣为特色，常常以自嘲的方式呈现出生活的真实面貌，与观众一起分享我的创作和思想。',
    achievements: [
      '2022年全国脱口秀新人大赛冠军',
      '2021年笑果脱口秀节目最受欢迎演员',
      '2020年北京喜剧节最佳表演奖'
    ],
    hero_image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1412&auto=format&fit=crop&ixlib=rb-4.0.3',
    tagline: '用幽默连接世界，让笑声传递温暖'
  };
  
  // 临时照片数据
  const tempPhotos: Photo[] = [
    {
      id: 5,
      url: "https://ldvgspovldhuarkgpicu.supabase.co/storage/v1/object/public/photos/1753379854486_27.JPG",
      title: "IMG_3178",
      description: undefined,
      event_id: undefined,
      created_at: "2025-07-24 17:57:36.619+00"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      title: "幕后准备",
      description: "演出前的准备工作",
      event_id: 2,
      created_at: "2025-07-19 10:57:06.989505+00"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3",
      title: "舞台表演",
      description: "上海喜剧节开幕式演出",
      event_id: 3,
      created_at: "2025-07-14 10:57:06.989505+00"
    }
  ];

  const tempShows = [
    {
      id: 1,
      title: '周末笑声专场',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      time: '20:00',
      venue: '糖果LIVE',
      city: '北京',
      ticket_price: '120元起',
      types: [2, 5] // 单口, 其他
    },
    {
      id: 2,
      title: '脱口秀小剧场',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      time: '19:30',
      venue: '喜剧工厂',
      city: '上海',
      ticket_price: '100元起',
      types: [2] // 单口
    },
    {
      id: 3,
      title: '即兴喜剧之夜',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      time: '20:30',
      venue: '麻辣小剧场',
      city: '成都',
      ticket_price: '售票中',
      types: [1, 3, 6] // 主持, 比赛, 即兴
    }
  ];

  const displayProfile = profile || tempProfile;
  const displayShows = upcomingShows.length > 0 ? upcomingShows : tempShows;

  // 根据演出类型ID获取对应的颜色
  const getTypeColor = (typeId: number): string => {
    switch (typeId) {
      case 1: // 主持
        return '#4A6FA5'; // 稳重的蓝色
      case 2: // 单口
        return '#6B8E23'; // 橄榄绿
      case 3: // 比赛
        return '#B85C38'; // 温暖的橙红色
      case 4: // 商务演出
        return '#4B0082'; // 靛蓝色
      case 5: // 其他
        return '#708090'; // 深灰色
      case 6: // 即兴
        return '#C71585'; // 中等紫红色
      default:
        return '#8C7851'; // 默认颜色
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* 简约的个人信息头部 */}
      <Box sx={{ mb: 10, display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={displayProfile.avatar_url}
          alt={displayProfile.name}
          sx={{ 
            width: 80, 
            height: 80,
            mr: 3
          }}
        />
        <Typography variant="h1" sx={{ 
          fontSize: '2rem', 
          fontWeight: 500, 
          letterSpacing: '0.05em'
        }}>
          {loading ? <Skeleton width="200px" /> : displayProfile.name}
        </Typography>
      </Box>

      {/* 关于我 */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h2" sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          mb: 3,
          borderBottom: '1px solid #f0f0f0',
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <span role="img" aria-label="person">👤</span> 关于我
        </Typography>
        
        {loading ? (
          <>
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
          </>
        ) : (
          <Typography variant="body1" sx={{ 
            fontSize: '1rem', 
            lineHeight: 1.8,
            color: '#333',
            mb: 4
          }}>
            {displayProfile.bio}
          </Typography>
        )}
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h3" sx={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <span role="img" aria-label="trophy">🏆</span> 荣誉成就
          </Typography>
          
          {loading ? (
            <>
              <Skeleton variant="text" height={24} />
              <Skeleton variant="text" height={24} />
              <Skeleton variant="text" height={24} />
            </>
          ) : (
            <List disablePadding>
              {displayProfile.achievements.map((achievement, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ 
                    width: '4px', 
                    height: '4px', 
                    borderRadius: '50%', 
                    bgcolor: '#333',
                    mr: 2,
                    display: 'inline-block'
                  }} />
                  <ListItemText 
                    primary={achievement} 
                    primaryTypographyProps={{ 
                      sx: { fontSize: '0.95rem', fontWeight: 400 } 
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* 演出行程 */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end',
          mb: 3
        }}>
          <Typography variant="h2" sx={{ 
            fontSize: '1.5rem', 
            fontWeight: 700,
            borderBottom: '1px solid #f0f0f0',
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <span role="img" aria-label="calendar">📅</span> 演出行程
          </Typography>
          <Button 
            component={RouterLink} 
            to="/schedule" 
            sx={{ 
              color: '#333',
              fontSize: '0.875rem',
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                background: 'none',
                color: '#666'
              }
            }}
            endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
          >
            查看全部
          </Button>
        </Box>
        
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={50} />
          </>
        ) : displayShows.length > 0 ? (
          <TableContainer sx={{ bgcolor: '#FAF7F0', borderRadius: 0 }}>
            <Table sx={{ minWidth: 650 }} aria-label="演出行程表">
              <TableBody>
                {displayShows.map((show, index) => (
                    <TableRow
                      key={show.id}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        '& td': { borderBottom: '1px solid #f0f0f0', py: 2.5 },
                        bgcolor: index % 2 === 0 ? '#FAF7F0' : '#F5F2EA',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: index % 2 === 0 ? '#F7F4E8' : '#F2EFE5',
                          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
                          cursor: 'pointer'
                        }
                      }}
                    >
                    <TableCell component="th" scope="row" sx={{ pl: 3, width: '25%', border: 0 }}>
                      <Typography variant="body2" sx={{ color: '#444' }}>
                        {formatDate(show.date)} {show.time && 
                          <Typography component="span" sx={{ 
                            fontWeight: 700, 
                            color: '#000',
                            ml: 0.5
                          }}>
                            {show.time}
                          </Typography>
                        }
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: '30%', border: 0 }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {show.title}
                        </Typography>
                        {show.types && show.types.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {show.types.map((typeId) => {
                              const type = showTypes.find(t => t.id === typeId);
                              return type ? (
                                <Box 
                                  key={typeId} 
                                  sx={{ 
                                    fontSize: '0.7rem',
                                    bgcolor: getTypeColor(typeId),
                                    color: 'white',
                                    px: 1,
                                    py: 0.2,
                                    borderRadius: '4px',
                                    display: 'inline-block'
                                  }}
                                >
                                  {type.name}
                                </Box>
                              ) : null;
                            })}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: '20%', border: 0 }}>
                      <Typography variant="body2">
                        {show.city}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: '25%', border: 0, pr: 3 }}>
                      <Typography variant="body2">
                        {show.venue}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: '#666' }}>
            暂无即将到来的演出
          </Typography>
        )}
      </Box>

      {/* 剧照画廊 */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end',
          mb: 3
        }}>
          <Typography variant="h2" sx={{ 
            fontSize: '1.5rem', 
            fontWeight: 700,
            borderBottom: '1px solid #f0f0f0',
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <span role="img" aria-label="camera">📸</span> 剧照画廊
          </Typography>
          <Button 
            component={RouterLink} 
            to="/gallery" 
            sx={{ 
              color: '#333',
              fontSize: '0.875rem',
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                background: 'none',
                color: '#666'
              }
            }}
            endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
          >
            查看全部
          </Button>
        </Box>
        
        {/* 剧照画廊 - 横向自适应布局 */}
        <Box sx={{ mb: 10 }}>
          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : photos && photos.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {photos.map((photo) => (
                <Box 
                  key={photo.id} 
                  sx={{ 
                    flexGrow: 1,
                    flexBasis: '300px',
                    mb: 3
                  }}
                >
                  <Box 
                    component="div"
                    sx={{ 
                      width: '100%',
                      height: '300px',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      mb: 1,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    <Box
                      component="img"
                      src={photo.url}
                      alt={photo.title || '剧照'}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover', // 填满容器，可能会裁剪部分图片
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.03)'
                        }
                      }}
                      onClick={() => window.open(photo.url, '_blank')}
                    />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {photo.title || '精彩瞬间'}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            // 临时照片数据 - 横向自适应布局
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {tempPhotos.map((photo, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    flexGrow: 1,
                    flexBasis: '300px',
                    mb: 3
                  }}
                >
                  <Box 
                    component="div"
                    sx={{ 
                      width: '100%',
                      height: '300px',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      mb: 1,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    <Box
                      component="img"
                      src={photo.url}
                      alt={photo.title || '剧照'}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain', // 保持原始宽高比
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.03)'
                        }
                      }}
                      onClick={() => window.open(photo.url, '_blank')}
                    />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {photo.title || '精彩瞬间'}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
