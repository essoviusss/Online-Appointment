import React, { useState } from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  // eslint-disable-next-line
  const [showLogo, setShowLogo] = useState(true);
  const [isToggled, setIsToggled] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        transition: 'margin-right 0.5s ease',
        marginRight: isToggled ? '80px' : '270px',
        backgroundColor: '#F4F7FE',
        overflow: 'hidden'
      }}
    >
      <CDBSidebar
        textColor="#025BAD"
        backgroundColor="white"
        style={{
          boxShadow: '2px 0px 5px 0px rgba(50, 50, 50, 0.2)',
          position: 'fixed'
        }}
      >
        <CDBSidebarHeader
          prefix={
            <i
              className="fa fa-bars fa-large custom-icon"
              onClick={handleToggle}
              style={{ height: '50px' }}
            />
          }
        >
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
              <CDBSidebarMenuItem icon="home" style={location.pathname === '/Appointment' ? { backgroundColor: '#EBF1FF', borderRadius: '15px', padding: '5px' } : { borderRadius: '10px', padding: '5px' }} className={location.pathname === '/Appointment' ? 'text-primary' : 'text-gray'}  iconClassName={`fa-columns ${location.pathname === '/Appointment' ? 'active-icon' : ''}`}>Appointment</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/ViewAppointment" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table" style={location.pathname === '/ViewAppointment' ? { backgroundColor: '#EBF1FF', borderRadius: '15px', padding: '5px' } : { borderRadius: '10px', padding: '5px' }} className={location.pathname === '/ViewAppointment' ? 'text-primary' : 'text-gray'} iconClassName={`fa-columns ${location.pathname === '/ViewAppointment' ? 'active-icon' : ''}`}>View Appointment</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          {/* <div
            style={{
              padding: '20px 5px',
            }}
          >
            Sidebar Footer
          </div> */}
        </CDBSidebarFooter>
      </CDBSidebar>

      <style>
        {`
          .sidebar-content .fa-columns,
          .sidebar-content .fa-table,
          .sidebar-content .fa-user {
            color: gray;
          }

          .sidebar-content .activeClicked {
            color: #025BAD !important;
            background-color: red !important;
            border-radius: 10px !important;
          }

          .sidebar-content .activeClicked:hover {
            color: #025BAD !important;
            background-color: blue !important;
            border-radius: 10px !important;
          }

          .sidebar-content .active-icon {
            color: #025BAD !important;
          }

          .text-primary {
            color: #025BAD !important;
            font-weight: bold;
          }

          .text-gray {
            color: gray !important;
          }

          .custom-icon {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .sidebar-content .sidebar-menu a:hover {
            color: #025BAD !important;
            background-color: blue !important;
            border-radius: 10px !important;
          }
        `}
      </style>
    </div>
  );
};

export default Sidebar;
