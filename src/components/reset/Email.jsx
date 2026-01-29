/** @format */

import { 
  Button, 
  DialogContent, 
  TextField, 
  Typography, 
  Box,
  Alert,
  AlertTitle,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Email as EmailIcon, LockReset } from '@mui/icons-material';
import axios from 'axios';
import { useRef, useState } from 'react';

const Email = ({ next, email }) => {
  const [isLoading, setLoading] = useState(false);
  const emailRef = useRef();
  const [emailError, setEmailError] = useState(false);
  
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    emailError && setEmailError(false);
    let fd = new FormData();
    fd.append('email', emailRef.current.value);
    await axios
      .post('reset.php', fd)
      .then(res => {
        if (res.data.res === 'true') {
          email(emailRef.current.value);
          next(pre => pre + 1);
        } else {
          setEmailError(true);
          setLoading(false);
        }
      })
      .catch(err => {
        setEmailError(true);
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <DialogContent sx={{ px: 4, pb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 3,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            '& .MuiAlert-icon': {
              color: '#3b82f6'
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>Reset Your Password</AlertTitle>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Enter your registered email address and we'll send you a verification code to reset your password.
          </Typography>
        </Alert>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          error={emailError}
          type='email'
          inputRef={emailRef}
          required
          fullWidth
          label='Email Address'
          autoComplete='email'
          autoFocus
          helperText={emailError ? 'Email does not exist. Please check and try again.' : 'Enter your registered email address'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: 'text.secondary' }} />
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
          size="large"
          sx={{ 
            py: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
            }
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Sending Code...
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LockReset sx={{ mr: 1, fontSize: '1.2rem' }} />
              Send Reset Code
            </Box>
          )}
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
          We'll send a 6-digit verification code to your email
        </Typography>
      </Box>
    </DialogContent>
  );
};

export default Email;
