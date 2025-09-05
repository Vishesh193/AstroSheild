import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Link,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ScienceIcon from '@mui/icons-material/Science';
import ArticleIcon from '@mui/icons-material/Article';
import SchoolIcon from '@mui/icons-material/School';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

// Components
import PageHeader from '../components/PageHeader';

const ResearchPage = () => {
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [savedPapers, setSavedPapers] = useState([]);
  
  // Mock data for research papers
  const researchPapers = [
    {
      id: 1,
      title: "Orbital Debris Characterization via Deep Learning Approaches",
      authors: ["Zhang, L.", "Johnson, M.", "Patel, S."],
      journal: "Journal of Space Research",
      year: 2023,
      abstract: "This paper presents a novel deep learning approach for characterizing orbital debris using multi-spectral imaging data. The proposed model achieves 94% accuracy in size estimation and material classification.",
      keywords: ["deep learning", "orbital debris", "classification", "remote sensing"],
      category: "machine learning",
      doi: "10.1234/jsr.2023.0101",
      url: "https://doi.org/10.1234/jsr.2023.0101",
      pdfUrl: "/files/papers/zhang_orbital_debris_2023.pdf"
    },
    {
      id: 2,
      title: "Long-term Evolution of the LEO Debris Environment",
      authors: ["Martinez, A.", "Williams, T.", "Chen, H."],
      journal: "Advances in Space Research",
      year: 2022,
      abstract: "We present a comprehensive model for predicting the long-term evolution of the Low Earth Orbit (LEO) debris environment. Our simulations indicate a 30% increase in collision risk by 2050 without active debris removal interventions.",
      keywords: ["space debris", "LEO", "collision risk", "orbital mechanics"],
      category: "modeling",
      doi: "10.1234/asr.2022.0203",
      url: "https://doi.org/10.1234/asr.2022.0203",
      pdfUrl: "/files/papers/martinez_leo_debris_2022.pdf"
    },
    {
      id: 3,
      title: "Radar Cross Section Analysis of Fragmentation Events in GEO",
      authors: ["Smith, J.", "Brown, R.", "Garcia, M."],
      journal: "Journal of Aerospace Engineering",
      year: 2022,
      abstract: "This study analyzes radar cross-section measurements from recent fragmentation events in geostationary orbit. We identify characteristic signatures that can be used to determine the cause of breakup events.",
      keywords: ["radar cross section", "GEO", "fragmentation", "space surveillance"],
      category: "observation",
      doi: "10.1234/jae.2022.0405",
      url: "https://doi.org/10.1234/jae.2022.0405",
      pdfUrl: "/files/papers/smith_rcs_analysis_2022.pdf"
    },
    {
      id: 4,
      title: "Active Debris Removal: A Comparative Analysis of Capture Mechanisms",
      authors: ["Ivanov, D.", "Müller, K.", "Tanaka, Y."],
      journal: "Acta Astronautica",
      year: 2021,
      abstract: "We compare five different capture mechanisms for active debris removal missions. Our analysis considers technical feasibility, cost, and risk factors. Robotic arm systems show the highest success probability for large debris objects.",
      keywords: ["active debris removal", "capture mechanisms", "space robotics", "mission design"],
      category: "mitigation",
      doi: "10.1234/aa.2021.0506",
      url: "https://doi.org/10.1234/aa.2021.0506",
      pdfUrl: "/files/papers/ivanov_adr_comparison_2021.pdf"
    },
    {
      id: 5,
      title: "Statistical Analysis of Conjunction Data Messages for Collision Avoidance",
      authors: ["Park, S.", "Anderson, J.", "Kumar, R."],
      journal: "Space Weather",
      year: 2021,
      abstract: "This paper presents a statistical analysis of Conjunction Data Messages (CDMs) issued by the 18th Space Control Squadron. We develop a probabilistic framework for optimizing collision avoidance maneuvers based on historical conjunction data.",
      keywords: ["conjunction assessment", "collision avoidance", "space traffic management", "statistics"],
      category: "operations",
      doi: "10.1234/sw.2021.0708",
      url: "https://doi.org/10.1234/sw.2021.0708",
      pdfUrl: "/files/papers/park_cdm_analysis_2021.pdf"
    },
    {
      id: 6,
      title: "Material Degradation of Spacecraft Surfaces in the LEO Environment",
      authors: ["Wilson, E.", "Nakamura, H.", "Dubois, L."],
      journal: "Journal of Materials Science",
      year: 2020,
      abstract: "We investigate the effects of atomic oxygen, UV radiation, and micrometeoroid impacts on common spacecraft materials in the LEO environment. Results from a 3-year exposure experiment on the ISS reveal significant degradation patterns not predicted by ground testing.",
      keywords: ["material degradation", "LEO environment", "spacecraft surfaces", "atomic oxygen"],
      category: "materials",
      doi: "10.1234/jms.2020.0809",
      url: "https://doi.org/10.1234/jms.2020.0809",
      pdfUrl: "/files/papers/wilson_material_degradation_2020.pdf"
    },
    {
      id: 7,
      title: "Optical Tracking of Small Debris Objects: Improved Algorithms and Detection Limits",
      authors: ["Hernandez, C.", "Kowalski, M.", "Peng, F."],
      journal: "Astronomical Journal",
      year: 2020,
      abstract: "This paper presents improved algorithms for optical tracking of small debris objects (1-10 cm) using ground-based telescopes. Our method achieves a 40% increase in detection sensitivity compared to previous approaches.",
      keywords: ["optical tracking", "small debris", "detection algorithms", "ground-based observations"],
      category: "observation",
      doi: "10.1234/aj.2020.1011",
      url: "https://doi.org/10.1234/aj.2020.1011",
      pdfUrl: "/files/papers/hernandez_optical_tracking_2020.pdf"
    },
    {
      id: 8,
      title: "Machine Learning for Predicting Satellite Reentry Trajectories",
      authors: ["Thompson, K.", "Lee, S.", "Gonzalez, A."],
      journal: "Advances in Space Research",
      year: 2019,
      abstract: "We develop a machine learning approach for predicting satellite reentry trajectories. Our model incorporates atmospheric density variations, solar activity, and spacecraft attitude dynamics to achieve 30% more accurate predictions than traditional methods.",
      keywords: ["machine learning", "reentry prediction", "atmospheric modeling", "space weather"],
      category: "machine learning",
      doi: "10.1234/asr.2019.1213",
      url: "https://doi.org/10.1234/asr.2019.1213",
      pdfUrl: "/files/papers/thompson_ml_reentry_2019.pdf"
    },
  ];

  // Filter papers based on search and category
  const filteredPapers = researchPapers.filter(paper => {
    const matchesSearch = searchQuery === '' || 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
      paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = category === 'all' || paper.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // Sort papers
  const sortedPapers = [...filteredPapers].sort((a, b) => {
    if (sortBy === 'date') {
      return b.year - a.year;
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Pagination
  const papersPerPage = 4;
  const pageCount = Math.ceil(sortedPapers.length / papersPerPage);
  const displayedPapers = sortedPapers.slice(
    (page - 1) * papersPerPage,
    page * papersPerPage
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSavePaper = (paperId) => {
    if (savedPapers.includes(paperId)) {
      setSavedPapers(savedPapers.filter(id => id !== paperId));
    } else {
      setSavedPapers([...savedPapers, paperId]);
    }
  };

  // Categories for filter
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'machine learning', label: 'Machine Learning & AI' },
    { value: 'modeling', label: 'Modeling & Simulation' },
    { value: 'observation', label: 'Observation & Tracking' },
    { value: 'mitigation', label: 'Mitigation & Removal' },
    { value: 'operations', label: 'Operations & Management' },
    { value: 'materials', label: 'Materials & Engineering' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <PageHeader 
        title="Research Papers" 
        subtitle="Explore academic publications and research on space debris"
        icon={<ArticleIcon fontSize="large" />}
      />

      {/* Featured Research */}
      <Paper 
        sx={{ 
          p: 4, 
          mt: 4, 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(/images/research-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Featured Research
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Advances in Space Debris Detection and Tracking
        </Typography>
        <Typography variant="body1" paragraph>
          Our latest collaborative research with leading space agencies has resulted in significant improvements 
          in detecting and tracking small debris objects in low Earth orbit. This special collection of papers 
          presents cutting-edge methodologies and findings that enhance our understanding of the orbital debris environment.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<ScienceIcon />}
          component={Link}
          href="#research-collection"
          sx={{ mt: 2 }}
        >
          Explore Collection
        </Button>
      </Paper>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Papers"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by title, author, keyword..."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                label="Category"
                onChange={handleCategoryChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                }
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="date">Most Recent</MenuItem>
                <MenuItem value="title">Title (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Research Papers */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom id="research-collection">
          Research Papers
        </Typography>
        
        {displayedPapers.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No papers found matching your criteria
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search terms or filters
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {displayedPapers.map((paper) => (
              <Grid item xs={12} key={paper.id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {paper.title}
                      </Typography>
                      <Tooltip title={savedPapers.includes(paper.id) ? "Remove from saved" : "Save paper"}>
                        <IconButton 
                          onClick={() => toggleSavePaper(paper.id)}
                          color={savedPapers.includes(paper.id) ? "primary" : "default"}
                        >
                          {savedPapers.includes(paper.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {paper.authors.join(', ')}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <i>{paper.journal}</i>, {paper.year} • DOI: {paper.doi}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body1" paragraph>
                      {paper.abstract}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {paper.keywords.map((keyword, index) => (
                        <Chip 
                          key={index} 
                          label={keyword} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                          onClick={() => setSearchQuery(keyword)}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ mt: 'auto', p: 2, pt: 0 }}>
                    <Button 
                      startIcon={<OpenInNewIcon />} 
                      component={Link}
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Publication
                    </Button>
                    <Button 
                      startIcon={<DownloadIcon />} 
                      component={Link}
                      href={paper.pdfUrl}
                      target="_blank"
                    >
                      Download PDF
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Pagination */}
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="large"
            />
          </Box>
        )}
      </Box>

      {/* Research Collaborations */}
      <Paper sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Research Collaborations
        </Typography>
        <Typography paragraph>
          Our research is conducted in collaboration with leading academic institutions, space agencies, and industry partners. 
          We welcome new research partnerships and opportunities for joint publications.
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Academic Partnerships</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  We collaborate with universities and research institutions worldwide on space debris research projects.
                </Typography>
                <Typography variant="body2">
                  Current partners include MIT, Stanford University, University of Tokyo, and the European Space Research Institute.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} href="/contact">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScienceIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Research Grants</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  We offer research grants for innovative projects related to space debris detection, tracking, and mitigation.
                </Typography>
                <Typography variant="body2">
                  Applications are accepted twice yearly, with funding available for both established researchers and graduate students.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} href="/contact">Apply for Grant</Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ArticleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Submit Your Research</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Have you conducted research on space debris? We welcome submissions to our database and can help promote your work.
                </Typography>
                <Typography variant="body2">
                  We also organize an annual Space Debris Research Symposium where you can present your findings.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} href="/contact">Submit Research</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ResearchPage; 