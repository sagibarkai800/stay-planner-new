import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { api } from '../utils/api';
import { 
  Home,
  Plane, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
`;

const Sidebar = styled.aside`
  width: 280px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 0 2rem 2rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
`;

const AppTitle = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0;
`;

const AppSubtitle = styled.p`
  color: var(--color-text-secondary);
  margin: 0.5rem 0 0;
  font-size: var(--font-size-sm);
`;

const NavMenu = styled.nav`
  flex: 1;
  padding: 0 1rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  font-weight: var(--font-weight-medium);
  
  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }
  
  &.active {
    background: var(--color-primary);
    color: white;
    
    svg {
      color: white;
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: 1rem;
    color: var(--color-text-secondary);
    transition: color var(--transition-normal);
  }
`;

const UserSection = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-weight: var(--font-weight-semibold);
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-surface-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-error);
    border-color: var(--color-error);
  }
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: 0.5rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const AppLayout = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await api.auth.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if logout fails
      navigate('/login');
    }
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <AppTitle>Stay Planner</AppTitle>
          <AppSubtitle>Manage your travel compliance</AppSubtitle>
        </SidebarHeader>
        
        <NavMenu>
          <NavList>
            <NavItem>
              <NavLinkStyled to="/app">
                <Home />
                Home
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled to="/app/trips">
                <Plane />
                Trips
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled to="/app/calendar">
                <Calendar />
                Calendar
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled to="/app/docs">
                <FileText />
                Documents
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled to="/app/settings">
                <Settings />
                Settings
              </NavLinkStyled>
            </NavItem>
          </NavList>
        </NavMenu>
        
        <UserSection>
          <UserInfo>
            <UserAvatar>
              <User size={20} />
            </UserAvatar>
            <UserDetails>
              <UserName>Traveler</UserName>
              <UserEmail>user@example.com</UserEmail>
            </UserDetails>
          </UserInfo>
          
          <LogoutButton onClick={handleLogout}>
            <LogOut />
            Logout
          </LogoutButton>
        </UserSection>
      </Sidebar>
      
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default AppLayout;
