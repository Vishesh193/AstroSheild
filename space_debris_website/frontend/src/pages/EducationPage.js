import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
  Link,
  Tabs,
  Tab,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import WarningIcon from '@mui/icons-material/Warning';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ScienceIcon from '@mui/icons-material/Science';
import PublicIcon from '@mui/icons-material/Public';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Import components
import PageHeader from '../components/PageHeader';
import DataCard from '../components/DataCard';

const EducationPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Educational resources
  const resources = [
    {
      title: "Understanding Space Debris (New)",
      description: "Our comprehensive tutorial on space debris concepts and challenges",
      link: "/education/tutorials/understanding_space_debris.html",
      type: "Tutorial",
    },
    {
      title: "Iridium-Cosmos Collision Case Study (New)",
      description: "Detailed analysis of this landmark space debris collision event",
      link: "/education/case_studies/iridium_cosmos_collision.html",
      type: "Case Study",
    },
    {
      title: "NASA Orbital Debris Program Office",
      description: "Official NASA resource for orbital debris research",
      link: "https://orbitaldebris.jsc.nasa.gov/",
      type: "Official Source",
    },
    {
      title: "ESA Space Debris Office",
      description: "European Space Agency's hub for space debris information",
      link: "https://www.esa.int/Safety_Security/Space_Debris",
      type: "Official Source",
    },
    {
      title: "Space Debris: A Law and Economics Analysis",
      description: "Academic paper on the economic and legal aspects of space debris",
      link: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3192614",
      type: "Academic Paper",
    },
    {
      title: "Introduction to Space Debris",
      description: "Comprehensive online course by the International Space University",
      link: "https://www.isunet.edu/",
      type: "Course",
    },
    {
      title: "Kessler Syndrome Explained",
      description: "Video explaining the cascade effect of collisions in orbit",
      link: "https://www.youtube.com/watch?v=HVov8o9x0yI",
      type: "Video",
    },
  ];

  // Key facts about space debris
  const keyFacts = [
    {
      title: "Objects in Orbit",
      value: "28,000+",
      description: "Tracked objects currently in Earth orbit",
      icon: "satellite",
    },
    {
      title: "Debris Size",
      value: "0.5-10 cm",
      description: "Most dangerous size range that can't be easily tracked",
      icon: "warning",
    },
    {
      title: "Orbital Speed",
      value: "28,000 km/h",
      description: "Average speed of debris in low Earth orbit",
      icon: "speed",
    },
    {
      title: "Collision Risk",
      value: "Growing",
      description: "Risk increases with each new satellite launch",
      icon: "risk",
    },
  ];

  // FAQ items
  const faqItems = [
    {
      question: "What is space debris?",
      answer: "Space debris, also known as space junk, consists of defunct human-made objects in space—primarily in Earth orbit—that no longer serve a useful purpose. This includes spent rocket stages, defunct satellites, fragments from disintegration, erosion, and collisions."
    },
    {
      question: "Why is space debris a problem?",
      answer: "Space debris poses a significant threat to operational satellites and spacecraft. Even small fragments can cause serious damage due to the high orbital velocities involved. The Kessler Syndrome describes a scenario where the density of objects in low Earth orbit becomes high enough that collisions between objects could cause a cascade of collisions, rendering space activities and the use of satellites in specific orbital ranges impractical for many generations."
    },
    {
      question: "How is space debris tracked?",
      answer: "Space debris is tracked using ground-based radar, optical telescopes, and space-based sensors. The U.S. Space Surveillance Network (SSN) tracks objects larger than 10 cm in low Earth orbit and 1 meter in geostationary orbit. However, millions of smaller debris pieces remain untracked."
    },
    {
      question: "What is being done to mitigate space debris?",
      answer: "Mitigation efforts include designing spacecraft and rockets to minimize debris creation, moving defunct satellites to disposal orbits, developing technologies to remove existing debris, and establishing international guidelines for responsible space operations. The Inter-Agency Space Debris Coordination Committee (IADC) has developed debris mitigation guidelines that many space agencies follow."
    },
    {
      question: "What is the Kessler Syndrome?",
      answer: "The Kessler Syndrome, proposed by NASA scientist Donald J. Kessler in 1978, is a scenario where the density of objects in low Earth orbit becomes high enough that collisions between objects could cause a cascade of collisions. This would create an exponential increase in the amount of debris, potentially making space activities and the use of satellites in specific orbital ranges impractical for many generations."
    },
  ];

  // Timeline events
  const timelineEvents = [
    {
      year: "1957",
      event: "Sputnik 1 Launch",
      description: "The first artificial satellite marks the beginning of space debris with its rocket body becoming the first space junk.",
    },
    {
      year: "1963",
      event: "First Debris Field",
      description: "Explosion of a U.S. Transit 4A rocket stage creates the first significant debris field.",
    },
    {
      year: "1978",
      event: "Kessler Syndrome Theory",
      description: "NASA scientist Donald J. Kessler proposes the cascade effect theory of orbital debris collisions.",
    },
    {
      year: "1979",
      event: "Skylab Re-entry",
      description: "The uncontrolled re-entry of Skylab raises awareness about the need for controlled deorbiting.",
    },
    {
      year: "1996",
      event: "First Recorded Collision",
      description: "French satellite Cerise is hit by debris from an Ariane rocket stage, the first confirmed collision with cataloged debris.",
    },
    {
      year: "2007",
      event: "Chinese Anti-Satellite Test",
      description: "China destroys its Fengyun-1C satellite, creating over 3,000 trackable debris fragments.",
    },
    {
      year: "2009",
      event: "Iridium-Cosmos Collision",
      description: "First major collision between two intact satellites (Iridium 33 and Cosmos 2251) creates thousands of debris pieces.",
    },
    {
      year: "2018",
      event: "RemoveDEBRIS Mission",
      description: "First successful demonstration of technologies to capture and remove space debris.",
    },
    {
      year: "2021",
      event: "International Space Station Evasive Maneuvers",
      description: "ISS performs multiple debris avoidance maneuvers due to increasing collision risks.",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Overview
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Understanding Space Debris
            </Typography>
            <Typography variant="body1" paragraph>
              Space debris, also known as space junk, consists of defunct human-made objects in space—primarily in Earth orbit—that no longer serve a useful purpose. This includes spent rocket stages, defunct satellites, fragments from disintegration, erosion, and collisions.
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {keyFacts.map((fact, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <DataCard
                    title={fact.title}
                    value={fact.value}
                    description={fact.description}
                    icon={fact.icon}
                  />
                </Grid>
              ))}
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              The Growing Challenge
            </Typography>
            <Typography variant="body1" paragraph>
              As space activities have increased since the beginning of space exploration in the 1950s, so has the amount of debris. The problem is compounded by collisions and break-ups in orbit, which generate additional fragments. Today, there are approximately 28,000 tracked objects in orbit, but millions of smaller, untracked debris pieces pose significant risks to operational satellites and spacecraft.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              The Kessler Syndrome
            </Typography>
            <Typography variant="body1" paragraph>
              In 1978, NASA scientist Donald J. Kessler proposed what is now known as the "Kessler Syndrome" — a scenario where the density of objects in low Earth orbit becomes high enough that collisions between objects could cause a cascade of collisions. This would create an exponential increase in the amount of debris, potentially making space activities and the use of satellites in specific orbital ranges impractical for many generations.
            </Typography>
            
            <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ maxWidth: 600 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image="/static/images/Kessler.jpeg"
                  alt="Space debris visualization"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Visualization of tracked space debris objects in Low Earth Orbit (LEO). Kessler Syndrome illustration.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Impact on Space Operations
            </Typography>
            <Typography variant="body1" paragraph>
              Space debris poses significant challenges for space operations:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Collision Risks" 
                  secondary="Even small debris fragments can cause catastrophic damage to satellites and spacecraft due to the high velocities involved (typically 28,000 km/h in LEO)."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <RocketLaunchIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Mission Planning Complexity" 
                  secondary="Launch windows and trajectories must be carefully planned to avoid known debris."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SatelliteAltIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Operational Adjustments" 
                  secondary="Satellites must perform collision avoidance maneuvers, consuming precious fuel and reducing operational lifetimes."
                />
              </ListItem>
            </List>
          </Box>
        );
      case 1: // Timeline
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Space Debris Timeline
            </Typography>
            <Typography variant="body1" paragraph>
              The history of space debris parallels the history of space exploration itself. This timeline highlights key events in the evolution of the space debris problem and efforts to address it.
            </Typography>
            
            <Box sx={{ position: 'relative', my: 4 }}>
              {/* Timeline line */}
              <Box sx={{ 
                position: 'absolute', 
                left: { xs: 16, md: '50%' }, 
                transform: { xs: 'none', md: 'translateX(-50%)' },
                width: 4, 
                height: '100%', 
                bgcolor: 'primary.main',
                zIndex: 0
              }} />
              
              {/* Timeline events */}
              {timelineEvents.map((event, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative',
                    mb: 6,
                    ml: { xs: 5, md: index % 2 === 0 ? 0 : '50%' },
                    mr: { xs: 0, md: index % 2 === 0 ? '50%' : 0 },
                    pl: { xs: 0, md: index % 2 === 0 ? '50%' : 0 },
                    pr: { xs: 0, md: index % 2 === 0 ? 0 : '50%' },
                    textAlign: { xs: 'left', md: index % 2 === 0 ? 'right' : 'left' },
                  }}
                >
                  {/* Year marker */}
                  <Box sx={{ 
                    position: 'absolute',
                    left: { xs: -40, md: index % 2 === 0 ? 'auto' : '0' },
                    right: { xs: 'auto', md: index % 2 === 0 ? '0' : 'auto' },
                    transform: { xs: 'none', md: 'translateX(-50%)' },
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    bgcolor: 'background.paper',
                    border: '3px solid',
                    borderColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}>
                    <Typography variant="h6" fontWeight="bold">
                      {event.year}
                    </Typography>
                  </Box>
                  
                  {/* Event content */}
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3,
                      ml: { xs: 0, md: index % 2 === 0 ? 0 : 4 },
                      mr: { xs: 0, md: index % 2 === 0 ? 4 : 0 },
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {event.event}
                    </Typography>
                    <Typography variant="body2">
                      {event.description}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        );
      case 2: // FAQ
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1" paragraph>
              Below are answers to common questions about space debris, its impacts, and mitigation efforts.
            </Typography>
            
            {faqItems.map((item, index) => (
              <Accordion key={index} sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HelpOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      {item.question}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        );
      case 3: // Resources
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Educational Resources
            </Typography>
            <Typography variant="body1" paragraph>
              Explore these resources to learn more about space debris, its impacts, and ongoing mitigation efforts.
            </Typography>
            
            <Grid container spacing={3}>
              {resources.map((resource, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {resource.title}
                        </Typography>
                        <Chip 
                          label={resource.type} 
                          size="small" 
                          color={
                            resource.type === "Official Source" ? "primary" :
                            resource.type === "Academic Paper" ? "secondary" :
                            "default"
                          }
                        />
                      </Box>
                      <Typography variant="body2" paragraph>
                        {resource.description}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        component={Link} 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ mt: 'auto' }}
                      >
                        Visit Resource
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Recommended Books
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <HistoryEduIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Space Debris: Models and Risk Analysis" 
                    secondary="By Heiner Klinkrad (2006)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HistoryEduIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Orbital Debris: A Technical Assessment" 
                    secondary="National Research Council (1995)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HistoryEduIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="The Crowded Universe: The Search for Living Planets" 
                    secondary="By Alan Boss (2009)"
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
        );
      case 4: // Mitigation
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Space Debris Mitigation
            </Typography>
            <Typography variant="body1" paragraph>
              Addressing the space debris problem requires a multi-faceted approach involving prevention, mitigation, and remediation strategies.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Prevention Strategies
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FactCheckIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Design for Demise
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Spacecraft are designed to completely burn up during atmospheric re-entry, leaving no debris that could reach Earth's surface. This approach uses materials that will fully ablate during re-entry and structural designs that promote break-up at high altitudes.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ScienceIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Passivation
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Removing all stored energy (such as residual propellants, batteries, and pressurized systems) from a spacecraft at the end of its mission to prevent explosions that could create debris. This is now a standard practice for responsible spacecraft operators.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              End-of-Life Disposal
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PublicIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Controlled Re-entry
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      For spacecraft in Low Earth Orbit (LEO), operators perform controlled deorbit maneuvers to ensure the spacecraft re-enters Earth's atmosphere within 25 years of mission completion, as recommended by international guidelines. This helps prevent the accumulation of defunct satellites in valuable orbital regions.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SatelliteAltIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Graveyard Orbits
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      For satellites in geostationary orbit (GEO), where atmospheric drag is negligible, operators boost satellites to a "graveyard orbit" approximately 300 km above GEO at the end of their operational life. This prevents them from interfering with active satellites while preserving the valuable GEO region.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              Active Debris Removal Technologies
            </Typography>
            <Typography variant="body1" paragraph>
              Several innovative technologies are being developed to actively remove existing debris from orbit:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <RocketLaunchIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Robotic Capture" 
                  secondary="Using robotic arms or nets to capture debris objects and deorbit them."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <RocketLaunchIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Harpoons and Tethers" 
                  secondary="Firing harpoons to capture debris and using tethers to drag them into lower orbits."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <RocketLaunchIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Laser Ablation" 
                  secondary="Using ground-based lasers to create plasma jets on debris surfaces, altering their orbits."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <RocketLaunchIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Electrodynamic Tethers" 
                  secondary="Deploying conductive tethers that interact with Earth's magnetic field to generate drag."
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                International Cooperation
              </Typography>
              <Typography variant="body2" paragraph>
                Addressing the space debris problem requires international cooperation. The Inter-Agency Space Debris Coordination Committee (IADC) and the United Nations Committee on the Peaceful Uses of Outer Space (COPUOS) have developed guidelines for debris mitigation that many space agencies follow. However, these guidelines are not legally binding, and compliance varies among spacefaring nations.
              </Typography>
              <Typography variant="body2">
                Efforts are ongoing to develop more robust international frameworks for space debris mitigation and remediation, including potential legal mechanisms to ensure compliance and address liability issues related to debris removal.
              </Typography>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Space Debris Education"
        description="Learn about the challenges of space debris, its impacts on space operations, and efforts to address this growing problem."
      />

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="education content tabs"
        >
          <Tab label="Overview" />
          <Tab label="Timeline" />
          <Tab label="FAQ" />
          <Tab label="Resources" />
          <Tab label="Mitigation" />
        </Tabs>
      </Paper>

      {/* Content Area */}
      <Paper sx={{ p: 3 }}>
        {renderTabContent()}
      </Paper>
    </Container>
  );
};

export default EducationPage; 