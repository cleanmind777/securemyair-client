/** @format */

import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Box';
import CircleIcon from '@mui/icons-material/Circle';
import { styled } from '@mui/material/styles';
import {
  Button,
  ListItem,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  List,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import Relay from '../components/Relay';
import { useEffect, useState } from 'react';
import Logo from '../assests/logo.png';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useRef } from 'react';

const circleStyle = {
  width: '2.7vh',
  height: '2.7vh',
  ml: '12px',
};
const hdnCircle = {
  width: '2.7vh',
  height: '2.7vh',
  ml: '12px',
  visibility: 'hidden',
};
const shortButton = {
  width: '9vh',
  padding: ' .5vh 3vh',
  fontSize: '1.5vh',
};
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: '5px',
    color: 'white!important',
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: '15px',
      fontSize: '1vh',
      textTransform: 'capitalize',
    },
    '&:first-of-type': {
      borderRadius: '15px',
      fontSize: '1vh',
      textTransform: 'capitalize',
    },
  },
}));
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: '#1976d2cc !important',
    padding: '0.4rem 0.6rem',
  },
}));
const Control = () => {
  const navigate = useNavigate();
  const startRef = useRef();
  const [res, setRes] = useState({});
  const endRef = useRef();
  const sotRef = useRef();
  const tvocRef = useRef();
  const pm10Ref = useRef();
  const pm25Ref = useRef();
  const co2Ref = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [alignment, setAlignment] = useState('0');
  const api = localStorage.getItem('client_api');
  const token = localStorage.getItem("client_authToken");

  const pushData = async id => {
    await axios
      .get("../system.php", {
        params: { api: api, relay: id },
        headers: { Authorization: token },
      })
      .then((result) => {
      if (result.data.error === "Expired token") {
        localStorage.clear();
        navigate("/login");
      }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    let intervalId;
    const fetchDta = async () => {
      await axios
        .get("../system.php", {
          params: { api: api },
          headers: { Authorization: token },
        })
        .then((result) => {
          if (result.data.error === "Expired token") {
            localStorage.clear();
            navigate("/login");
          }
          const newRes = result.data;
          if (JSON.stringify(newRes) !== JSON.stringify(res)) {
            setRes(newRes);
            setAlignment(newRes.aop);
          }
        })
        .catch((error) => console.log(error));
    };
    fetchDta();
    intervalId = setInterval(fetchDta, 1000);
    return () => clearInterval(intervalId);
  }, [api, res]);

  const handleRelayBtnClick = id => {
    pushData(id);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  const handleSubmit = async e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('start', startRef.current.value === '' ? res.start : startRef.current.value);
    formData.append('end', endRef.current.value === '' ? res.end : endRef.current.value);
    formData.append('sot', sotRef.current.value === '' ? res.sot : sotRef.current.value);

    await axios
      .post(`../system.php?api=${api}`, formData, {
        headers: { Authorization: token },
      })
      .then((result) => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          navigate("/login");
        }
        startRef.current.value = "";
        endRef.current.value = "";
        sotRef.current.value = "";
        tvocRef.current.value = "";
        pm10Ref.current.value = "";
        pm25Ref.current.value = "";
        co2Ref.current.value = "";
      })
      .catch((error) => console.log(error));
  };

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const mainStyle = {
    flex: 1,
    width: { xs: '95%', sm: '70%' },
    minWidth: { xs: '95%', sm: '900px' },
    display: 'flex',
    borderRadius: '1vh',
    backgroundColor: 'white',
    // overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '.75em',
  };
  const parant = {
    padding: isMobile ? '1vh' : '0 5vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };
  return (
    <div style={parant}>
      <div style={mainStyle}>
        <Typography
          align='left'
          fontSize={'auto'}
          variant='h4'
          pl={2}
          fontWeight={'bold'}
          sx={{
            textDecoration: 'Underline',
            textAlign: 'center',
            mb: '.1vh',
            fontSize: '3vh !important',
            // height: '6.5vh',
          }}>
          SYSTEM OVERRIDE
        </Typography>

        <Paper
          sx={{
            height: '80vh',
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: '1vh',
            display: 'flex',
          }}>
          <List
            component='nav'
            aria-label='relay controld'
            sx={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
            }}>
            <Relay
              id='1'
              lable={
                <Typography fontSize='2.4vh' fontWeight='bold'>
                  Override 1
                </Typography>
              }
              btn={res.ovr1}
              ind={res.ovr1_ind}
              onBtnClick={handleRelayBtnClick}
            />
            <Relay
              id='2'
              lable={
                <Typography fontSize='2.4vh' fontWeight='bold'>
                  Override 2
                </Typography>
              }
              btn={res.ovr2}
              ind={res.ovr2_ind}
              onBtnClick={handleRelayBtnClick}
            />

            <ListItem sx={{ padding: '0.1rem 1rem', flex: 1 }} divider>
              <ListItemText
                sx={{ m: 0, fontSize: '2vh !important' }}
                primary={
                  <Typography fontSize='2.4vh' fontWeight='bold'>
                    System RST
                  </Typography>
                }
              />
              <Button
                variant='contained'
                size='large'
                onClick={() => handleRelayBtnClick('3')}
                sx={shortButton}>
                {res.rst === '1' ? 'Release' : 'Press'}
              </Button>
              <CircleIcon sx={hdnCircle} />
            </ListItem>
            <ListItem sx={{ padding: '0.1rem 1rem', flex: 1 }} divider>
              <ListItemText
                sx={{ m: 0, fontSize: '2vh !important' }}
                primary={
                  <Typography fontSize='2.4vh' fontWeight='bold'>
                    Select Mode
                  </Typography>
                }
              />
              <StyledToggleButtonGroup
                sx={{ bgcolor: 'gray', height: '4.5vh', alignItems: 'center' }}
                color='primary'
                value={alignment}
                exclusive
                onChange={handleChange}>
                <StyledToggleButton onClick={() => handleRelayBtnClick('4')} value='1'>
                  <Typography fontSize='2vh'>Auto</Typography>
                </StyledToggleButton>
                <StyledToggleButton onClick={() => handleRelayBtnClick('5')} value='0'>
                  <Typography fontSize='2vh'>OFF</Typography>
                </StyledToggleButton>
                <StyledToggleButton onClick={() => handleRelayBtnClick('6')} value='2'>
                  <Typography fontSize='2vh'>Program</Typography>
                </StyledToggleButton>
              </StyledToggleButtonGroup>
            </ListItem>

            <form
              style={{ flex: 3, display: 'flex', flexDirection: 'column' }}
              onSubmit={handleSubmit}>
              <div
                style={{
                  flex: 3,
                  display: 'flex',
                  margin: '0px 5px ',
                  flexDirection: 'column',
                  border: '2px solid black',
                  borderRadius: '1vh',
                  marginBottom: '.5vh',
                }}>
                <ListItem sx={{ padding: '0.2rem 1rem', flex: 1 }} divider>
                  <ListItemText
                    sx={{ m: 0, fontSize: '2vh !important' }}
                    primary={
                      <Typography fontSize='2.4vh' fontWeight='bold'>
                        Shift Start Time
                      </Typography>
                    }
                  />
                  <input
                    ref={startRef}
                    placeholder={res.start}
                    style={{
                      height: '2vh',
                      fontSize: '1.7vh',
                      width: '15%',
                      textAlign: 'center',
                      borderColor: 'whitesmoke',
                    }}
                  />
                </ListItem>
                <ListItem sx={{ padding: '0.2rem 1rem', flex: 1 }} divider>
                  <ListItemText
                    sx={{ m: 0, fontSize: '2vh !important' }}
                    primary={
                      <Typography fontSize='2.4vh' fontWeight='bold'>
                        Shift End Time
                      </Typography>
                    }
                  />
                  <input
                    placeholder={res.end}
                    ref={endRef}
                    style={{
                      height: '2vh',
                      fontSize: '1.7vh',
                      width: '15%',
                      textAlign: 'center',
                      borderColor: 'whitesmoke',
                    }}
                  />
                </ListItem>
                <ListItem sx={{ padding: '0.2rem 1rem', flex: 1 }} divider>
                  <ListItemText
                    sx={{ m: 0, fontSize: '2vh !important' }}
                    primary={
                      <Typography fontSize='2.4vh' fontWeight='bold'>
                        System Override Time
                      </Typography>
                    }
                  />
                  <input
                    placeholder={res.sot}
                    ref={sotRef}
                    style={{
                      height: '2vh',
                      fontSize: '1.7vh',
                      width: '15%',
                      textAlign: 'center',
                      borderColor: 'whitesmoke',
                    }}
                  />
                </ListItem>
              </div>
              <input type='submit' hidden />
            </form>
            <div
              style={{
                flex: 3,
                display: 'flex',
                margin: '0px 5px ',
                flexDirection: 'column',
                border: '2px solid black',
                borderRadius: '1vh',
                marginBottom: '.5vh',
              }}>
              <ListItem sx={{ padding: '0 1rem', flex: 1 }} divider>
                <ListItemText
                  sx={{ m: 0, fontSize: '2vh !important' }}
                  primary={
                    <Typography fontSize='2.4vh' fontWeight='bold'>
                      System Violated
                    </Typography>
                  }
                />

                <CircleIcon htmlColor={res.sv === '1' ? 'red' : 'gray'} sx={circleStyle} />
              </ListItem>
              <ListItem sx={{ padding: '0 1rem', flex: 1 }} divider>
                <ListItemText
                  sx={{ m: 0, fontSize: '2vh !important' }}
                  primary={
                    <Typography fontSize='2.4vh' fontWeight='bold'>
                      Replace Filter
                    </Typography>
                  }
                />
                <CircleIcon htmlColor={res.filter === '1' ? 'red' : 'gray'} sx={circleStyle} />
              </ListItem>
              <ListItem sx={{ padding: '0 1rem', flex: 1 }} divider>
                <ListItemText
                  sx={{ m: 0, fontSize: '2vh !important' }}
                  primary={
                    <Typography fontSize='2.4vh' fontWeight='bold'>
                      HVAC Status
                    </Typography>
                  }
                />
                <Typography
                  fontSize='2vh'
                  sx={{ border: '1px solid black', p: 1, borderRadius: 3 }}>
                  {res.oc}
                </Typography>
              </ListItem>
            </div>
          </List>
        </Paper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            height: ' 13vh',
            alignItems: 'center',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '16%' }}>
            <img src={Logo} alt={'Logo'} width='90%' />{' '}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography fontWeight={'bold'} fontSize='2.5vh'>
              {localStorage.getItem('client_machine')}
            </Typography>
            <Typography fontWeight={'bold'} mt={0.5} fontSize='2.5vh'>
              {localStorage.getItem('client_user')}
            </Typography>
            <Typography fontSize='2vh' mt={0.5} textAlign='center'>
              Next Inspection Date: {isMobile && <br />}
              {localStorage.getItem('client_date')}
            </Typography>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              height: '100%',
            }}>
            <Button
              sx={{
                width: '6em',
                height: '3vh',
                mb: '5px',
                fontSize: '1.5vh',
                textTransform: 'capitalize',
              }}
              variant='contained'
              onClick={() => window.history.back()}
              size='small'>
              Back
            </Button>
            <Button
              sx={{
                width: '6em',
                height: '3vh',
                mb: '5px',
                fontSize: '1.5vh',
                textTransform: 'capitalize',
              }}
              width={100}
              variant='contained'
              onClick={() => navigate('/')}
              size='small'>
              Machines
            </Button>
            <Button
              sx={{
                width: '6em',
                height: '3vh',
                fontSize: '1.5vh',
                textTransform: 'capitalize',
              }}
              onClick={handleLogout}
              variant='contained'
              size='small'>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Control;
