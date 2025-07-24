import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Skeleton,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { supabase } from '../lib/supabase';

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

const Schedule = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [showTypes, setShowTypes] = useState<ShowType[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<string>('upcoming');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 获取演出类型数据
        const { data: typesData, error: typesError } = await supabase
          .from('show_types')
          .select('*');
          
        if (typesError) {
          console.error('获取演出类型失败:', typesError);
        } else {
          setShowTypes(typesData || []);
        }

        // 获取演出数据
        const { data: showsData, error: showsError } = await supabase
          .from('shows')
          .select('*, show_type_relations(type_id)')
          .order('date', { ascending: true });

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
          
          setShows(processedShows || []);
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
  const tempShows: Show[] = [
    {
      id: 1,
      title: '周末笑声专场',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      time: '20:00',
      venue: '糖果LIVE',
      city: '北京',
      description: '轻松愉快的周末时光，让我们一起在笑声中度过美好的夜晚。',
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
      description: '小剧场的温馨氛围，近距离感受脱口秀的魅力。',
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
      description: '充满惊喜的即兴表演，每一场都是独一无二的体验。',
      ticket_price: '售票中',
      types: [1, 3, 6] // 主持, 比赛, 即兴
    },
    {
      id: 4,
      title: '商务演出专场',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      time: '19:00',
      venue: '五星酒店宴会厅',
      city: '深圳',
      description: '为企业客户量身定制的专业演出。',
      ticket_price: '邀请制',
      types: [4] // 商务演出
    },
    {
      id: 5,
      title: '脱口秀大赛决赛',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      time: '20:00',
      venue: '大剧院',
      city: '广州',
      description: '年度脱口秀大赛的巅峰对决。',
      ticket_price: '已结束',
      types: [3] // 比赛
    }
  ];

  const displayShows = shows.length > 0 ? shows : tempShows;

  // 根据视图过滤演出
  const now = new Date();
  const filteredByTime = view === 'upcoming' 
    ? displayShows.filter(show => new Date(show.date) >= now)
    : displayShows.filter(show => new Date(show.date) < now);

  // 根据类型过滤演出
  const filteredShows = selectedType === 'all' 
    ? filteredByTime 
    : filteredByTime.filter(show => show.types?.includes(parseInt(selectedType)));

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: string | null,
  ) => {
    if (newView) {
      setView(newView);
    }
  };

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
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

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
        演出行程
      </Typography>

      {/* 控制栏 */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 3,
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between'
      }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          sx={{
            '& .MuiToggleButton-root': {
              px: 3,
              py: 1,
              border: '1px solid #e0e0e0',
              color: '#666',
              '&.Mui-selected': {
                bgcolor: '#FAF7F0',
                color: '#333',
                '&:hover': {
                  bgcolor: '#F5F2EA'
                }
              },
              '&:hover': {
                bgcolor: '#f5f5f5'
              }
            }
          }}
        >
          <ToggleButton value="upcoming">即将到来</ToggleButton>
          <ToggleButton value="past">过往演出</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>按类型筛选</InputLabel>
          <Select
            value={selectedType}
            label="按类型筛选"
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <MenuItem value="all">全部类型</MenuItem>
            {showTypes.map((type) => (
              <MenuItem key={type.id} value={type.id.toString()}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 演出列表 */}
      {loading ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {Array(6).fill(0).map((_, index) => (
            <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)', lg: '1 1 calc(25% - 18px)' }, minWidth: '280px' }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '12px' }} />
            </Box>
          ))}
        </Box>
      ) : filteredShows.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredShows.map((show) => (
            <Box key={show.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)', lg: '1 1 calc(25% - 18px)' }, minWidth: '280px' }}>
              <Paper 
                sx={{ 
                  p: 3,
                  height: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      fontSize: '1.2rem'
                    }}
                  >
                    {show.title}
                  </Typography>
                  
                  {show.types && show.types.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
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
                              py: 0.3,
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

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    📅 {formatDate(show.date)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    🕐 {formatTime(show.time)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    📍 {show.city} · {show.venue}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    🎫 {show.ticket_price}
                  </Typography>
                </Box>

                {show.description && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {show.description}
                  </Typography>
                )}
              </Paper>
            </Box>
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '12px' }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            {view === 'upcoming' ? '暂无即将到来的演出' : '暂无过往演出记录'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {selectedType === 'all' 
              ? '请稍后查看更新的演出信息' 
              : `暂无${showTypes.find(t => t.id.toString() === selectedType)?.name}类型的演出`
            }
          </Typography>
        </Paper>
      )}

      {/* 统计信息 */}
      {!loading && (
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {displayShows.filter(show => new Date(show.date) >= now).length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                即将到来
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {displayShows.filter(show => new Date(show.date) < now).length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                已完成演出
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {new Set(displayShows.map(show => show.city)).size}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                演出城市
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Schedule;