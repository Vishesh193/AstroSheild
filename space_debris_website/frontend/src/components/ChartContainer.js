import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

/**
 * ChartContainer component for wrapping charts with additional functionality
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The chart component to display
 * @param {string} props.title - The title of the chart
 * @param {string} props.subtitle - Optional subtitle or description
 * @param {string} props.infoText - Optional information text to display in a tooltip
 * @param {function} props.onDownload - Optional function to call when the download button is clicked
 * @param {boolean} props.showFullscreenToggle - Whether to show the fullscreen toggle button
 * @param {Object} props.sx - Additional styles to apply to the container
 * @param {number} props.height - Optional height for the chart container
 */
const ChartContainer = ({
  children,
  title,
  subtitle,
  infoText,
  onDownload,
  showFullscreenToggle = true,
  sx = {},
  height = 400
}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFullscreenToggle = () => {
    setFullscreen(!fullscreen);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  const chartContent = (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {title}
            {infoText && (
              <Tooltip title={infoText} arrow placement="top">
                <InfoOutlinedIcon fontSize="small" color="action" />
              </Tooltip>
            )}
          </Typography>
          
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onDownload && (
            <Tooltip title="Download chart data" arrow>
              <IconButton size="small" onClick={handleDownload} aria-label="download chart data">
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {showFullscreenToggle && (
            <Tooltip title={fullscreen ? "Exit fullscreen" : "View fullscreen"} arrow>
              <IconButton 
                size="small" 
                onClick={handleFullscreenToggle}
                aria-label={fullscreen ? "exit fullscreen" : "view fullscreen"}
              >
                {fullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      <Box 
        sx={{ 
          height: fullscreen ? 'calc(100vh - 200px)' : height,
          width: '100%',
          position: 'relative'
        }}
      >
        {children}
      </Box>
    </>
  );

  if (fullscreen) {
    return (
      <Dialog
        open={fullscreen}
        onClose={handleFullscreenToggle}
        fullScreen={isMobile}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleFullscreenToggle}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {chartContent}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFullscreenToggle}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        height: '100%',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        ...sx 
      }}
    >
      {chartContent}
    </Paper>
  );
};

export default ChartContainer; 