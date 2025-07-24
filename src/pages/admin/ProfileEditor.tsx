import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Snackbar,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import { supabase } from '../../lib/supabase';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';

interface Profile {
  id: number;
  name: string;
  bio: string;
  avatar_url?: string;
  contact_email?: string;
  contact_phone?: string;
  social_links?: {
    weibo?: string;
    douyin?: string;
    bilibili?: string;
  };
  created_at: string;
  updated_at: string;
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  display_name: string;
}

const ProfileEditor = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // 表单状态
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    contact_email: '',
    contact_phone: '',
    weibo: '',
    douyin: '',
    bilibili: ''
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // 获取个人资料
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('获取个人资料失败:', profileError);
        setSnackbar({ open: true, message: '获取个人资料失败', severity: 'error' });
      } else if (profileData) {
        setProfile(profileData);
        setProfileForm({
          name: profileData.name || '',
          bio: profileData.bio || '',
          contact_email: profileData.contact_email || '',
          contact_phone: profileData.contact_phone || '',
          weibo: profileData.social_links?.weibo || '',
          douyin: profileData.social_links?.douyin || '',
          bilibili: profileData.social_links?.bilibili || ''
        });
      }
      
      // 获取社交链接
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*')
        .order('platform');
        
      if (socialError) {
        console.error('获取社交链接失败:', socialError);
      } else {
        setSocialLinks(socialData || []);
      }
    } catch (error) {
      console.error('数据获取失败:', error);
      setSnackbar({ open: true, message: '数据获取失败', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // 上传头像到 Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // 获取公共URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // 更新个人资料中的头像URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: profile?.id || 1,
          avatar_url: publicUrl,
          name: profileForm.name,
          bio: profileForm.bio,
          contact_email: profileForm.contact_email,
          contact_phone: profileForm.contact_phone,
          social_links: {
            weibo: profileForm.weibo,
            douyin: profileForm.douyin,
            bilibili: profileForm.bilibili
          }
        });

      if (updateError) {
        throw updateError;
      }

      setSnackbar({ open: true, message: '头像上传成功', severity: 'success' });
      fetchProfile();
    } catch (error) {
      console.error('头像上传失败:', error);
      setSnackbar({ open: true, message: '头像上传失败', severity: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profileForm.name) {
      setSnackbar({ open: true, message: '请填写姓名', severity: 'error' });
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: profile?.id || 1,
          name: profileForm.name,
          bio: profileForm.bio,
          contact_email: profileForm.contact_email,
          contact_phone: profileForm.contact_phone,
          social_links: {
            weibo: profileForm.weibo,
            douyin: profileForm.douyin,
            bilibili: profileForm.bilibili
          },
          avatar_url: profile?.avatar_url
        });

      if (error) {
        throw error;
      }

      setSnackbar({ open: true, message: '个人资料保存成功', severity: 'success' });
      fetchProfile();
    } catch (error) {
      console.error('保存失败:', error);
      setSnackbar({ open: true, message: '保存失败', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>加载中...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        个人资料编辑
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* 头像和基本信息 */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 300px' }, minWidth: '300px' }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                <Avatar
                  src={profile?.avatar_url}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto',
                    fontSize: '3rem'
                  }}
                >
                  {profileForm.name.charAt(0)}
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    component="span"
                    disabled={uploading}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
              </Box>
              
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {profileForm.name || '未设置姓名'}
              </Typography>
              
              {uploading && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  上传中...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* 详细信息表单 */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(100% - 324px)' }, minWidth: '400px' }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                基本信息
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField
                    label="姓名"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    fullWidth
                  />
                </Box>
                
                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField
                    label="个人简介"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    multiline
                    rows={4}
                    fullWidth
                  />
                </Box>
                
                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField
                    label="联系邮箱"
                    type="email"
                    value={profileForm.contact_email}
                    onChange={(e) => setProfileForm({ ...profileForm, contact_email: e.target.value })}
                    fullWidth
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                社交媒体链接
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }}>
                    <TextField
                      label="微博链接"
                      value={profileForm.weibo}
                      onChange={(e) => setProfileForm({ ...profileForm, weibo: e.target.value })}
                      placeholder="https://weibo.com/your-profile"
                      fullWidth
                    />
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }}>
                    <TextField
                      label="抖音链接"
                      value={profileForm.douyin}
                      onChange={(e) => setProfileForm({ ...profileForm, douyin: e.target.value })}
                      placeholder="https://www.douyin.com/user/your-profile"
                      fullWidth
                    />
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }}>
                    <TextField
                      label="B站链接"
                      value={profileForm.bilibili}
                      onChange={(e) => setProfileForm({ ...profileForm, bilibili: e.target.value })}
                      placeholder="https://space.bilibili.com/your-uid"
                      fullWidth
                    />
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving || !profileForm.name}
                  startIcon={<SaveIcon />}
                  sx={{
                    bgcolor: '#FAF7F0',
                    color: '#333',
                    '&:hover': {
                      bgcolor: '#F5F2EA'
                    }
                  }}
                >
                  {saving ? '保存中...' : '保存资料'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

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

export default ProfileEditor;