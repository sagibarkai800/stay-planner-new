import React from 'react';
import styled from '@emotion/styled';
import { Search, Home } from 'lucide-react';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0 0 1rem 0;
`;

const PageSubtitle = styled.p`
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
`;

const ContentCard = styled.div`
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 3rem;
  text-align: center;
  box-shadow: var(--shadow-soft);
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  box-shadow: var(--shadow-medium);
`;

const FeatureTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 1rem 0;
`;

const FeatureDescription = styled.p`
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
`;

const FindStays = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Find Stays</PageTitle>
        <PageSubtitle>
          Discover comfortable accommodations for your Schengen adventures
        </PageSubtitle>
      </PageHeader>

      <ContentCard>
        <IconContainer>
          <Home size={40} color="white" />
        </IconContainer>
        
        <FeatureTitle>Accommodation Search Coming Soon</FeatureTitle>
        <FeatureDescription>
          We're building a comprehensive accommodation search platform. 
          Soon you'll be able to find hotels, apartments, and unique stays 
          that fit your travel style and budget, all while maintaining 
          your Schengen compliance tracking.
        </FeatureDescription>
      </ContentCard>
    </PageContainer>
  );
};

export default FindStays;
