import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { api } from '../utils/api';
import { 
  Home,
  Plane, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  User,
  Bell
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
  overflow-y: auto;
`;

const Header = styled.header`
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-xl);
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AlertBell = styled.div`
  position: relative;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--color-surface-hover);
  }
`;

const BellIcon = styled(Bell)`
  width: 24px;
  height: 24px;
  color: ${props => {
    switch (props.status) {
      case 'critical': return 'var(--color-error)';
      case 'warn': return 'var(--color-warning)';
      default: return 'var(--color-success)';
    }
  }};
`;

const AlertBadge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'critical': return 'var(--color-error)';
      case 'warn': return 'var(--color-warning)';
      default: return 'var(--color-success)';
    }
  }};
  border: 2px solid var(--color-surface);
`;

const AlertTooltip = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  box-shadow: var(--shadow-lg);
  z-index: var(--z-tooltip);
  min-width: 200px;
  margin-top: 0.5rem;
  
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid var(--color-surface);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -7px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid var(--color-border);
  }
`;

const AlertStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StatusText = styled.span`
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
`;

const StatusIcon = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'critical': return 'var(--color-error)';
      case 'warn': return 'var(--color-warning)';
      default: return 'var(--color-success)';
    }
  }};
`;

const RemainingDays = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const ContentArea = styled.div`
  padding: 2rem;
`;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [statusData, setStatusData] = useState({ 
    level: 'ok', 
    remaining: 0,
    forecasting: {
      nextMonth: { available: 0, used: 0 },
      next3Months: { available: 0, used: 0 },
      next6Months: { available: 0, used: 0 }
    }
  });
  const [showAlertTooltip, setShowAlertTooltip] = useState(false);
  
  useEffect(() => {
    fetchStatus();
    // Refresh status every 5 minutes
    const interval = setInterval(fetchStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/status/today`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatusData(data);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const getStatusText = (level) => {
    switch (level) {
      case 'critical': return 'Limit reached';
      case 'warn': return 'Approaching limit';
      default: return 'All good';
    }
  };

  const getStatusColor = (level) => {
    switch (level) {
      case 'critical': return 'var(--color-error)';
      case 'warn': return 'var(--color-warning)';
      default: return 'var(--color-success)';
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/app') return 'Dashboard';
    if (path === '/app/trips') return 'Manage Trips';
    if (path === '/app/calendar') return 'Travel Calendar';
    if (path === '/app/docs') return 'Documents';
    if (path === '/app/settings') return 'Profile & Settings';
    return 'Dashboard';
  };
  
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
        <Header>
          <HeaderLeft>
            <HeaderTitle>{getPageTitle()}</HeaderTitle>
          </HeaderLeft>
          
          <HeaderRight>
            <AlertBell 
              onClick={() => setShowAlertTooltip(!showAlertTooltip)}
              onMouseEnter={() => setShowAlertTooltip(true)}
              onMouseLeave={() => setShowAlertTooltip(false)}
            >
              <BellIcon status={statusData.level} />
              <AlertBadge status={statusData.level} />
              
              {showAlertTooltip && (
                <AlertTooltip>
                  <AlertStatus>
                    <StatusIcon status={statusData.level} />
                    <StatusText>{getStatusText(statusData.level)}</StatusText>
                  </AlertStatus>
                  <RemainingDays>
                    {statusData.remaining} Schengen days remaining
                  </RemainingDays>
                  
                  {statusData.forecasting && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                        Future Availability:
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        <div>Next month: {statusData.forecasting.nextMonth?.available || 0} days</div>
                        <div>Next 3 months: {statusData.forecasting.next3Months?.available || 0} days</div>
                        <div>Next 6 months: {statusData.forecasting.next6Months?.available || 0} days</div>
                      </div>
                    </div>
                  )}
                </AlertTooltip>
              )}
            </AlertBell>
          </HeaderRight>
        </Header>
        
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default AppLayout;
