import React from 'react';
import { Box } from '@mui/material';

/**
 * TabPanel component for tabbed interfaces
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content of the tab panel
 * @param {number} props.value - The current tab index
 * @param {number} props.index - The index of this tab panel
 * @param {string} props.dir - Optional text direction
 * @param {Object} props.sx - Additional styles to apply to the tab panel
 */
function TabPanel({ children, value, index, dir, sx = {} }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      dir={dir}
    >
      {value === index && (
        <Box sx={{ p: 3, ...sx }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * Helper function to generate accessibility props for tabs
 * 
 * @param {number} index - The index of the tab
 * @returns {Object} - Object containing id and aria-controls props
 */
export function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default TabPanel; 