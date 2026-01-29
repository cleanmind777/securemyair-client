/** @format */

import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  Button, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material'
import { 
  Circle as CircleIcon,
  Air,
  Thermostat,
  Opacity,
  Co2,
  Visibility,
  Security,
  CloudQueue,
  FilterDrama,
  Refresh,
  Logout,
  Settings,
  Dashboard as DashboardIcon,
  Grain
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import Logo from '../assests/logo.png'
import AlternatingDisplay from '../components/AlternatingDisplay'
import useMediaQuery from '@mui/material/useMediaQuery'

import { A, B, C, D, F, Ad } from '../assests'

const circleStyle = {
  width: '2.5vh',
  height: '2.5vh',
  minWidth: '20px',
  minHeight: '20px',
}

const Dashboard = () => {
  const [time, setTime] = useState(null)
  const [aqiImg, setAqiImg] = useState(A)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const [res, setRes] = useState({})
  const [display, setDisplay] = useState('flex')
  const [adImg, setAdImg] = useState(Ad)
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const [showControls, setShowControls] = useState(false)
  const controlsHideTimerRef = useRef(null)

  const api = localStorage.getItem('client_api')
  const id = localStorage.getItem('client_id')
  const token = localStorage.getItem('client_authToken')

  const removeAnimationScript = () => {
    const node = document.getElementById('aniScript')
    node.remove()
  }
  useEffect(() => {
    let intervalId
    const fetchDta = async () => {
      await axios
        .get('../dashboard.php', {
          params: { api: api },
          headers: { Authorization: token },
        })
        .then((result) => {
          if (result.data.error === 'Expired token') {
            localStorage.clear()
            navigate('/login')
          }
          const newData = result.data
          if (JSON.stringify(newData) !== JSON.stringify(res)) {
            setRes(newData)
            let letter = newData.letter
            if (letter === 'A') {
              setAqiImg(A)
            } else if (letter === 'B') {
              setAqiImg(B)
            } else if (letter === 'C') {
              setAqiImg(C)
            } else if (letter === 'D') {
              setAqiImg(D)
            } else if (letter === 'F') {
              setAqiImg(F)
            }
            localStorage.setItem('client_machine', newData.machine)
            localStorage.setItem('client_date', newData.date)
            localStorage.setItem('client_user', newData.customer)
            setDisplay(newData.humHdnStatus ? 'flex' : 'none')
          }
        })
        .catch((error) => console.log(error))
    }
    fetchDta()
    intervalId = setInterval(fetchDta, 1000)
    return () => clearInterval(intervalId)
  }, [api, res])

  useEffect(() => {
    axios
      .get(`../advertisment.php?cid=${id}&api=${api}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        if (res.data.error === 'Expired token') {
          localStorage.clear()
          navigate('/login')
        }
        res.data.path ? setAdImg(axios.defaults.baseURL + '/' + res.data.path) : setAdImg(Ad)
        setTime(res.data.time)
      })
      .catch((err) => console.log(err))
    const node = document.createElement('script')
    node.id = 'aniScript'
    node.src = 'js/script.js'
    document.body.appendChild(node)
  }, [])
  const handleLogout = () => {
    removeAnimationScript()
    localStorage.clear()
    navigate('/login')
  }

  const backtoMachine = (e) => {
    removeAnimationScript()
    navigate('/')
  }
  // Determine overall air quality condition
  const getAQICondition = () => {
    const aqiValue = parseFloat(res.aqi) || 0;
    const letter = res.letter || 'F';
    
    const isCritical = letter === 'F' || letter === 'D';
    const isPoor = letter === 'C' || aqiValue > 50;
    const condition = letter === 'A' ? 'good'
      : letter === 'B' ? 'moderate'
      : letter === 'C' ? 'poor'
      : letter === 'D' ? 'unhealthy'
      : 'critical';
    
    return {
      isCritical,
      isPoor,
      isGood: !isCritical && !isPoor,
      color: isCritical ? '#dc2626' : isPoor ? '#f59e0b' : '#22c55e',
      status: isCritical ? 'Danger' : isPoor ? 'Fair' : 'Good',
      condition
    };
  };

  const aqiCondition = getAQICondition();

  const handleMouseActivity = () => {
    setShowControls(true)
    if (controlsHideTimerRef.current) {
      clearTimeout(controlsHideTimerRef.current)
      controlsHideTimerRef.current = null
    }
    controlsHideTimerRef.current = setTimeout(() => {
      setShowControls(false)
    }, 2500)
  }

  useEffect(() => {
    return () => {
      if (controlsHideTimerRef.current) {
        clearTimeout(controlsHideTimerRef.current)
        controlsHideTimerRef.current = null
      }
    }
  }, [])

  return (
    <>
      <style>{`
        body {
          zoom: 1 !important;
          -moz-transform: scale(1) !important;
          -webkit-transform: scale(1) !important;
          transform: scale(1) !important;
        }
      `}</style>
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        background: 'transparent',
        p: 0,
        position: 'relative',
        overflow: 'visible'
      }}
      onMouseMove={handleMouseActivity}
    >


      {/* Enhanced Main Display Area wrapped by AlternatingDisplay (HVAC ↔ Ads) */}
      <AlternatingDisplay hvacDisplayDuration={10} isEnabled={true} showSettings={true} controlsVisible={showControls}>
        <Card
          elevation={0}
          sx={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(145deg, #000000 0%, #0a0a0a 30%, #1a1a1a 70%, #0a0a0a 100%)',
            borderRadius: 0,
            overflow: 'hidden',
            position: 'relative',
            border: `2px solid ${aqiCondition.color}30`,
            boxShadow: `0 20px 60px ${aqiCondition.color}15, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
            backdropFilter: 'blur(25px)',
            animation: aqiCondition.isCritical ? 'criticalPulse 3s infinite' : aqiCondition.isPoor ? 'warningPulse 4s infinite' : 'none',
            '&::after': aqiCondition.isCritical ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
              background: `linear-gradient(45deg, ${aqiCondition.color}10, transparent, ${aqiCondition.color}10)`,
              pointerEvents: 'none',
              animation: 'sparkleBackground 2.5s infinite',
              zIndex: 0
            } : {},
            '@keyframes criticalPulse': {
              '0%, 100%': { borderColor: `${aqiCondition.color}40`, boxShadow: `0 0 20px ${aqiCondition.color}20` },
              '50%': { borderColor: `${aqiCondition.color}80`, boxShadow: `0 0 40px ${aqiCondition.color}40, 0 0 60px ${aqiCondition.color}20` }
            },
            '@keyframes warningPulse': {
              '0%, 100%': { borderColor: `${aqiCondition.color}40`, boxShadow: `0 0 15px ${aqiCondition.color}20` },
              '50%': { borderColor: `${aqiCondition.color}60`, boxShadow: `0 0 25px ${aqiCondition.color}30` }
            },
            '@keyframes sparkleBackground': {
              '0%': { opacity: 0.3, transform: 'rotate(0deg)' },
              '50%': { opacity: 0.6, transform: 'rotate(180deg)' },
              '100%': { opacity: 0.3, transform: 'rotate(360deg)' }
            }
          }}
        >
          <Box sx={{ 
            p: '1.5vh 2vw', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5vh', 
            position: 'relative', 
            zIndex: 1, 
            minHeight: '100vh' 
          }}>
            {/* Elegant Brand Section - 15% of screen height */}
            <Box sx={{ 
              height: '12vh',
              p: '3vh 2vw',
              mt: '0.6vh',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              borderRadius: '1vh',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
              position: 'relative',
              flexShrink: 0,
              alignItems: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                <Box sx={{ position: 'relative', '&::before': { content: '""', position: 'absolute', top: '-15px', left: '-15px', right: '-15px', bottom: '-15px', background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(59,130,246,0.3) 30%, rgba(147,51,234,0.2) 60%, transparent 80%)', borderRadius: '50%', animation: 'logoGlow 3s ease-in-out infinite', filter: 'blur(8px)', zIndex: 0 }, '&::after': { content: '""', position: 'absolute', top: '-8px', left: '-8px', right: '-8px', bottom: '-8px', background: 'conic-gradient(from 0deg, rgba(168,85,247,0.6), rgba(59,130,246,0.4), rgba(147,51,234,0.5), rgba(168,85,247,0.6))', borderRadius: '50%', animation: 'logoRotate 8s linear infinite', opacity: 0.7, zIndex: 1 }, '@keyframes logoGlow': { '0%, 100%': { opacity: 0.7, transform: 'scale(0.95)', filter: 'blur(8px)' }, '50%': { opacity: 1, transform: 'scale(1.1)', filter: 'blur(12px)' } }, '@keyframes logoRotate': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }}>
                  <img src="/logo.png" alt="SecureMyAir Brand" style={{ width: '11vh', height: '11vh', minWidth: '80px', minHeight: '80px', opacity: 0.98, filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.5)) drop-shadow(0 6px 16px rgba(0,0,0,0.4)) drop-shadow(0 0 24px rgba(168,85,247,0.6)) drop-shadow(0 0 48px rgba(59,130,246,0.4)) contrast(1.1) saturate(1.2) brightness(1.05)', borderRadius: '50%', position: 'relative', zIndex: 2, transform: 'perspective(200px) rotateX(5deg) rotateY(-3deg)', transformStyle: 'preserve-3d', border: '2px solid rgba(255,255,255,0.2)', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)' }} />
                </Box>
              <Box>
                  <Typography sx={{ background: 'linear-gradient(145deg, #00ff00 0%, #32ff32 12%, #65ff65 25%, #98ff98 37%, #cbffcb 50%, #ffffff 62%, #cbffcb 75%, #98ff98 87%, #00ff00 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3.5vh', fontWeight: 900, letterSpacing: '0.02em', mb: '0.5vh', textShadow: '0 1px 0 rgba(228, 236, 224, 0.9), 0 2px 0 rgba(90, 57, 57, 0.7), 0 3px 0 rgba(0,0,0,0.5), 0 4px 0 rgba(0,0,0,0.3), 0 6px 0 rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.4), 0 0 20px rgba(0,255,0,0.9), 0 0 40px rgba(0,255,255,0.7), 0 0 60px rgba(255,255,0,0.5), 0 0 80px rgba(255,255,255,0.3)', transform: 'perspective(300px) rotateX(10deg) rotateY(-2deg)', transformStyle: 'preserve-3d', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>SecureMyAir</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.4vh', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #00ffff 0%, #00ff80 12%, #80ff00 25%, #ffff00 37%, #ff8000 50%, #ff0080 62%, #8000ff 75%, #0080ff 87%, #00ffff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 1px 0 rgba(121, 109, 109, 0.8), 0 2px 0 rgba(0,0,0,0.6), 0 3px 0 rgba(0,0,0,0.4), 0 4px 6px rgba(0,0,0,0.3), 0 0 15px rgba(0,255,255,0.8), 0 0 25px rgba(0,255,0,0.6), 0 0 35px rgba(255,255,0,0.5), 0 0 45px rgba(255,0,255,0.4), 0 0 55px rgba(255,255,255,0.3)', transform: 'perspective(200px) rotateX(8deg)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>SECURING INDOOR AIR QUALITY</Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Elegant Main Controls and Sensors Container - 25% of screen height */}
            <Box sx={{
              height: '25vh',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)',
              borderRadius: '1.5vh',
              p: '1.5vh 1.5vw',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
              position: 'relative',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                borderRadius: '5px 5px 0 0'
              }
            }}>
              {/* System Controls Row with AQI and Temperature */}
              <Grid container spacing={2} sx={{ flex: '0 0 45%' }}>
                <Grid item xs={2}>
                  <Box sx={{
                    background: res.aqi >= 80 ? 'rgba(34,197,94,0.15)' : res.aqi >= 60 ? 'rgba(251,146,60,0.15)' : res.aqi >= 40 ? 'rgba(239,68,68,0.15)' : 'rgba(220,38,38,0.2)',
                    borderRadius: 5,
                    p: '0.8vh 0.5vw',
                  textAlign: 'center',
                    border: res.aqi >= 80 ? '1px solid rgba(34,197,94,0.4)' : res.aqi >= 60 ? '1px solid rgba(251,146,60,0.4)' : res.aqi >= 40 ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(220,38,38,0.5)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: res.aqi >= 80 ? '0 0 8px rgba(34,197,94,0.3)' : res.aqi >= 60 ? '0 0 8px rgba(251,146,60,0.3)' : res.aqi >= 40 ? '0 0 8px rgba(239,68,68,0.3)' : '0 0 12px rgba(220,38,38,0.4)'
                  }}>
                    <Typography sx={{ color: res.aqi >= 80 ? '#22c55e' : res.aqi >= 60 ? '#fb923c' : res.aqi >= 40 ? '#ef4444' : '#dc2626', fontSize: '1.5vh', fontWeight: 800, mb: 0.3, letterSpacing: '0.03em' }}>AQI</Typography>
                    <Typography sx={{ color: 'white', fontSize: '2.2vh', fontWeight: 800 }}>{res.aqi || 0}%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box sx={{ background: 'rgba(255,255,255,0.08)', borderRadius: 5, p: '0.5vh 0.3vw', textAlign: 'center', border: '1px solid rgba(34,197,94,0.3)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#22c55e', fontSize: '1.5vh', fontWeight: 800, mb: 0.3, letterSpacing: '0.03em' }}>FAN</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <CircleIcon sx={{ fontSize: '1.4vh', color: res.fan1 > 0 ? '#22c55e' : '#64748b' }} />
                      <CircleIcon sx={{ fontSize: '1.4vh', color: res.fan2 > 0 ? '#22c55e' : '#64748b' }} />
                </Box>
                  </Box>
            </Grid>
                 <Grid item xs={2}>
                     <Box sx={{ background: 'rgba(255,255,255,0.08)', borderRadius: 5, p: '0.5vh 0.3vw', textAlign: 'center', border: '1px solid rgba(168,85,247,0.3)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                       <Typography sx={{ color: '#a855f7', fontSize: '1.5vh', fontWeight: 800, mb: 0.3, letterSpacing: '0.03em' }}>UVC</Typography>
                       <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                         <CircleIcon sx={{ fontSize: '1.4vh', color: res.uvc1 > 0 ? '#a855f7' : '#64748b' }} />
                         <CircleIcon sx={{ fontSize: '1.4vh', color: res.uvc2 > 0 ? '#a855f7' : '#64748b' }} />
                       </Box>
                     </Box>
                 </Grid>
                 <Grid item xs={2}>
                     <Box sx={{ background: 'rgba(255,255,255,0.08)', borderRadius: 5, p: '0.5vh 0.3vw', textAlign: 'center', border: '1px solid rgba(251,146,60,0.3)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                       <Typography sx={{ color: '#fb923c', fontSize: '1.5vh', fontWeight: 800, mb: 0.3, letterSpacing: '0.03em' }}>OSA</Typography>
                       <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                         <CircleIcon sx={{ fontSize: '1.4vh', color: res.osa1 > 0 ? '#fb923c' : '#64748b' }} />
                         <CircleIcon sx={{ fontSize: '1.4vh', color: res.osa2 > 0 ? '#fb923c' : '#64748b' }} />
                       </Box>
                     </Box>
                 </Grid>
                 <Grid item xs={2}>
                     <Box sx={{ background: 'rgba(255,255,255,0.08)', borderRadius: 5, p: '0.5vh 0.3vw', textAlign: 'center', border: '1px solid rgba(239,68,68,0.3)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                       <Typography sx={{ color: '#ef4444', fontSize: '1.5vh', fontWeight: 800, mb: 0.3, letterSpacing: '0.03em' }}>C/H</Typography>
                       <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                         <CircleIcon sx={{ fontSize: '1.4vh', color: res.ch1 > 0 ? '#3b82f6' : '#64748b' }} />
                         <CircleIcon sx={{ fontSize: '1.4vh', color: res.ch2 > 0 ? '#ef4444' : '#64748b' }} />
                       </Box>
                     </Box>
                 </Grid>
                 <Grid item xs={2}>
                     <Box sx={{
                       background: res.temp >= 75 ? 'rgba(239,68,68,0.15)' : res.temp >= 70 ? 'rgba(251,146,60,0.15)' : res.temp >= 65 ? 'rgba(34,197,94,0.15)' : res.temp >= 60 ? 'rgba(251,146,60,0.15)' : 'rgba(14,165,233,0.15)',
                       borderRadius: 5,
                       p: '0.8vh 0.5vw',
                       textAlign: 'center',
                       border: res.temp >= 75 ? '1px solid rgba(239,68,68,0.4)' : res.temp >= 70 ? '1px solid rgba(251,146,60,0.4)' : res.temp >= 65 ? '1px solid rgba(34,197,94,0.4)' : res.temp >= 60 ? '1px solid rgba(251,146,60,0.4)' : '1px solid rgba(14,165,233,0.4)',
                       height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'
                     }}>
                       <Typography sx={{ color: res.temp >= 75 ? '#ef4444' : res.temp >= 70 ? '#fb923c' : res.temp >= 65 ? '#22c55e' : res.temp >= 60 ? '#fb923c' : '#0ea5e9', fontSize: '1.5vh', fontWeight: 800, mb: 0.3, letterSpacing: '0.03em' }}>TEMP</Typography>
                       <Typography sx={{ color: 'white', fontSize: '2.2vh', fontWeight: 800 }}>{res.temp || '--'}°F</Typography>
                     </Box>
                 </Grid>
              </Grid>

              {/* Environmental Sensors - Level-Based Colors */}
              <Grid container spacing={2} sx={{ flex: '0 0 50%', pb: '0.5vh' }}>
                {[
                  { icon: <Opacity />, label: 'Humidity', value: res.humidity?.value || '--', unit: '%', data: res.humidity },
                  { icon: <Co2 />, label: 'CO₂', value: res.co2?.value || '--', unit: 'ppm', data: res.co2 },
                  { icon: <Air />, label: 'VOC', value: res.voc?.value || '--', unit: 'ppb', data: res.voc },
                  { icon: <Grain />, label: 'PM2.5', value: res.pm25?.value || '--', unit: 'μg/m³', data: res.pm25 },
                  { icon: <Grain />, label: 'PM10', value: res.pm10?.value || '--', unit: 'μg/m³', data: res.pm10 }
                ].map((sensor, index) => {
                  const getValue = (val) => parseFloat(val) || 0;
                  const sensorValue = getValue(sensor.value);
                  const data = sensor.data;
                  let conditionColor = '#22c55e';
                  let isGoodCondition = true;
                  if (data) {
                    if (sensorValue >= getValue(data.level_4)) { conditionColor = '#dc2626'; isGoodCondition = false; }
                    else if (sensorValue >= getValue(data.level_3)) { conditionColor = '#ea580c'; isGoodCondition = false; }
                    else if (sensorValue >= getValue(data.level_2)) { conditionColor = '#f59e0b'; isGoodCondition = false; }
                    else if (sensorValue >= getValue(data.level_1)) { conditionColor = '#eab308'; isGoodCondition = false; }
                  }
                  return (
                    <Grid item xs={12/5} key={index}>
                      <Box sx={{
                          background: `linear-gradient(145deg, ${conditionColor}15 0%, ${conditionColor}08 100%)`,
                          borderRadius: 5,
                        p: '0.2vh 0.3vw',
                          textAlign: 'center',
                          border: `2px solid ${conditionColor}${isGoodCondition ? '40' : '80'}`,
                          backdropFilter: 'blur(15px)',
                          position: 'relative',
                        boxShadow: `0 0 ${isGoodCondition ? '12px' : '20px'} ${conditionColor}${isGoodCondition ? '30' : '45'}`,
                          animation: !isGoodCondition ? 'sparkle 2s infinite' : 'none',
                          transition: 'all 0.3s ease',
                        height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        justifyContent: 'center',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 'inherit',
                          background: !isGoodCondition ? `linear-gradient(45deg, transparent 30%, ${conditionColor}12 50%, transparent 70%)` : 'none',
                          animation: !isGoodCondition ? 'shimmer 3s infinite' : 'none',
                          pointerEvents: 'none'
                        }
                      }}>
                         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  color: conditionColor, fontSize: '2.8vh' }}>
                             {sensor.icon}
                         </Box>
                         <Typography sx={{ color: conditionColor, fontSize: '1.5vh', fontWeight: 900, mb: 0.2, letterSpacing: '0.06em', opacity: 0.95 }}>
                             {sensor.label}
                         </Typography>
                         <Typography sx={{ color: 'white', fontSize: '2.2vh', fontWeight: 900, textShadow: '0 2px 6px rgba(0,0,0,0.55)' }}>
                             {sensor.value}
                         </Typography>
                         <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.3vh', fontWeight: 700, mt: 0.2 }}>
                             {sensor.unit}
                         </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            {/* Stunning Grade Display - 26% of screen height */}
            <Box sx={{
              height: '26vh',
              background: `linear-gradient(135deg, ${aqiCondition.color}18 0%, ${aqiCondition.color}10 50%, ${aqiCondition.color}05 100%)`,
              borderRadius: '1.5vh',
              p: '2vh 2vw',
              textAlign: 'center',
              border: `2px solid ${aqiCondition.color}35`,
              boxShadow: `0 20px 60px ${aqiCondition.color}20, 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
              backdropFilter: 'blur(25px)',
              position: 'relative',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}>
                  <Typography sx={{
                    fontSize: '20vh',
                    fontWeight: 900,
                    background: aqiCondition.condition === 'good' ? 'linear-gradient(145deg, #00ff00 0%, #32ff32 15%, #65ff65 30%, #98ff98 45%, #cbffcb 60%, #ffffff 75%, #cbffcb 90%, #00ff00 100%)' : aqiCondition.condition === 'moderate' ? 'linear-gradient(145deg, #00ffff 0%, #32ffff 15%, #65ffff 30%, #98ffff 45%, #cbffff 60%, #ffffff 75%, #cbffff 90%, #00ffff 100%)' : aqiCondition.condition === 'poor' ? 'linear-gradient(145deg, #ffff00 0%, #ffff32 15%, #ffff65 30%, #ffff98 45%, #ffffcb 60%, #ffffff 75%, #ffffcb 90%, #ffff00 100%)' : aqiCondition.condition === 'unhealthy' ? 'linear-gradient(145deg, #ff6600 0%, #ff7732 15%, #ff8865 30%, #ff9998 45%, #ffaacb 60%, #ffffff 75%, #ffaacb 90%, #ff6600 100%)' : 'linear-gradient(145deg, #ff0066 0%, #ff3288 15%, #ff65aa 30%, #ff98cc 45%, #ffcbee 60%, #ffffff 75%, #ffcbee 90%, #ff0066 100%)',
                    backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 0.8, textAlign: 'center',
                    filter: `drop-shadow(0 0 35px ${aqiCondition.color}60) drop-shadow(0 10px 20px rgba(0,0,0,0.45)) drop-shadow(0 6px 12px rgba(0,0,0,0.65))`,
                    marginBottom: '0.6rem',
                    animation: res.letter === 'F' ? 'dramaticPulse 2.5s infinite' : 
                      res.letter === 'D' ? 'warningPulse 3s infinite' : 
                      res.letter === 'C' ? 'warningPulse 4s infinite' : 'none',
                    textShadow: res.letter === 'A' ? `
                        0 2px 0 rgba(0,255,0,0.9),
                        0 4px 0 rgba(50,255,50,0.7),
                        0 6px 0 rgba(101,255,101,0.5),
                        0 8px 0 rgba(152,255,152,0.3),
                        0 12px 0 rgba(0,0,0,0.1),
                        0 16px 30px rgba(0,0,0,0.4),
                        0 0 40px rgba(0,255,0,0.9),
                        0 0 80px rgba(50,255,50,0.7),
                        0 0 120px rgba(101,255,101,0.5),
                        0 0 160px rgba(255,255,255,0.3)
                      ` : res.letter === 'B' ? `
                        0 2px 0 rgba(0,255,255,0.9),
                        0 4px 0 rgba(50,255,255,0.7),
                        0 6px 0 rgba(101,255,255,0.5),
                        0 8px 0 rgba(152,255,255,0.3),
                        0 12px 0 rgba(0,0,0,0.1),
                        0 16px 30px rgba(0,0,0,0.4),
                        0 0 40px rgba(0,255,255,0.9),
                        0 0 80px rgba(50,255,255,0.7),
                        0 0 120px rgba(101,255,255,0.5),
                        0 0 160px rgba(255,255,255,0.3)
                      ` : res.letter === 'C' ? `
                        0 2px 0 rgba(255,255,0,0.9),
                        0 4px 0 rgba(255,255,50,0.7),
                        0 6px 0 rgba(255,255,101,0.5),
                        0 8px 0 rgba(255,255,152,0.3),
                        0 12px 0 rgba(0,0,0,0.1),
                        0 16px 30px rgba(0,0,0,0.4),
                        0 0 40px rgba(255,255,0,0.9),
                        0 0 80px rgba(255,255,50,0.7),
                        0 0 120px rgba(255,255,101,0.5),
                        0 0 160px rgba(255,255,255,0.3)
                      ` : res.letter === 'D' ? `
                        0 2px 0 rgba(255,102,0,0.9),
                        0 4px 0 rgba(255,119,50,0.7),
                        0 6px 0 rgba(255,136,101,0.5),
                        0 8px 0 rgba(255,153,152,0.3),
                        0 12px 0 rgba(0,0,0,0.1),
                        0 16px 30px rgba(0,0,0,0.4),
                        0 0 40px rgba(255,102,0,0.9),
                        0 0 80px rgba(255,119,50,0.7),
                        0 0 120px rgba(255,136,101,0.5),
                        0 0 160px rgba(255,255,255,0.3)
                      ` : `
                        0 2px 0 rgba(255,0,102,0.9),
                        0 4px 0 rgba(255,50,136,0.7),
                        0 6px 0 rgba(255,101,170,0.5),
                        0 8px 0 rgba(255,152,204,0.3),
                        0 12px 0 rgba(0,0,0,0.1),
                        0 16px 30px rgba(0,0,0,0.4),
                        0 0 40px rgba(255,0,102,0.9),
                        0 0 80px rgba(255,50,136,0.7),
                        0 0 120px rgba(255,101,170,0.5),
                        0 0 160px rgba(255,255,255,0.3)
                      `,
                      transform: 'perspective(500px) rotateX(15deg) rotateY(-5deg)',
                      transformStyle: 'preserve-3d',
                      '@keyframes dramaticPulse': {
                        '0%, 100%': { 
                          opacity: 1,
                          transform: 'scale(1)',
                          filter: `drop-shadow(0 0 30px ${aqiCondition.color}50) drop-shadow(0 8px 16px rgba(0,0,0,0.3))`
                        },
                        '50%': { 
                          opacity: 0.8,
                          transform: 'scale(1.05)',
                          filter: `drop-shadow(0 0 50px ${aqiCondition.color}70) drop-shadow(0 12px 24px rgba(0,0,0,0.4))`
                        }
                      },
                      '@keyframes warningPulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.85 }
                      }
                  }}>
                    {res.letter || 'F'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                    <Typography sx={{ color: res.letter === 'A' ? '#22c55e' : res.letter === 'B' ? '#3b82f6' : res.letter === 'C' ? '#f59e0b' : res.letter === 'D' ? '#ef4444' : res.letter === 'F' ? '#dc2626' : '#64748b', fontSize: '2.5vh', fontWeight: 900, letterSpacing: '0.06em', textShadow: `0 4px 8px rgba(0,0,0,0.4), 0 0 20px ${aqiCondition.color}30`, lineHeight: 1.35, background: `linear-gradient(135deg, ${aqiCondition.color} 0%, ${aqiCondition.color}CC 100%)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: `drop-shadow(0 0 12px ${aqiCondition.color}40)`, animation: res.letter === 'F' ? 'criticalTextPulse 2s infinite' : res.letter === 'D' ? 'warningTextPulse 3s infinite' : 'none' }}>
                      {res.letter === 'A' ? 'HEALTHY AIR QUALITY' : res.letter === 'B' ? 'SAFE AIR QUALITY' : res.letter === 'C' ? ' FAIR AIR QUALITY' : res.letter === 'D' ? ' POOR AIR QUALITY' : res.letter === 'F' ? 'CRITICAL AIR QUALITY' : '📊 MONITORING AIR QUALITY'}
                    </Typography>
                    {res.date && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Box sx={{ width: '0.8vh', height: '0.8vh', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #8b5cf6)', boxShadow: '0 0 8px rgba(168,85,247,0.6)' }} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.5vh', fontWeight: 600, letterSpacing: '0.02em' }}>
                          Next Inspection: {new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                        </Typography>
                      </Box>
                    )}
                  </Box>
            </Box>

            {/* Location Header - TV Screen Ready - 12% of screen height */}
            <Box sx={{ height: '12vh', textAlign: 'center', p: '1vh 2vw', background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)', borderRadius: '1vh', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(15px)', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, fontSize: '3vh', mb: 0.3, letterSpacing: '0.05em', textShadow: '0 2px 8px rgba(0,0,0,0.3)', background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {res.customer || 'SecureMyAir Location'}
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '2vh', letterSpacing: '0.03em' }}>
                {res.machine || 'Main Area'} • Live Air Quality Monitor
                  </Typography>
                  </Box>

            {/* Enhanced Animations */}
            <style>{`@keyframes inspectionPulse { 0%, 100% { opacity: 0.8, transform: scale(1); } 50% { opacity: 1, transform: scale(1.1); } @keyframes livePulse { 0%, 100% { opacity: 0.9, transform: scale(1); } 50% { opacity: 1, transform: scale(1.15); } } @keyframes dramaticPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } } @keyframes warningPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } } @keyframes sparkle { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } } @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
          </Box>
        </Card>
      </AlternatingDisplay>

      {/* Overlay Controls (top-right) */}
      <Box sx={{ position: 'fixed', top: '1.5vh', right: '1.5vw', display: 'flex', gap: '1vw', zIndex: 1200, opacity: showControls ? 1 : 0, pointerEvents: showControls ? 'auto' : 'none', transition: 'opacity 200ms ease' }}>
        <Button size="small" variant="contained" onClick={() => navigate('/control')} sx={{ bgcolor: 'rgba(59,130,246,0.9)', '&:hover': { bgcolor: 'rgba(37,99,235,0.95)' }, fontSize: '1.6vh', padding: '0.8vh 1.5vw', borderRadius: '0.6vh' }}>
                  Time Control
         </Button>
        <Button size="small" variant="outlined" onClick={backtoMachine} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)', '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' }, fontSize: '1.6vh', padding: '0.8vh 1.5vw', borderRadius: '0.6vh' }}>
                  Machine List
         </Button>
        <Button size="small" variant="outlined" onClick={handleLogout} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)', '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' }, fontSize: '1.6vh', padding: '0.8vh 1.5vw', borderRadius: '0.6vh' }} startIcon={<Logout sx={{ color: 'white', fontSize: '1.8vh' }} />}>
          Logout
         </Button>
       </Box>

    </Box>
    </>
  )
}

export default Dashboard
