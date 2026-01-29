/** @format */

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewPass = ({ email }) => {
  const [user, setUser] = useState();
  const [msg, setMsg] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const ref = useRef();
  const cRef = useRef();
  const [passError, setPassError] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (ref.current.value === cRef.current.value) {
      msg && setMsg(false);
      setLoading(true);
      let fd = new FormData();
      fd.append('password', ref.current.value);
      fd.append('passEmail', email);
      await axios
        .post('reset.php', fd)
        .then(res => {
          if (res.data.res) {
            localStorage.setItem('client_id', res.data.id);
            localStorage.setItem('client_name', res.data.name);
            localStorage.setItem('client_authToken', res.data.token);
            setUser(res.data.email);
          } else {
            setPassError(true);
            setLoading(false);
          }
        })
        .catch(err => {
          setPassError(true);
          setLoading(false);
          console.log(err);
        });
    } else {
      setMsg(true);
    }
  };

  const handleChange = e => {
    e.target.value !== cRef.current.value ? setPassError(true) : setPassError(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <DialogContent sx={{ px: 4, pb: 4 }}>
        {!user ? (
          <>
            <Box sx={{ mb: 3 }}>
              <Alert 
                severity='success'
                sx={{ 
                  borderRadius: 3,
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  '& .MuiAlert-icon': {
                    color: '#10b981'
                  }
                }}
              >
                <AlertTitle sx={{ fontWeight: 600 }}>Email Verified</AlertTitle>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Your email is verified. Please enter your new password below.
                </Typography>
              </Alert>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                autoFocus
                inputRef={cRef}
                margin='normal'
                fullWidth
                label='Enter New Password'
                type={showPassword ? 'text' : 'password'}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                error={passError || msg}
                inputRef={ref}
                margin='normal'
                onChange={handleChange}
                fullWidth
                label='Confirm New Password'
                type={showConfirmPassword ? 'text' : 'password'}
                required
                helperText={msg ? 'The passwords do not match' : 'Re-enter your new password to confirm'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                    Updating Password...
                  </Box>
                ) : (
                  'Update Password'
                )}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Alert 
                severity='success'
                sx={{ 
                  borderRadius: 3,
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  '& .MuiAlert-icon': {
                    color: '#10b981'
                  }
                }}
              >
                <AlertTitle sx={{ fontWeight: 600 }}>Password Updated Successfully</AlertTitle>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Your password has been changed successfully. You can now sign in with your new password.
                </Typography>
              </Alert>
            </Box>
            
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(59, 130, 246, 0.1)',
              textAlign: 'center'
            }}>
              <CheckCircle sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Account Ready
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can now access your RedApple Air dashboard
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>

      {user && (
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            variant='contained' 
            onClick={() => navigate('/')}
            fullWidth
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
            Go to Dashboard
          </Button>
        </DialogActions>
      )}
    </>
  );
};

export default NewPass;
