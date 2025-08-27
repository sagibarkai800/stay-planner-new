import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/client';
import styled from '@emotion/styled';
import {
  Button,
  Text,
  FlexBetween
} from '../styles/common';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #E8F4FD 0%, #F0E6FF 50%, #E6F7F0 100%);
`;

const Navbar = styled.nav`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  padding: 1rem 2rem;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #1f2937;
  font-weight: bold;
  font-size: 1.5rem;
  
  &:hover {
    color: #3b82f6;
  }
`;

const LogoIcon = styled.span`
  font-size: 2rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
  
  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }
  
  &.active {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }
`;

const LogoutButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 
    0 10px 15px -3px rgba(239, 68, 68, 0.3),
    0 4px 6px -2px rgba(239, 68, 68, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
    box-shadow: 
      0 20px 25px -5px rgba(239, 68, 68, 0.4),
      0 10px 10px -5px rgba(239, 68, 68, 0.3);
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <LayoutContainer>
      <Navbar>
        <NavContent>
          <Logo to="/app">
            <LogoIcon>🏠</LogoIcon>
            Stay Planner
          </Logo>
          
          <NavLinks>
            <NavLink to="/app" className={isActive('/app') ? 'active' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/app/trips" className={isActive('/app/trips') ? 'active' : ''}>
              Trips
            </NavLink>
            <NavLink to="/app/documents" className={isActive('/app/documents') ? 'active' : ''}>
              Documents
            </NavLink>
            <NavLink to="/app/profile" className={isActive('/app/profile') ? 'active' : ''}>
              Profile
            </NavLink>
            <LogoutButton onClick={handleLogout}>
              Logout
            </LogoutButton>
          </NavLinks>
        </NavContent>
      </Navbar>

      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default AppLayout;
