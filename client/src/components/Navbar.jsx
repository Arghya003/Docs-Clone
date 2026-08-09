import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Button,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  AvatarGroup,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  FileDownload as DownloadIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  CheckCircle as SavedIcon,
  Sync as SyncIcon,
  PictureAsPdf as PdfIcon,
  Code as HtmlIcon,
  Article as TxtIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const Navbar = ({
  title,
  onTitleChange,
  status,
  activeUsers = 1,
  theme,
  onToggleTheme,
  quill,
}) => {
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [docTitle, setDocTitle] = useState(title || 'Untitled Document');
  const [anchorEl, setAnchorEl] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Sync title when prop changes
  React.useEffect(() => {
    if (title) setDocTitle(title);
  }, [title]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (docTitle.trim() === '') {
      setDocTitle('Untitled Document');
      onTitleChange('Untitled Document');
    } else {
      onTitleChange(docTitle);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMsg('Link copied to clipboard!');
    setToastOpen(true);
  };

  const handleExportMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setAnchorEl(null);
  };

  const exportAsTxt = () => {
    handleExportMenuClose();
    if (!quill) return;
    const text = quill.getText();
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${docTitle}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportAsHtml = () => {
    handleExportMenuClose();
    if (!quill) return;
    const htmlContent = quill.root.innerHTML;
    const fullHtml = `<!DOCTYPE html><html><head><title>${docTitle}</title></head><body>${htmlContent}</body></html>`;
    const element = document.createElement('a');
    const file = new Blob([fullHtml], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${docTitle}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportAsPdf = () => {
    handleExportMenuClose();
    const element = document.getElementById('container');
    if (!element) return;
    const opt = {
      margin: 0.5,
      filename: `${docTitle}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 11,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px', px: 2 }}>
        {/* Left Section: Back, Logo & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Back to Dashboard">
            <IconButton onClick={() => navigate('/')} size="medium" sx={{ color: 'var(--text-primary)' }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <DescriptionIcon sx={{ color: '#2563eb', fontSize: 32 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <InputBase
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              placeholder="Untitled Document"
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                px: 1,
                py: 0.2,
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                border: '1px solid transparent',
                '&:hover': {
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(0,0,0,0.03)',
                },
                '&.Mui-focused': {
                  border: '1px solid var(--accent-color)',
                  backgroundColor: 'var(--bg-primary)',
                },
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
              {status === 'saving' ? (
                <Chip
                  icon={<SyncIcon sx={{ animation: 'spin 1s linear infinite', fontSize: 14 }} />}
                  label="Saving..."
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '11px', borderColor: '#f59e0b', color: '#f59e0b' }}
                />
              ) : (
                <Chip
                  icon={<SavedIcon sx={{ fontSize: 14, color: '#10b981' }} />}
                  label="Saved to cloud"
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '11px', borderColor: '#10b981', color: '#10b981' }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Right Section: Active Presence, Export, Share, Theme Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Active Collaborators */}
          <Tooltip title={`${activeUsers} active user(s) editing live`}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 12 } }}>
                <Avatar sx={{ bgcolor: '#2563eb' }}>U1</Avatar>
                {activeUsers > 1 && <Avatar sx={{ bgcolor: '#10b981' }}>U2</Avatar>}
                {activeUsers > 2 && <Avatar sx={{ bgcolor: '#8b5cf6' }}>+{activeUsers - 2}</Avatar>}
              </AvatarGroup>
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                {activeUsers} Live
              </Typography>
            </Box>
          </Tooltip>

          {/* Export Dropdown */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleExportMenuOpen}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              '&:hover': {
                borderColor: 'var(--accent-color)',
                backgroundColor: 'rgba(37, 99, 235, 0.04)',
              },
            }}
          >
            Export
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleExportMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
                mt: 1,
                minWidth: 160,
              },
            }}
          >
            <MenuItem onClick={exportAsPdf} sx={{ gap: 1.5, fontSize: 14 }}>
              <PdfIcon fontSize="small" sx={{ color: '#ef4444' }} /> PDF Document (.pdf)
            </MenuItem>
            <MenuItem onClick={exportAsTxt} sx={{ gap: 1.5, fontSize: 14 }}>
              <TxtIcon fontSize="small" sx={{ color: '#3b82f6' }} /> Text Document (.txt)
            </MenuItem>
            <MenuItem onClick={exportAsHtml} sx={{ gap: 1.5, fontSize: 14 }}>
              <HtmlIcon fontSize="small" sx={{ color: '#10b981' }} /> HTML Document (.html)
            </MenuItem>
          </Menu>

          {/* Share Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<ShareIcon />}
            onClick={handleShare}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              backgroundColor: 'var(--accent-color)',
              boxShadow: 'none',
              px: 2,
              '&:hover': {
                backgroundColor: 'var(--accent-hover)',
                boxShadow: 'var(--shadow-md)',
              },
            }}
          >
            Share
          </Button>

          {/* Theme Toggle */}
          <Tooltip title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton onClick={onToggleTheme} sx={{ color: 'var(--text-primary)' }}>
              {theme === 'dark' ? <LightIcon sx={{ color: '#f59e0b' }} /> : <DarkIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: '8px' }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Navbar;
