import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Divider,
  useTheme,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import BookIcon from '@mui/icons-material/Book';
import SettingsIcon from '@mui/icons-material/Settings';
import { siteConfig, navigationConfig } from '../config';

const HomePage: React.FC = () => {
  const theme = useTheme();
  
  // Find first doc page for the "Get Started" button
  const firstDocPage = navigationConfig.sidebar.docs[0]?.items?.[0]?.id || 'introduction';

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          backgroundColor: 'var(--background-color)',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: 'var(--text-color)',
            }}
          >
            {siteConfig.name}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 4,
              color: 'var(--text-secondary-color)',
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            A modern documentation site with a clean and intuitive interface.
            Built with React, Material UI, and MDX.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              component={RouterLink}
              to={`/docs/${firstDocPage}`}
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                backgroundColor: 'var(--primary-color)',
                '&:hover': {
                  backgroundColor: 'var(--primary-dark-color)',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              component="a"
              href={siteConfig.footerSocials?.github || 'https://github.com'}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderColor: 'var(--primary-color)',
                color: 'var(--primary-color)',
                '&:hover': {
                  borderColor: 'var(--primary-dark-color)',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              GitHub
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 6 }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {/* Feature 1 */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(46, 133, 85, 0.1)',
                    mb: 2,
                  }}
                >
                  <BookIcon sx={{ fontSize: 30, color: 'var(--primary-color)' }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Comprehensive Documentation
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Detailed guides and tutorials to help you get started quickly and make the most of our platform.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  component={RouterLink}
                  to="/docs"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: 'var(--primary-color)' }}
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(46, 133, 85, 0.1)',
                    mb: 2,
                  }}
                >
                  <CodeIcon sx={{ fontSize: 30, color: 'var(--primary-color)' }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  API Reference
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Complete API documentation with examples, request/response formats, and error handling.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  component={RouterLink}
                  to="/api"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: 'var(--primary-color)' }}
                >
                  Explore API
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(46, 133, 85, 0.1)',
                    mb: 2,
                  }}
                >
                  <SettingsIcon sx={{ fontSize: 30, color: 'var(--primary-color)' }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Customizable
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Easily customize the documentation to match your brand with our flexible configuration options.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  component={RouterLink}
                  to="/docs/getting-started/configuration"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: 'var(--primary-color)' }}
                >
                  Configuration
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Dive into our documentation and start building amazing applications today.
          </Typography>
          <Button
            component={RouterLink}
            to={`/docs/${firstDocPage}`}
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              backgroundColor: '#fff',
              color: 'var(--primary-color)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Start Building
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage; 