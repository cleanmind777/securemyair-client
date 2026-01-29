/** @format */

import { 
  Button, 
  CssBaseline, 
  Box, 
  TextField, 
  Typography, 
  Container, 
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Fade,
  Slide,
  IconButton,
  Link,
  InputAdornment
} from '@mui/material';
import { Email, LockOutlined, Visibility, VisibilityOff, PersonOutlined, Air, Thermostat, AcUnit } from '@mui/icons-material';
import Logo from '../assests/logo.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ResetPasswordDialog from '../components/reset/ResetPasswordDialog';
import FaDialog from "../components/fa/FaDialog";

function Copyright(props) {
  return (
    <Typography variant='body2' color='text.secondary' align='center' {...props}>
      {'Copyright © '}
      <Link color='inherit'>SecureMyAir.com</Link> {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { 
      main: '#667eea',
      light: '#764ba2',
      dark: '#4338ca',
      contrastText: '#ffffff'
    },
    secondary: { 
      main: '#f093fb',
      light: '#f5576c',
      dark: '#c850c0',
    },
    background: { 
      default: '#0f0f23',
      paper: 'rgba(255,255,255,0.95)'
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568'
    }
  },
  shape: { borderRadius: 20 },
  typography: { 
    fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, 'Segoe UI', Roboto", 
    fontWeightRegular: 500,
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    body1: {
      fontWeight: 500
    }
  },
  components: {
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)',
              transform: 'translateY(-1px)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255,255,255,0.95)',
              transform: 'translateY(-2px)',
              boxShadow: '0 15px 35px rgba(102,126,234,0.15)'
            }
          },
        },
      },
    },
    MuiButton: { 
      styleOverrides: { 
        root: { 
          borderRadius: 16, 
          paddingBlock: 14,
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '1.1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 25px rgba(102,126,234,0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 15px 35px rgba(102,126,234,0.4)'
          },
          '&:active': {
            transform: 'translateY(0px)'
          }
        } 
      } 
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)'
        }
      }
    }
  },
});

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [emailError, setEmailError] = useState(false);
  const [pwdError, setPwdError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem('client_id');
  const [dialog, setdialog] = useState({ status: false });
  const emailRef = useRef();
  const pwdRef = useRef();

  useEffect(() => {
    if (user) navigate('/');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    emailError && setEmailError(false);
    pwdError && setPwdError(false);
    
    const formData = new FormData();
    formData.append('email', emailRef.current.value);
    formData.append('password', pwdRef.current.value);
    // Request backend to bypass 2FA if supported
    formData.append('no2fa', '1');

    await axios
      .post('clientLogin.php', formData)
      .then((result) => {
        console.log(result);
        const res = result.data['res'];
        // If backend returns full credentials, log in immediately (no 2FA)
        if (res === 'true' && result.data.id && result.data.token) {
          localStorage.setItem('client_id', result.data.id);
          localStorage.setItem('client_name', result.data.name || emailRef.current.value);
          localStorage.setItem('client_authToken', result.data.token);
          setLoading(false);
          navigate('/');
        } else if (res === 'true') {
          // Fallback to existing 2FA flow if token/id not provided
          setEmail(result.data.email || emailRef.current.value);
            setdialog({ status: true, body: "fa" });
          setLoading(false);
        } else if (res === 'Password Incorrent') {
          setPwdError(true);
          setLoading(false);
        } else {
          setEmailError(true);
          setLoading(false);
        }
      })
      .catch((error) => { 
        console.log(error); 
        setLoading(false);
        setEmailError(true);
      });
  };

  const handleForgot = () => {
    setdialog({ status: true, body: "pas" });
  };

  const handleCloseDialog = () => {
    setdialog({ status: false });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box 
            sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `
            linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 20%, #f0fdf4 40%, #fefce8 60%, #f8fafc 80%, #ffffff 100%),
            radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 35%),
            radial-gradient(circle at 85% 75%, rgba(34, 197, 94, 0.06) 0%, transparent 35%),
            radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.04) 0%, transparent 40%)
          `,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 40px 60px at 10% 20%, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%),
              radial-gradient(ellipse 35px 50px at 90% 80%, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 50%, transparent 70%),
              radial-gradient(ellipse 45px 55px at 80% 15%, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.04) 50%, transparent 70%),
              radial-gradient(ellipse 30px 45px at 20% 85%, rgba(249, 115, 22, 0.12) 0%, rgba(249, 115, 22, 0.04) 50%, transparent 70%),
              linear-gradient(45deg, transparent 48%, rgba(59, 130, 246, 0.1) 49%, rgba(59, 130, 246, 0.1) 51%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, rgba(34, 197, 94, 0.08) 49%, rgba(34, 197, 94, 0.08) 51%, transparent 52%)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 300px 300px, 250px 250px',
            animation: 'airFlow 12s ease-in-out infinite',
            opacity: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.9) 2px, transparent 3px),
              radial-gradient(circle at 85% 35%, rgba(255, 255, 255, 0.7) 1.5px, transparent 2.5px),
              radial-gradient(circle at 25% 75%, rgba(255, 255, 255, 0.8) 1px, transparent 2px),
              radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.6) 2px, transparent 3px),
              radial-gradient(circle at 45% 55%, rgba(255, 255, 255, 0.5) 1px, transparent 2px),
              radial-gradient(circle at 65% 85%, rgba(255, 255, 255, 0.7) 1.5px, transparent 2.5px),
              radial-gradient(circle at 35% 15%, rgba(59, 130, 246, 0.3) 1px, transparent 1.5px),
              radial-gradient(circle at 55% 85%, rgba(34, 197, 94, 0.3) 1px, transparent 1.5px),
              radial-gradient(circle at 85% 55%, rgba(168, 85, 247, 0.2) 1px, transparent 1.5px)
            `,
            backgroundSize: '200px 200px, 180px 180px, 160px 160px, 220px 220px, 140px 140px, 190px 190px, 130px 130px, 170px 170px, 150px 150px',
            animation: 'cleanAirFlow 15s ease-in-out infinite',
            opacity: 0.6
          },
        }}
      >
        <style>
          {`
            @keyframes airFlow {
              0%, 100% { 
                transform: translateX(0px) translateY(0px);
                opacity: 0.8;
              }
              25% { 
                transform: translateX(10px) translateY(-5px);
                opacity: 1;
              }
              50% { 
                transform: translateX(-5px) translateY(8px);
                opacity: 0.9;
              }
              75% { 
                transform: translateX(8px) translateY(-3px);
                opacity: 1;
              }
            }
            @keyframes cleanAirFlow {
              0%, 100% { 
                transform: translateX(0px) translateY(0px) scale(1);
                opacity: 0.6;
              }
              20% { 
                transform: translateX(-8px) translateY(5px) scale(1.1);
                opacity: 0.8;
              }
              40% { 
                transform: translateX(12px) translateY(-8px) scale(0.9);
                opacity: 0.7;
              }
              60% { 
                transform: translateX(-6px) translateY(10px) scale(1.05);
                opacity: 0.9;
              }
              80% { 
                transform: translateX(8px) translateY(-4px) scale(0.95);
                opacity: 0.8;
              }
            }
          `}
        </style>

        <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={true} timeout={800}>
            <Card
              elevation={0}
              sx={{
                position: 'relative',
                width: { xs: '95%', sm: 420, md: 460 },
                maxWidth: 500,
                zIndex: 10,
                mx: 'auto'
              }}
            >
              <CardContent sx={{ p: { xs: 4, sm: 5, md: 6 } }}>
                <Slide direction="down" in={true} timeout={1000}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Box
                      component='img'
                      src={Logo}
                      alt='SecureMyAir Logo'
                      sx={{ 
                        width: { xs: 100, sm: 120 }, 
                        height: { xs: 100, sm: 120 }, 
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(102,126,234,0.3), 0 0 0 1px rgba(255,255,255,0.2)',
                        mb: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05) rotateY(5deg)',
                          boxShadow: '0 25px 50px rgba(102,126,234,0.4)'
                        }
                      }}
                    />
                    <Typography 
                      component='h1' 
                      variant='h4' 
                      sx={{ 
                        background: 'linear-gradient(135deg, #059669 0%, #3b82f6 50%, #8b5cf6 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                        textAlign: 'center'
                      }}
                    >
                      Welcome Back
                    </Typography>
                    <Typography 
                      variant='body1' 
                      color='text.secondary'
                      sx={{ textAlign: 'center', fontWeight: 500, mb: 1 }}
                    >
                      Sign in to your SecureMyAir portal
                    </Typography>
                    <Typography 
                      variant='body2' 
                      color='text.secondary'
                      sx={{ textAlign: 'center', opacity: 0.8, fontStyle: 'italic' }}
                    >
                      Managing Air Purifiers • Coolers • Heating Systems
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, opacity: 0.6 }}>
                      <Air sx={{ color: '#3b82f6', fontSize: '1.2rem' }} />
                      <AcUnit sx={{ color: '#06b6d4', fontSize: '1.2rem' }} />
                      <Thermostat sx={{ color: '#f59e0b', fontSize: '1.2rem' }} />
                    </Box>
                  </Box>
                </Slide>

                <Slide direction="up" in={true} timeout={1200}>
                  <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                      error={emailError}
                      margin='normal'
                      inputRef={emailRef}
                required
                fullWidth
                      id='email'
                      label='Email Address'
                      name='email'
                      autoComplete='email'
                autoFocus
                      helperText={emailError && 'Invalid Email'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlined sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />

              <TextField
                      error={pwdError}
                      margin='normal'
                      inputRef={pwdRef}
                required
                fullWidth
                      name='password'
                      label='Password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='current-password'
                      helperText={pwdError && 'Password Incorrect'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge='end'
                              sx={{ color: 'text.secondary' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                    />

              <Button
                      disabled={isLoading} 
                      type='submit' 
                fullWidth
                      variant='contained' 
                      size='large'
                      sx={{ mb: 2 }}
                    >
                      {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                          Signing in...
                        </Box>
                      ) : (
                        'Sign In'
                      )}
              </Button>

                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Link 
                        onClick={handleForgot} 
                        sx={{ 
                          cursor: 'pointer',
                          fontWeight: 500,
                          textDecoration: 'none',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }} 
                        variant='body2'
                      >
                        Forgot your password?
                      </Link>
            </Box>

                    <Copyright sx={{ opacity: 0.7 }} />
          </Box>
                </Slide>
              </CardContent>
            </Card>
          </Fade>
        </Container>

        {dialog.status && (
          <>
            {dialog.body === "pas" ? (
              <ResetPasswordDialog open={true} onClose={handleCloseDialog} />
            ) : (
              <FaDialog email={email} open={true} onClose={handleCloseDialog} />
            )}
          </>
        )}
      </Box>
      </ThemeProvider>
  );
}
