import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router";
import Button from '@mui/material/Button';

const Sidebar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out!");
    navigate("/", { replace: true });
  };
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="black">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            DepEd
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/Appointment" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns">Appointment</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/ViewAppointment" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">View Appointment</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
          
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
           <Button onClick={logout}>Logout</Button>
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;