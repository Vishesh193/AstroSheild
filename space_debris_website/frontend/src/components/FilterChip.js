import React from 'react';
import { Chip, Tooltip } from '@mui/material';

/**
 * FilterChip component for filtering data
 * 
 * @param {Object} props
 * @param {string} props.label - The label to display on the chip
 * @param {boolean} props.selected - Whether the chip is selected
 * @param {function} props.onClick - Function to call when the chip is clicked
 * @param {string} props.tooltipText - Optional tooltip text
 * @param {React.ReactNode} props.icon - Optional icon to display
 * @param {string} props.color - Optional color for the chip (primary, secondary, success, warning, error, info)
 * @param {Object} props.sx - Additional styles to apply to the chip
 */
const FilterChip = ({
  label,
  selected,
  onClick,
  tooltipText,
  icon,
  color = 'primary',
  sx = {}
}) => {
  const chip = (
    <Chip
      label={label}
      icon={icon}
      clickable
      color={selected ? color : 'default'}
      onClick={onClick}
      variant={selected ? 'filled' : 'outlined'}
      sx={{
        fontWeight: 500,
        borderRadius: '16px',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: selected ? '' : `${color}.lighter`,
          borderColor: selected ? '' : `${color}.main`,
        },
        ...sx
      }}
    />
  );

  if (tooltipText) {
    return (
      <Tooltip title={tooltipText} arrow placement="top">
        {chip}
      </Tooltip>
    );
  }

  return chip;
};

export default FilterChip; 