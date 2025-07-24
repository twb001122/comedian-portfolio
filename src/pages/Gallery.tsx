import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Skeleton,
  Dialog,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { supabase } from '../lib/supabase';
import CloseIcon from '@mui/icons-material/Close';

interface Photo {
  id: number;
  url: string;
  title: string;
  description?: string;
  event_id?: number;
  event_name?: string;
  created_at: string;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('all');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const { data: photosData, error: photosError } = await supabase
          .from('photos')
          .select('*')
          .order('created_at', { ascending: false });

        if (photosError) {
          console.error('获取照片数据失败:', photosError);
        } else {
          setPhotos(photosData || []);
        }
      } catch (error) {
        console.error('数据获取失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // 临时照片数据
  const tempPhotos: Photo[] = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      title: "舞台表演",
      description: "北京喜剧节开幕式演出",
      event_id: 1,
      event_name: "北京喜剧节",
      created_at: "2025-01-20 10:57:06.989505+00"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      title: "观众互动",
      description: "与观众的精彩互动瞬间",
      event_id: 1,
      event_name: "北京喜剧节",
      created_at: "2025-01-19 10:57:06.989505+00"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3",
      title: "舞台表演",
      description: "上海喜剧节开幕式演出",
      event_id: 3,
      event_name: "上海喜剧节",
      created_at: "2025-01-14 10:57:06.989505+00"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      title: "幕后准备",
      description: "演出前的准备工作",
      event_id: 2,
      event_name: "深圳脱口秀专场",
      created_at: "2025-01-19 10:57:06.989505+00"
    },
    {
      id: 5,
      url: "https://ldvgspovldhuarkgpicu.supabase.co/storage/v1/object/public/photos/1753379854486_27.JPG",
      title: "IMG_3178",
      description: undefined,
      event_id: undefined,
      created_at: "2025-01-24 17:57:36.619+00"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3",
      title: "台下交流",
      description: "演出结束后与观众的交流",
      event_id: 2,
      event_name: "深圳脱口秀专场",
      created_at: "2025-01-18 10:57:06.989505+00"
    }
  ];

  const displayPhotos = photos.length > 0 ? photos : tempPhotos;

  // 获取所有事件
  const allEvents = Array.from(
    new Set(displayPhotos.filter(photo => photo.event_name).map(photo => photo.event_name))
  ).map((name, index) => ({ id: index + 1, name: name! }));

  // 根据选择的事件过滤照片
  const filteredPhotos = selectedEvent === 'all' 
    ? displayPhotos 
    : displayPhotos.filter(photo => photo.event_name === selectedEvent);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseDialog = () => {
    setSelectedPhoto(null);
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
        剧照画廊
      </Typography>

      {/* 筛选器 */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>按活动筛选</InputLabel>
          <Select
            value={selectedEvent}
            label="按活动筛选"
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <MenuItem value="all">全部照片</MenuItem>
            {allEvents.map((event) => (
              <MenuItem key={event.id} value={event.name}>
                {event.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 照片网格 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {loading ? (
          Array(6).fill(0).map((_, index) => (
            <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' }, minWidth: '300px' }}>
              <Skeleton variant="rectangular" height={300} />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </Box>
          ))
        ) : filteredPhotos.length > 0 ? (
          filteredPhotos.map((photo) => (
            <Box key={photo.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' }, minWidth: '300px' }}>
              <Paper 
                sx={{ 
                  overflow: 'hidden',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}
                onClick={() => handlePhotoClick(photo)}
              >
                <Box
                  component="img"
                  src={photo.url}
                  alt={photo.title || '剧照'}
                  sx={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <Box sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      fontSize: '1.1rem'
                    }}
                  >
                    {photo.title || '精彩瞬间'}
                  </Typography>
                  {photo.description && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        mb: 1,
                        lineHeight: 1.5
                      }}
                    >
                      {photo.description}
                    </Typography>
                  )}
                  {photo.event_name && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'primary.main',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    >
                      {photo.event_name}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>
          ))
        ) : (
          <Box sx={{ 
            width: '100%', 
            textAlign: 'center', 
            py: 8,
            color: 'text.secondary'
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              暂无照片
            </Typography>
            <Typography variant="body2">
              {selectedEvent === 'all' ? '还没有上传任何照片' : `${selectedEvent} 活动暂无照片`}
            </Typography>
          </Box>
        )}
      </Box>

      {/* 照片详情对话框 */}
      <Dialog
        open={!!selectedPhoto}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        {selectedPhoto && (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: 1,
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={selectedPhoto.url}
              alt={selectedPhoto.title || '剧照'}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedPhoto.title || '精彩瞬间'}
              </Typography>
              {selectedPhoto.description && (
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {selectedPhoto.description}
                </Typography>
              )}
              {selectedPhoto.event_name && (
                <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 500 }}>
                  活动：{selectedPhoto.event_name}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default Gallery;