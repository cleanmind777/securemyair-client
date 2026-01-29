/** @format */

import { Button, ListItem, ListItemText } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import React from 'react';
const circleStyle = {
  width: '2.7vh',
  height: '2.7vh',
  ml: '12px',
};

const shortButton = {
  width: '5vh',
  padding: ' .5vh 3vh',
  fontSize: '1.5vh',
};
const Relay = ({ id, lable, btn, ind, onBtnClick }) => {
  return (
    <ListItem sx={{ padding: '0rem 1rem', flex: 1 }} divider>
      <ListItemText sx={{ m: 0, fontSize: '2vh !important' }} primary={lable} />
      <Button onClick={() => onBtnClick(id)} variant='contained' size='large' sx={shortButton}>
        {btn === '1' ? 'STOP' : 'START'}
      </Button>
      <CircleIcon sx={circleStyle} htmlColor={ind === '1' ? '#00c853' : 'gray'} />
    </ListItem>
  );
};

export default Relay;
