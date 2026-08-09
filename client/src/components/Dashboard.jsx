import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Add as AddIcon,
  Search as SearchIcon,
  DeleteOutline as DeleteIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Article as ArticleIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = ({ socket, theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('get-all-documents');

    socket.on('load-all-documents', (docs) => {
      setDocuments(docs);
      setLoading(false);
    });

    return () => {
      socket.off('load-all-documents');
    };
  }, [socket]);

  const handleCreateNew = () => {
    const newId = uuidv4();
    navigate(`/docs/${newId}`);
  };

  const handleDeleteConfirm = () => {
    if (deleteId && socket) {
      socket.emit('delete-document', deleteId);
      setDeleteId(null);
    }
  };

  const filteredDocs = documents.filter((doc) =>
    (doc.title || 'Untitled Document').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPreviewText = (data) => {
    if (!data) return 'Empty document...';
    if (typeof data === 'string') return data.slice(0, 90) + '...';
    if (data.ops && Array.isArray(data.ops)) {
      const text = data.ops
        .map((op) => (typeof op.insert === 'string' ? op.insert : ''))
        .join('')
        .trim();
      return text ? text.slice(0, 100) + '...' : 'Empty document...';
    }
    return 'Document content...';
  };

  return (
    <Box className="app-container" sx={{ pb: 8 }}>
      {/* Top Navbar */}
      <Box
        sx={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          py: 1.5,
          px: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DescriptionIcon sx={{ color: '#2563eb', fontSize: 26 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
            Docs <Typography component="span" variant="h6" sx={{ color: '#2563eb', fontWeight: 700 }}>Clone</Typography>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{
              borderRadius: '24px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              backgroundColor: 'var(--accent-color)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              '&:hover': {
                backgroundColor: 'var(--accent-hover)',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)',
              },
            }}
          >
            New Document
          </Button>

          <Tooltip title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton onClick={onToggleTheme} sx={{ color: 'var(--text-primary)' }}>
              {theme === 'dark' ? <LightIcon sx={{ color: '#f59e0b' }} /> : <DarkIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Dashboard Content */}
      <Box className="dashboard-container animate-fade-in">
        <Box className="dashboard-header">
          <Box className="dashboard-title-section">
            <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '24px', md: '28px' } }}>
              Recent Documents
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 0.5 }}>
              Create, edit, and collaborate on your documents in real time
            </Typography>
          </Box>

          {/* Search Input */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '30px',
              px: 2.5,
              py: 0.8,
              width: { xs: '100%', sm: '320px' },
              transition: 'all 0.2s ease',
              '&:focus-within': {
                borderColor: 'var(--accent-color)',
                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.12)',
              },
            }}
          >
            <SearchIcon sx={{ color: 'var(--text-secondary)', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ color: 'var(--text-primary)', fontSize: '14px', width: '100%' }}
            />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={44} sx={{ color: 'var(--accent-color)' }} />
          </Box>
        ) : (
          <Box className="doc-grid">
            {/* Create Blank Card */}
            <Paper
              elevation={0}
              onClick={handleCreateNew}
              sx={{
                backgroundColor: 'var(--card-bg)',
                border: '2px dashed var(--accent-color)',
                borderRadius: '16px',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '230px',
                textAlign: 'center',
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                  transform: 'translateY(-4px)',
                  boxShadow: 'var(--shadow-md)',
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <AddIcon sx={{ fontSize: 32, color: 'var(--accent-color)' }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                Blank Document
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)', mt: 0.5 }}>
                Start writing from scratch
              </Typography>
            </Paper>

            {/* Document Card Grid */}
            {filteredDocs.map((doc) => (
              <Paper
                key={doc._id}
                elevation={0}
                onClick={() => navigate(`/docs/${doc._id}`)}
                sx={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  minHeight: '230px',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 'var(--shadow-lg)',
                    borderColor: 'var(--accent-color)',
                  },
                }}
              >
                {/* Mini Paper Preview Header */}
                <Box
                  sx={{
                    height: '110px',
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderBottom: '1px solid var(--border-color)',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {getPreviewText(doc.data)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ArticleIcon sx={{ color: '#2563eb', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600, fontSize: '11px' }}>
                      Docs Canvas
                    </Typography>
                  </Box>
                </Box>

                {/* Document Details Footer */}
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '170px',
                        fontSize: '14px',
                      }}
                    >
                      {doc.title || 'Untitled Document'}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(doc._id);
                      }}
                      sx={{
                        color: 'var(--text-secondary)',
                        mt: -0.5,
                        mr: -0.5,
                        '&:hover': { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.08)' },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                      Edited {new Date(doc.updatedAt || Date.now()).toLocaleDateString()}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '12px' }}>
                      Open →
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderRadius: '16px',
            p: 1,
            minWidth: '320px',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Document?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to delete this document? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: 'var(--text-secondary)', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{ borderRadius: '20px', textTransform: 'none', px: 3 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
