import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { Home, ChevronRight } from 'lucide-react';

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const BreadcrumbItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  
  &:hover {
    color: var(--color-primary);
    background: var(--color-surface-light);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const CurrentPage = styled.span`
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
`;

const Separator = styled(ChevronRight)`
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
`;

const Breadcrumb = ({ currentPage }) => {
  const location = useLocation();
  
  // Don't show breadcrumb on the main dashboard
  if (location.pathname === '/app') {
    return null;
  }
  
  return (
    <BreadcrumbContainer>
      <BreadcrumbItem>
        <HomeLink to="/app">
          <Home />
          Home
        </HomeLink>
      </BreadcrumbItem>
      
      <Separator />
      
      <BreadcrumbItem>
        <CurrentPage>{currentPage}</CurrentPage>
      </BreadcrumbItem>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;
