import React, { useEffect, useState } from 'react';
import { Box, Typography, Tooltip, Divider } from '@mui/material';
import { AccessTime as TimeIcon, ShortText as WordIcon } from '@mui/icons-material';

const StatsBar = ({ quill }) => {
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    readingTime: 0,
  });

  useEffect(() => {
    if (!quill) return;

    const updateStats = () => {
      const text = quill.getText() || '';
      const trimmed = text.trim();
      const words = trimmed ? trimmed.split(/\s+/).length : 0;
      const chars = text.replace(/\n/g, '').length;
      const readingTime = Math.ceil(words / 200);

      setStats({ words, chars, readingTime });
    };

    updateStats();

    quill.on('text-change', updateStats);
    return () => {
      quill.off('text-change', updateStats);
    };
  }, [quill]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 32,
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '30px',
        boxShadow: 'var(--shadow-lg)',
        px: 2.5,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        zIndex: 100,
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease',
      }}
    >
      <Tooltip title="Total Word Count">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <WordIcon fontSize="small" sx={{ color: 'var(--accent-color)' }} />
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px' }}>
            {stats.words} <Typography component="span" variant="caption" sx={{ color: 'var(--text-secondary)' }}>words</Typography>
          </Typography>
        </Box>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--border-color)' }} />

      <Tooltip title="Total Characters">
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px' }}>
          {stats.chars} <Typography component="span" variant="caption" sx={{ color: 'var(--text-secondary)' }}>chars</Typography>
        </Typography>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--border-color)' }} />

      <Tooltip title="Estimated Reading Time">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <TimeIcon fontSize="small" sx={{ color: '#10b981' }} />
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px' }}>
            {stats.readingTime} <Typography component="span" variant="caption" sx={{ color: 'var(--text-secondary)' }}>min read</Typography>
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default StatsBar;
