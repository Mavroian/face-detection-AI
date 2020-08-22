import React, { useState } from 'react';
import { signOutApiCall } from '../../lib/api/api'

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const ProfileIcon = ({ onRouteChange, toggleModal }) => {
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const onsignOut = () => {
    signOutApiCall(onRouteChange)
  }
  return (
    <div className="pa4 tc" >
      <Dropdown direction="left" isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle 
          tag="span"
          data-toggle="dropdown"
          aria-expanded={dropdownOpen}>
            <img
              src="http://tachyons.io/img/logo.jpg"
              className="br-100 ba h3 w3 dib" alt="avatar"/>
        </DropdownToggle>
        <DropdownMenu
          className='b--transparent shadow-5'
          style={{ 
              backgroundColor:'rgba(255,255,255, .5)',
              position:'absolute',
              left:'-190px'
          }}>
          <DropdownItem onClick={toggleModal}>View Profile</DropdownItem>
          <DropdownItem onClick={onsignOut}>Sign Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      
    </div>
  )
}
export default ProfileIcon