import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Link
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import EmailIcon from '@mui/icons-material/Email';

// Components
import PageHeader from '../components/PageHeader';

const PrivacyPolicyPage = () => {
  const lastUpdated = "June 15, 2023";

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <PageHeader 
        title="Privacy Policy" 
        subtitle="How we handle your data"
        icon={<PrivacyTipIcon fontSize="large" />}
      />

      <Paper sx={{ p: 4, mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Updated: {lastUpdated}
          </Typography>
          <Typography paragraph>
            At Space Debris Monitor, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website or use our API services.
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
            please do not access the site.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Information We Collect
          </Typography>
          <Typography paragraph>
            We collect information that you voluntarily provide to us when you register on the website, 
            express interest in obtaining information about us or our products and services, participate 
            in activities on the website, or otherwise contact us.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Typography paragraph>
            The personal information that we collect depends on the context of your interactions with us 
            and the website, the choices you make, and the products and features you use. The personal 
            information we collect may include the following:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Name and Contact Data" 
                secondary="We collect your first and last name, email address, postal address, phone number, and other similar contact data."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Credentials" 
                secondary="We collect passwords, password hints, and similar security information used for authentication and account access."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Usage Data" 
                secondary="We collect data about your activity on our website, such as which pages you visit, how long you stay, and what actions you take."
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            How We Use Your Information
          </Typography>
          <Typography paragraph>
            We use personal information collected via our website for a variety of business purposes 
            described below. We process your personal information for these purposes in reliance on 
            our legitimate business interests, in order to enter into or perform a contract with you, 
            with your consent, and/or for compliance with our legal obligations.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="To facilitate account creation and login process" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="To send administrative information to you" 
                secondary="Such as changes to our terms, conditions, and policies."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="To protect our Services" 
                secondary="We may use your information as part of our efforts to keep our website safe and secure."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="To enforce our terms, conditions, and policies" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="To respond to legal requests and prevent harm" 
                secondary="If we receive a subpoena or other legal request, we may need to inspect the data we hold to determine how to respond."
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Disclosure of Your Information
          </Typography>
          <Typography paragraph>
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </Typography>
          <Typography variant="h6" gutterBottom>
            By Law or to Protect Rights
          </Typography>
          <Typography paragraph>
            If we believe the release of information about you is necessary to respond to legal process, 
            to investigate or remedy potential violations of our policies, or to protect the rights, 
            property, and safety of others, we may share your information as permitted or required by 
            any applicable law, rule, or regulation.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Third-Party Service Providers
          </Typography>
          <Typography paragraph>
            We may share your information with third parties that perform services for us or on our behalf, 
            including payment processing, data analysis, email delivery, hosting services, customer service, 
            and marketing assistance.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Marketing Communications
          </Typography>
          <Typography paragraph>
            With your consent, or with an opportunity for you to withdraw consent, we may share your 
            information with third parties for marketing purposes, as permitted by law.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Security of Your Information
          </Typography>
          <Typography paragraph>
            We use administrative, technical, and physical security measures to help protect your personal 
            information. While we have taken reasonable steps to secure the personal information you provide 
            to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, 
            and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </Typography>
          <Typography paragraph>
            Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. 
            Therefore, we cannot guarantee complete security if you provide personal information.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Privacy Rights
          </Typography>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Typography paragraph>
            You may at any time review or change the information in your account or terminate your account by:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Logging into your account settings and updating your account" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Contacting us using the contact information provided below" 
              />
            </ListItem>
          </List>
          <Typography paragraph>
            Upon your request to terminate your account, we will deactivate or delete your account and 
            information from our active databases. However, some information may be retained in our files 
            to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of 
            Use and/or comply with legal requirements.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography paragraph>
            If you have questions or comments about this Privacy Policy, please contact us at:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmailIcon sx={{ mr: 1 }} color="primary" />
            <Link href="mailto:privacy@spacedebris-monitor.org">
              privacy@spacedebris-monitor.org
            </Link>
          </Box>
          <Button 
            variant="contained" 
            color="primary"
            component={Link}
            href="/contact"
            startIcon={<SecurityIcon />}
            sx={{ mt: 2 }}
          >
            Contact Our Privacy Team
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicyPage; 