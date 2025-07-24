import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Skeleton
} from '@mui/material';
import { supabase } from '../../lib/supabase';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';

interface DashboardStats {
  totalShows: number;
  upcomingShows: number;
  totalPhotos: number;
  recentActivity: Array<{
    id: number;
    type: string;
    title: string;
    date: string;
  }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalShows: 0,
    upcomingShows: 0,
    totalPhotos: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // 获取演出统计
        const { data: showsData, error: showsError } = await supabase
          .from('shows')
          .select('*');
          
        if (showsError) {
          console.error('获取演出数据失败:', showsError);
        }
        
        // 获取照片统计
        const { data: photosData, error: photosError } = await supabase
          .from('photos')
          .select('*');
          
        if (photosError) {
          console.error('获取照片数据失败:', photosError);
        }
        
        const now = new Date().toISOString();
        const upcomingShows = showsData?.filter(show => show.date > now).length || 0;
        
        setStats({
          totalShows: showsData?.length || 0,
          upcomingShows,
          totalPhotos: photosData?.length || 0,
          recentActivity: [
            {
              id: 1,
              type: 'show',
              title: '新增演出：周末笑声专场',
              date: '2024-01-20'
            },
            {
              id: 2,
              type: 'photo',
              title: '上传了3张新照片',
              date: '2024-01-19'
            },
            {
              id: 3,
              type: 'profile',
              title: '更新了个人资料',
              date: '2024-01-18'
            }
          ]
        });
      } catch (error) {
        console.error('数据获取失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: '添加新演出',
      description: '创建新的演出安排',
      icon: <EventIcon />,
      link: '/admin/schedule',
      color: '#4A6FA5'
    },
    {
      title: '上传照片',
      description: '管理剧照和媒体文件',
      icon: <PhotoLibraryIcon />,
      link: '/admin/media',
      color: '#6B8E23'
    },
    {
      title: '编辑资料',
      description: '更新个人信息和简介',
      icon: <PersonIcon />,
      link: '/admin/profile',
      color: '#B85C38'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        管理面板
      </Typography>

      {/* 统计卡片 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' }, minWidth: '200px' }}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                  <Skeleton variant="text" width="40%" height={50} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    总演出数
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {stats.totalShows}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' }, minWidth: '200px' }}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                  <Skeleton variant="text" width="40%" height={50} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    即将到来
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {stats.upcomingShows}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' }, minWidth: '200px' }}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                  <Skeleton variant="text" width="40%" height={50} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    照片总数
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {stats.totalPhotos}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 主要内容区域 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* 快速操作 */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              快速操作
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  component={RouterLink}
                  to={action.link}
                  variant="outlined"
                  startIcon={action.icon}
                  sx={{
                    p: 2,
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    borderColor: action.color,
                    color: action.color,
                    '&:hover': {
                      borderColor: action.color,
                      bgcolor: `${action.color}10`
                    }
                  }}
                >
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {action.description}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* 最近活动 */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              最近活动
            </Typography>
            
            {loading ? (
              <Box>
                {Array(3).fill(0).map((_, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </Box>
                ))}
              </Box>
            ) : (
              <List disablePadding>
                {stats.recentActivity.map((activity) => (
                  <ListItem key={activity.id} disablePadding sx={{ mb: 1 }}>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Chip
                          label={activity.type === 'show' ? '演出' : activity.type === 'photo' ? '照片' : '资料'}
                          size="small"
                          sx={{
                            mr: 1,
                            bgcolor: activity.type === 'show' ? '#4A6FA5' : activity.type === 'photo' ? '#6B8E23' : '#B85C38',
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {activity.date}
                        </Typography>
                      </Box>
                      <ListItemText
                        primary={activity.title}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontWeight: 500 }
                        }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Box>

      {/* 底部操作栏 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
          sx={{ mr: 2 }}
        >
          返回前台
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/admin/schedule"
          sx={{
            bgcolor: '#FAF7F0',
            color: '#333',
            '&:hover': {
              bgcolor: '#F5F2EA'
            }
          }}
        >
          添加新演出
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;