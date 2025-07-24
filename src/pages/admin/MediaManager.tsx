import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  IconButton, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  Paper
} from '@mui/material';
import { supabase } from '../../lib/supabase';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';

interface Photo {
  id: number;
  url: string;
  title: string;
  description?: string;
  event_id?: number;
  event_name?: string;
  created_at: string;
}

interface Event {
  id: number;
  name: string;
}

const MediaManager = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // 表单状态
  const [photoForm, setPhotoForm] = useState({
    title: '',
    description: '',
    event_id: '',
    file: null as File | null
  });

  const fetchPhotosAndEvents = async () => {
    try {
      setLoading(true);
      
      // 获取照片数据
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (photosError) {
        console.error('获取照片数据失败:', photosError);
        setSnackbar({ open: true, message: '获取照片数据失败', severity: 'error' });
      } else {
        setPhotos(photosData || []);
      }
      
      // 获取活动数据
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('name');
        
      if (eventsError) {
        console.error('获取活动数据失败:', eventsError);
      } else {
        setEvents(eventsData || []);
      }
    } catch (error) {
      console.error('数据获取失败:', error);
      setSnackbar({ open: true, message: '数据获取失败', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotosAndEvents();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoForm({ ...photoForm, file });
    }
  };

  const handleUpload = async () => {
    if (!photoForm.file || !photoForm.title) {
      setSnackbar({ open: true, message: '请选择文件并填写标题', severity: 'error' });
      return;
    }

    try {
      setUploading(true);
      
      // 上传文件到 Supabase Storage
      const fileExt = photoForm.file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, photoForm.file);

      if (uploadError) {
        throw uploadError;
      }

      // 获取公共URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      // 保存照片信息到数据库
      const { error: insertError } = await supabase
        .from('photos')
        .insert({
          url: publicUrl,
          title: photoForm.title,
          description: photoForm.description || null,
          event_id: photoForm.event_id ? parseInt(photoForm.event_id) : null
        });

      if (insertError) {
        throw insertError;
      }

      setSnackbar({ open: true, message: '照片上传成功', severity: 'success' });
      setPhotoForm({ title: '', description: '', event_id: '', file: null });
      
      // 刷新页面重新获取数据
      setLoading(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('上传失败:', error);
      setSnackbar({ open: true, message: '上传失败', severity: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setPhotoForm({
      title: photo.title,
      description: photo.description || '',
      event_id: photo.event_id?.toString() || '',
      file: null
    });
  };

  const handleUpdate = async () => {
    if (!editingPhoto || !photoForm.title) {
      setSnackbar({ open: true, message: '请填写标题', severity: 'error' });
      return;
    }

    try {
      const { error } = await supabase
        .from('photos')
        .update({
          title: photoForm.title,
          description: photoForm.description || null,
          event_id: photoForm.event_id ? parseInt(photoForm.event_id) : null
        })
        .eq('id', editingPhoto.id);

      if (error) {
        throw error;
      }

      setSnackbar({ open: true, message: '照片信息更新成功', severity: 'success' });
      setEditingPhoto(null);
      setPhotoForm({ title: '', description: '', event_id: '', file: null });
      fetchPhotosAndEvents();
    } catch (error) {
      console.error('更新失败:', error);
      setSnackbar({ open: true, message: '更新失败', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (selectedPhotos.length === 0) return;

    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .in('id', selectedPhotos);

      if (error) {
        throw error;
      }

      setSnackbar({ open: true, message: `成功删除 ${selectedPhotos.length} 张照片`, severity: 'success' });
      setSelectedPhotos([]);
      setDeleteDialogOpen(false);
      fetchPhotosAndEvents();
    } catch (error) {
      console.error('删除失败:', error);
      setSnackbar({ open: true, message: '删除失败', severity: 'error' });
    }
  };

  const handlePhotoSelect = (photoId: number) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map(photo => photo.id));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        媒体管理
      </Typography>

      {/* 上传区域 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          上传新照片
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="photo-upload"
          />
          <label htmlFor="photo-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
            >
              选择图片文件
            </Button>
          </label>
          
          {photoForm.file && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              已选择: {photoForm.file.name}
            </Typography>
          )}
          
          <TextField
            label="照片标题"
            value={photoForm.title}
            onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
            required
            fullWidth
          />
          
          <TextField
            label="照片描述"
            value={photoForm.description}
            onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
            multiline
            rows={3}
            fullWidth
          />
          
          <FormControl fullWidth>
            <InputLabel>关联活动（可选）</InputLabel>
            <Select
              value={photoForm.event_id}
              label="关联活动（可选）"
              onChange={(e) => setPhotoForm({ ...photoForm, event_id: e.target.value })}
            >
              <MenuItem value="">无关联活动</MenuItem>
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id.toString()}>
                  {event.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Button
          variant="contained"
          onClick={editingPhoto ? handleUpdate : handleUpload}
          disabled={uploading || !photoForm.title}
          sx={{
            bgcolor: '#FAF7F0',
            color: '#333',
            '&:hover': {
              bgcolor: '#F5F2EA'
            }
          }}
        >
          {uploading ? '上传中...' : editingPhoto ? '更新照片' : '上传照片'}
        </Button>
        
        {editingPhoto && (
          <Button
            variant="outlined"
            onClick={() => {
              setEditingPhoto(null);
              setPhotoForm({ title: '', description: '', event_id: '', file: null });
            }}
            sx={{ ml: 2 }}
          >
            取消编辑
          </Button>
        )}
        
        {uploading && <LinearProgress sx={{ mt: 2 }} />}
      </Paper>

      {/* 批量操作 */}
      {photos.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedPhotos.length === photos.length}
                indeterminate={selectedPhotos.length > 0 && selectedPhotos.length < photos.length}
                onChange={handleSelectAll}
              />
            }
            label="全选"
          />
          
          {selectedPhotos.length > 0 && (
            <>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                已选择 {selectedPhotos.length} 张照片
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                删除选中
              </Button>
            </>
          )}
        </Box>
      )}

      {/* 照片网格 */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>加载中...</Typography>
        </Box>
      ) : photos.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {photos.map((photo) => (
            <Box key={photo.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' }, minWidth: '280px' }}>
              <Card sx={{ 
                position: 'relative',
                '&:hover .photo-actions': {
                  opacity: 1
                }
              }}>
                <Box sx={{ position: 'relative' }}>
                  <Checkbox
                    checked={selectedPhotos.includes(photo.id)}
                    onChange={() => handlePhotoSelect(photo.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      zIndex: 1
                    }}
                  />
                  <Box
                    component="img"
                    src={photo.url}
                    alt={photo.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover'
                    }}
                  />
                  <Box
                    className="photo-actions"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      display: 'flex',
                      gap: 1
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(photo)}
                      sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {photo.title}
                  </Typography>
                  {photo.description && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {photo.description}
                    </Typography>
                  )}
                  {photo.event_name && (
                    <Typography variant="caption" sx={{ color: 'primary.main' }}>
                      活动: {photo.event_name}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 1 }}>
                    上传时间: {new Date(photo.created_at).toLocaleDateString('zh-CN')}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <ImageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            暂无照片
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            点击上方的"选择图片文件"按钮开始上传照片
          </Typography>
        </Paper>
      )}

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除选中的 {selectedPhotos.length} 张照片吗？此操作不可撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 消息提示 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MediaManager;