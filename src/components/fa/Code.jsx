/** @format */

import {
  Alert,
  AlertTitle,
  Button,
  DialogContent,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Chip,
  InputAdornment
} from "@mui/material";
import { Email, VpnKey } from "@mui/icons-material";
import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function extractEmailParts(email) {
  const atIndex = email.indexOf("@"); // Find the index of the @ symbol
  const username = email.substring(0, atIndex); // Extract the characters before the @ symbol
  const domain = email.substring(atIndex + 1); // Extract the characters after the @ symbol

  const modifiedUsername =
    username.slice(0, 2) + "*".repeat(username.length - 4) + username.slice(-2);
  const modifiedEmail = `${modifiedUsername}@${domain}`;

  return modifiedEmail;
}

export const Code = ({ email }) => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const ref = useRef();
  const [codeError, setCodeError] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes countdown
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    codeError && setCodeError(false);
    setLoading(true);
    let fd = new FormData();
    fd.append("code", ref.current.value);
    fd.append("codeEmail", email);
    await axios
      .post("clientLogin.php", fd)
      .then((result) => {
        if (result.data.res) {
          localStorage.setItem("client_id", result.data.id);
          localStorage.setItem("client_name", result.data.name);
          localStorage.setItem("client_authToken", result.data.token);
          navigate("/");
        } else {
          setCodeError(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setCodeError(true);
        setLoading(false);
        console.log(err);
      });
  };

  const handleResend = async () => {
    // Add resend logic here
    setCountdown(300);
    setCanResend(false);
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
          <AlertTitle sx={{ fontWeight: 600 }}>Verification Code Sent</AlertTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Email sx={{ fontSize: '1rem', color: 'text.secondary' }} />
            <Typography variant="body2">
              Check your email <strong>{extractEmailParts(email)}</strong> for the 6-digit code
            </Typography>
          </Box>
        </Alert>
      </Box>

      <Box component='form' onSubmit={handleSubmit}>
        <TextField
          error={codeError}
          type="text"
          autoFocus
          inputRef={ref}
          fullWidth
          label="Enter Verification Code"
          placeholder="000000"
          required
          helperText={codeError ? "Invalid verification code. Please try again." : "Enter the 6-digit code from your email"}
          sx={{ mb: 3 }}
          inputProps={{
            maxLength: 6,
            style: { textAlign: 'center', fontSize: '1.4rem', fontWeight: 600, letterSpacing: '0.5rem' }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <VpnKey sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Chip 
            label={countdown > 0 ? `Expires in ${formatTime(countdown)}` : "Code expired"}
            color={countdown > 60 ? "success" : countdown > 0 ? "warning" : "error"}
            size="small"
            sx={{ fontWeight: 500 }}
          />
          
          {canResend && (
            <Button 
              variant="text" 
              size="small" 
              onClick={handleResend}
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
                color: '#3b82f6'
              }}
            >
              Resend Code
            </Button>
          )}
        </Box>

        <Button
          disabled={isLoading || countdown === 0}
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mb: 1 }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Verifying...
            </Box>
          ) : (
            'Verify & Sign In'
          )}
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          This helps keep your RedApple Air account secure
        </Typography>
      </Box>
    </DialogContent>
  );
};
