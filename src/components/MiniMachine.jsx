/** @format */

import React from 'react';
import { Link } from 'react-router-dom';

const MiniMachine = ({ onClick, letter, name, api }) => {
  return (
    <div className='machineBox'>
      <Link onClick={() => onClick(api)} className='link' to='/dashboard' state={{ data: api }}>
        <div className={`machine color${letter}`}>{letter}</div>
        <h3 className='machineName'>{name}</h3>
      </Link>
    </div>
  );
};

export default MiniMachine;
