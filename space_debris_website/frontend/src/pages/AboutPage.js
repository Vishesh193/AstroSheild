import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import BarChartIcon from '@mui/icons-material/BarChart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PublicIcon from '@mui/icons-material/Public';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

// Import components
import PageHeader from '../components/PageHeader';
import DataCard from '../components/DataCard';

const AboutPage = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Prachi Bansal',
      role: 'Lead Researcher and ML Engineer',
      bio: 'BE CSE AI 2nd year student with a passion for space debris tracking and modeling.',
      image: '/static/images/prachi.jpg',
      links: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'prachi.bansal@gmail.com',
      },
    },
    {
      name: 'Vishesh Arora',
      role: 'Data Scientist and Full Stack Developer',
      bio: 'BE CSE AI 2nd year student specializing in machine learning applications for space object classification.',
      image: '/static/images/vishesh.jpg',
      links: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'vishesharora194@gmail.com',
      },
    },
    {
      name: 'Prabhrehmat Kaur',
      role: 'Lead Researcher and ML Engineer',
      bio: 'BE CSE AI 2nd year student focused on creating interactive data visualizations for space debris analysis.',
      image: '/static/images/avatar/2.jpg',
      links: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'prabhrehmat.kaur@gmail.com',
      },
    },
  ];

  // Project stats
  const projectStats = [
    {
      title: 'Data Sources',
      value: '3',
      icon: 'database',
      description: 'Major space debris catalogs integrated',
    },
    {
      title: 'Objects Tracked',
      value: '28,000+',
      icon: 'satellite',
      description: 'Space debris objects in our database',
    },
    {
      title: 'Model Accuracy',
      value: '94.2%',
      icon: 'accuracy',
      description: 'For RCS size prediction',
    },
    {
      title: 'Visualizations',
      value: '5',
      icon: 'chart',
      description: 'Interactive data visualization types',
    },
  ];

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="About the Project"
        description="Learn about our space debris monitoring project, our mission, and the team behind it."
      />

      {/* Mission Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          The Space Debris Monitoring Project aims to provide accessible, accurate, and up-to-date information about the growing problem of space debris. By combining data from multiple sources and applying advanced machine learning techniques, we offer insights into the current state of Earth's orbital environment.
        </Typography>
        <Typography variant="body1" paragraph>
          Our goal is to raise awareness about space debris, support research in space sustainability, and provide tools for both experts and the general public to understand the challenges we face in maintaining a safe orbital environment for future space missions.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {projectStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <DataCard
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                  icon={stat.icon}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* Data Sources Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Data Sources
        </Typography>
        <Typography variant="body1" paragraph>
          Our platform integrates data from multiple authoritative sources to provide a comprehensive view of the space debris environment:
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <PublicIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Space-Track.org" 
              secondary="Official catalog maintained by the U.S. Space Command, providing tracking data for thousands of artificial objects in Earth orbit."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <RocketLaunchIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="ESA Space Debris Office" 
              secondary="European Space Agency's database of space debris measurements and risk assessments."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DataObjectIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="NASA Orbital Debris Program Office" 
              secondary="Research data on orbital debris characterization and risk mitigation strategies."
            />
          </ListItem>
        </List>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Data is updated monthly to ensure the most current information is available. Historical data is preserved to enable trend analysis.
        </Typography>
      </Paper>

      {/* Technology Stack Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Technology Stack
        </Typography>
        <Typography variant="body1" paragraph>
          Our platform is built using modern technologies to ensure performance, scalability, and a great user experience:
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: 'background.default' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CodeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Frontend</Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText primary="React.js" secondary="Component-based UI library" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Material-UI" secondary="Design system for consistent styling" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Plotly.js" secondary="Interactive data visualizations" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="CesiumJS" secondary="3D globe visualization" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: 'background.default' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DataObjectIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Backend</Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Python" secondary="Core programming language" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Flask" secondary="Web framework for API endpoints" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="PostgreSQL" secondary="Relational database for structured data" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Redis" secondary="In-memory data store for caching" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: 'background.default' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Data Science</Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Scikit-learn" secondary="Machine learning models" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Pandas" secondary="Data manipulation and analysis" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="NumPy" secondary="Numerical computing" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Jupyter" secondary="Interactive data exploration" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Team Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Our Team
        </Typography>
        <Typography variant="body1" paragraph>
          Meet the dedicated researchers and developers behind this project:
        </Typography>
        
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  />
                  <Typography variant="h6" align="center">
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" align="center" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" align="center" paragraph>
                    {member.bio}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }}>
                    <Link href={member.links.github} target="_blank" rel="noopener" sx={{ mx: 1 }}>
                      <GitHubIcon />
                    </Link>
                    <Link href={member.links.linkedin} target="_blank" rel="noopener" sx={{ mx: 1 }}>
                      <LinkedInIcon />
                    </Link>
                    <Link href={`mailto:${member.links.email}`} sx={{ mx: 1 }}>
                      <EmailIcon />
                    </Link>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Academic Collaborations */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Data Collaborations
        </Typography>
        <Typography variant="body1" paragraph>
          Our project is developed using datasets available on Kaggle, a leading platform for data science and machine learning:
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <SchoolIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Kaggle Space Debris Datasets" 
              secondary="Comprehensive collections of space debris tracking data from various sources"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SchoolIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Satellite Orbital Parameters Dataset" 
              secondary="Historical and current orbital parameters for active satellites and debris objects"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SchoolIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Space Object Classification Dataset" 
              secondary="Machine learning datasets for identifying and categorizing space debris objects"
            />
          </ListItem>
        </List>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            If you're interested in collaborating with us or have questions about our research, please contact us at <Link href="mailto:vishesharora194@gmail.com">vishesharora194@gmail.com</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage; 