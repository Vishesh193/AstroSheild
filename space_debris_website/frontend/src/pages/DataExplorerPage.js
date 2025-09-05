import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Button,
  IconButton,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import ClearIcon from '@mui/icons-material/Clear';

// Import components
import PageHeader from '../components/PageHeader';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';

// Import API utilities
import { debrisAPI } from '../utils/api';

// Import formatters
import { formatNumber, formatDate, formatPeriod, formatRCSSize } from '../utils/formatters';

const DataExplorerPage = () => {
  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState({
    object_type: '',
    rcs_size: '',
    country_code: '',
    search: '',
  });
  
  // Filter options
  const [objectTypes, setObjectTypes] = useState([]);
  const [rcsSizes, setRcsSizes] = useState([]);
  const [countries, setCountries] = useState([]);
  
  // UI state
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  // Column definitions
  const columns = [
    { id: 'OBJECT_ID', label: 'Object ID', minWidth: 100 },
    { id: 'OBJECT_TYPE', label: 'Type', minWidth: 100 },
    { id: 'RCS_SIZE', label: 'RCS Size', minWidth: 100 },
    { id: 'COUNTRY_CODE', label: 'Country', minWidth: 100 },
    { id: 'LAUNCH_DATE', label: 'Launch Date', minWidth: 120 },
    { id: 'PERIOD', label: 'Period', minWidth: 120 },
    { id: 'INCLINATION', label: 'Inclination (°)', minWidth: 120 },
    { id: 'ECCENTRICITY', label: 'Eccentricity', minWidth: 120 },
    { id: 'SEMIMAJOR_AXIS', label: 'Semimajor Axis (km)', minWidth: 150 },
  ];

  useEffect(() => {
    // Fetch filter options
    const fetchFilterOptions = async () => {
      try {
        const [typesRes, sizesRes, countriesRes] = await Promise.all([
          debrisAPI.getObjectTypes(),
          debrisAPI.getRCSSizes(),
          debrisAPI.getCountries(),
        ]);
        
        // Initialize with empty arrays if data is undefined
        setObjectTypes(typesRes || []);
        setRcsSizes(sizesRes || []);
        setCountries(countriesRes || []);
      } catch (err) {
        console.error('Error fetching filter options:', err);
        setError('Failed to load filter options. Please try again later.');
        // Initialize with empty arrays on error
        setObjectTypes([]);
        setRcsSizes([]);
        setCountries([]);
      }
    };
    
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    // Fetch data with current pagination and filters
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          page: page + 1, // API uses 1-indexed pages
          limit: rowsPerPage,
          ...filters,
        };
        
        // Remove empty filters
        Object.keys(params).forEach(key => {
          if (params[key] === '') {
            delete params[key];
          }
        });
        
        const response = await debrisAPI.getDebrisData(params.page, params.limit, params);
        console.log('API Response:', response);
        
        if (!response || !response.data || !response.pagination) {
          throw new Error('Invalid response format from server');
        }
        
        setData(response.data);
        setTotalRecords(response.pagination.total_records);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    setPage(0); // Reset to first page when filters change
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setFilters({
      ...filters,
      search: searchValue,
    });
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setFilters({
      ...filters,
      search: '',
    });
  };

  const handleClearFilters = () => {
    setFilters({
      object_type: '',
      rcs_size: '',
      country_code: '',
      search: '',
    });
    setSearchValue('');
    setPage(0);
  };

  const handleDownloadCSV = async () => {
    try {
      setLoading(true);
      
      // Get all data for export (up to a reasonable limit)
      const exportParams = { ...filters, page: 1, limit: 1000 };
      
      // Remove empty filters
      Object.keys(exportParams).forEach(key => {
        if (exportParams[key] === '') {
          delete exportParams[key];
        }
      });
      
      const response = await debrisAPI.getDebrisData(
        exportParams.page, 
        exportParams.limit, 
        exportParams
      );
      
      const exportData = response.data.data;
      
      // Create CSV content
      const headers = columns.map(col => col.label).join(',');
      const rows = exportData.map(row => 
        columns.map(col => {
          // Format values appropriately
          const value = row[col.id];
          if (value === null || value === undefined) return '';
          
          // Wrap strings with commas in quotes
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          
          return value;
        }).join(',')
      ).join('\n');
      
      const csvContent = `${headers}\n${rows}`;
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'space_debris_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setLoading(false);
    } catch (err) {
      console.error('Error downloading CSV:', err);
      setError('Failed to download data. Please try again later.');
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Reset page and refetch data
    setPage(0);
    setError(null);
    setLoading(true);
    
    const params = {
      page: 1, // API uses 1-indexed pages
      limit: rowsPerPage,
      ...filters,
    };
    
    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === '') {
        delete params[key];
      }
    });
    
    debrisAPI.getDebrisData(params.page, params.limit, params)
      .then(response => {
        setData(response.data.data);
        setTotalRecords(response.data.pagination.total_records);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Space Debris Data Explorer"
        description="Explore and filter the space debris dataset. Use the filters below to narrow down the results."
        action={
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadCSV}
            disabled={loading || error}
          >
            Export CSV
          </Button>
        }
      />

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                placeholder="Search by object ID or name"
                value={searchValue}
                onChange={handleSearchChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchValue && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        edge="end"
                        aria-label="clear search"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant={filtersExpanded ? "contained" : "outlined"}
              startIcon={<FilterListIcon />}
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              sx={{ mr: 1 }}
              color={activeFilterCount > 0 ? "primary" : "inherit"}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
            {activeFilterCount > 0 && (
              <Button
                variant="outlined"
                onClick={handleClearFilters}
              >
                Clear All
              </Button>
            )}
          </Grid>
          
          {filtersExpanded && (
            <>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="object-type-label">Object Type</InputLabel>
                  <Select
                    labelId="object-type-label"
                    id="object-type"
                    name="object_type"
                    value={filters.object_type}
                    label="Object Type"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {(objectTypes || []).map((type) => (
                      <MenuItem key={type.type} value={type.type}>
                        {type.type} ({formatNumber(type.count)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="rcs-size-label">RCS Size</InputLabel>
                  <Select
                    labelId="rcs-size-label"
                    id="rcs-size"
                    name="rcs_size"
                    value={filters.rcs_size}
                    label="RCS Size"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All Sizes</MenuItem>
                    {(rcsSizes || []).map((size) => (
                      <MenuItem key={size.size} value={size.size}>
                        {size.size} ({formatNumber(size.count)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="country-code-label">Country</InputLabel>
                  <Select
                    labelId="country-code-label"
                    id="country-code"
                    name="country_code"
                    value={filters.country_code}
                    label="Country"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All Countries</MenuItem>
                    {(countries || []).map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.code} ({formatNumber(country.count)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {filters.search && (
            <Chip 
              label={`Search: ${filters.search}`} 
              onDelete={() => setFilters({...filters, search: ''})} 
              size="small"
            />
          )}
          {filters.object_type && (
            <Chip 
              label={`Type: ${filters.object_type}`} 
              onDelete={() => setFilters({...filters, object_type: ''})} 
              size="small"
            />
          )}
          {filters.rcs_size && (
            <Chip 
              label={`Size: ${filters.rcs_size}`} 
              onDelete={() => setFilters({...filters, rcs_size: ''})} 
              size="small"
            />
          )}
          {filters.country_code && (
            <Chip 
              label={`Country: ${filters.country_code}`} 
              onDelete={() => setFilters({...filters, country_code: ''})} 
              size="small"
            />
          )}
        </Box>
      )}

      {/* Data Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <LoadingIndicator message="Loading space debris data..." />
        ) : error ? (
          <ErrorMessage 
            message={error} 
            onRetry={handleRetry}
          />
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align="left"
                        style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <Typography variant="body1" sx={{ py: 5 }}>
                          No data found matching your criteria.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.OBJECT_ID}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align="left">
                              {column.id === 'RCS_SIZE' ? (
                                <Chip 
                                  label={formatRCSSize(value).text} 
                                  size="small"
                                  color={formatRCSSize(value).color}
                                  variant="filled"
                                />
                              ) : column.id === 'LAUNCH_DATE' ? (
                                formatDate(value)
                              ) : column.id === 'PERIOD' ? (
                                formatPeriod(value)
                              ) : column.id === 'ECCENTRICITY' ? (
                                value !== null ? value.toFixed(4) : '-'
                              ) : column.id === 'INCLINATION' ? (
                                value !== null ? `${value.toFixed(2)}°` : '-'
                              ) : column.id === 'SEMIMAJOR_AXIS' ? (
                                value !== null ? formatNumber(value, 2) : '-'
                              ) : (
                                value || '-'
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                {totalRecords > 0 
                  ? `Showing ${page * rowsPerPage + 1} to ${Math.min((page + 1) * rowsPerPage, totalRecords)} of ${formatNumber(totalRecords)} records`
                  : 'No records found'
                }
              </Typography>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default DataExplorerPage; 