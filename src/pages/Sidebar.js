import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';


const Sidebar = () => {
  // eslint-disable-next-line
  const [showLogo, setShowLogo] = useState(true);
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="grey">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/images/logo.png"
              alt="logo"
              style={{ height: '40px', marginRight: '8px', marginTop: '3px' }}
            />
            <span style={{ color: 'inherit', fontSize: '120%', paddingTop: '5px' }}>
              {showLogo ? 'O.A.S' : ''}
            </span>
          </div>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/Appointment" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="home">Appointment</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/ViewAppointment" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">View Appointment</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;