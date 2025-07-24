import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
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
  Paper,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { zhCN } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';

interface Show {
  id: number;
  title: string;
  description?: string;
  venue: string;
  date: string;
  time: string;
  ticket_price?: number;
  ticket_url?: string;
  show_type: string;
  show_type_id?: number;
  created_at: string;
}

interface ShowType {
  id: number;
  name: string;
  description?: string;
}

const ScheduleManager = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [showTypes, setShowTypes] = useState<ShowType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showToDelete, setShowToDelete] = useState<Show | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // 表单状态
  const [showForm, setShowForm] = useState({
    title: '',
    description: '',
    venue: '',
    date: new Date(),
    ticket_price: '',
    ticket_url: '',
    show_type: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 先获取演出类型数据
      const { data: typesData, error: typesError } = await supabase
        .from('show_types')
        .select('*')
        .order('name');
        
      if (typesError) {
        console.error('获取演出类型失败:', typesError);
        setSnackbar({ open: true, message: '获取演出类型失败', severity: 'error' });
      } else {
        setShowTypes(typesData || []);
      }
      
      // 获取演出数据
      const { data: showsData, error: showsError } = await supabase
        .from('shows')
        .select('*')
        .order('date', { ascending: true });
        
      if (showsError) {
        console.error('获取演出数据失败:', showsError);
        setSnackbar({ open: true, message: '获取演出数据失败', severity: 'error' });
      } else {
        // 合并演出类型名称
        const processedShows = (showsData || []).map(show => {
          const showType = (typesData || []).find(type => type.id === show.show_type_id);
          return {
            ...show,
            show_type: showType?.name || '未分类'
          };
        });
        setShows(processedShows);
      }
    } catch (error) {
      console.error('数据获取失败:', error);
      setSnackbar({ open: true, message: '数据获取失败', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!showForm.title || !showForm.venue || !showForm.show_type) {
      setSnackbar({ open: true, message: '请填写必填字段', severity: 'error' });
      return;
    }

    try {
      const showData = {
        title: showForm.title,
        description: showForm.description || null,
        venue: showForm.venue,
        date: showForm.date.toISOString().split('T')[0],
        time: showForm.date.toTimeString().split(' ')[0],
        ticket_price: showForm.ticket_price ? parseFloat(showForm.ticket_price) : null,
        ticket_url: showForm.ticket_url || null,
        show_type_id: parseInt(showForm.show_type)
      };

      let error;
      if (editingShow) {
        ({ error } = await supabase
          .from('shows')
          .update(showData)
          .eq('id', editingShow.id));
      } else {
        ({ error } = await supabase
          .from('shows')
          .insert(showData));
      }

      if (error) {
        throw error;
      }

      setSnackbar({ 
        open: true, 
        message: editingShow ? '演出信息更新成功' : '演出添加成功', 
        severity: 'success' 
      });
      
      resetForm();
      fetchData();
    } catch (error) {
      console.error('操作失败:', error);
      setSnackbar({ open: true, message: '操作失败', severity: 'error' });
    }
  };

  const handleEdit = (show: Show) => {
    setEditingShow(show);
    const showDateTime = new Date(`${show.date}T${show.time}`);
    setShowForm({
      title: show.title,
      description: show.description || '',
      venue: show.venue,
      date: showDateTime,
      ticket_price: show.ticket_price?.toString() || '',
      ticket_url: show.ticket_url || '',
      show_type: show.show_type_id?.toString() || ''
    });
  };

  const handleDelete = async () => {
    if (!showToDelete) return;

    try {
      const { error } = await supabase
        .from('shows')
        .delete()
        .eq('id', showToDelete.id);

      if (error) {
        throw error;
      }

      setSnackbar({ open: true, message: '演出删除成功', severity: 'success' });
      setDeleteDialogOpen(false);
      setShowToDelete(null);
      fetchData();
    } catch (error) {
      console.error('删除失败:', error);
      setSnackbar({ open: true, message: '删除失败', severity: 'error' });
    }
  };

  const resetForm = () => {
    setShowForm({
      title: '',
      description: '',
      venue: '',
      date: new Date(),
      ticket_price: '',
      ticket_url: '',
      show_type: ''
    });
    setEditingShow(null);
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          演出安排管理
        </Typography>

        {/* 添加/编辑表单 */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            {editingShow ? '编辑演出' : '添加新演出'}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField
                label="演出标题"
                value={showForm.title}
                onChange={(e) => setShowForm({ ...showForm, title: e.target.value })}
                required
                fullWidth
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                <TextField
                  label="演出场地"
                  value={showForm.venue}
                  onChange={(e) => setShowForm({ ...showForm, venue: e.target.value })}
                  required
                  fullWidth
                />
              </Box>
              
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(25% - 8px)' } }}>
                <FormControl fullWidth required>
                  <InputLabel>演出类型</InputLabel>
                  <Select
                    value={showForm.show_type}
                    label="演出类型"
                    onChange={(e) => setShowForm({ ...showForm, show_type: e.target.value })}
                  >
                    {showTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                <DateTimePicker
                  label="演出时间"
                  value={showForm.date}
                  onChange={(newValue) => newValue && setShowForm({ ...showForm, date: newValue })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                <TextField
                  label="票价（元）"
                  type="number"
                  value={showForm.ticket_price}
                  onChange={(e) => setShowForm({ ...showForm, ticket_price: e.target.value })}
                  fullWidth
                />
              </Box>
            </Box>
            
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField
                label="购票链接"
                value={showForm.ticket_url}
                onChange={(e) => setShowForm({ ...showForm, ticket_url: e.target.value })}
                fullWidth
              />
            </Box>
            
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField
                label="演出描述"
                value={showForm.description}
                onChange={(e) => setShowForm({ ...showForm, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              startIcon={editingShow ? <EditIcon /> : <AddIcon />}
              sx={{
                bgcolor: '#FAF7F0',
                color: '#333',
                '&:hover': {
                  bgcolor: '#F5F2EA'
                }
              }}
            >
              {editingShow ? '更新演出' : '添加演出'}
            </Button>
            
            {editingShow && (
              <Button
                variant="outlined"
                onClick={resetForm}
              >
                取消编辑
              </Button>
            )}
          </Box>
        </Paper>

        {/* 演出列表 */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>加载中...</Typography>
          </Box>
        ) : shows.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>演出标题</TableCell>
                  <TableCell>场地</TableCell>
                  <TableCell>时间</TableCell>
                  <TableCell>类型</TableCell>
                  <TableCell>票价</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shows.map((show) => (
                  <TableRow key={show.id}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {show.title}
                      </Typography>
                      {show.description && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                          {show.description.length > 50 
                            ? `${show.description.substring(0, 50)}...` 
                            : show.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{show.venue}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(show.date).toLocaleDateString('zh-CN')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {show.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={show.show_type} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {show.ticket_price ? `¥${show.ticket_price}` : '免费'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(show)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setShowToDelete(show);
                          setDeleteDialogOpen(true);
                        }}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              暂无演出安排
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              点击上方的"添加演出"按钮开始添加演出安排
            </Typography>
          </Paper>
        )}

        {/* 删除确认对话框 */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>确认删除</DialogTitle>
          <DialogContent>
            <Typography>
              确定要删除演出"{showToDelete?.title}"吗？此操作不可撤销。
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
    </LocalizationProvider>
  );
};

export default ScheduleManager;