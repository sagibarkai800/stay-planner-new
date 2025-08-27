import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Title,
  Subtitle,
  Text,
  Button,
  Grid2,
  Grid3,
  FlexCenter,
  FlexBetween,
  IconContainer,
  Icon,
  Spacer,
  SuccessMessage,
  InfoMessage
} from '../styles/common';
import styled from '@emotion/styled';

// Dashboard-specific styled components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #E8F4FD 0%, #F0E6FF 50%, #E6F7F0 100%);
  padding: 2rem;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

const StatsGrid = styled(Grid3)`
  margin-bottom: 3rem;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.15),
      0 20px 20px -10px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
`;

const StatIcon = styled(IconContainer)`
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 1rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
`;

const QuickActionsGrid = styled(Grid2)`
  margin-bottom: 3rem;
`;

const ActionButton = styled(Button)`
  padding: 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 1.5rem;
  box-shadow: 
    0 20px 25px -5px rgba(59, 130, 246, 0.3),
    0 10px 10px -5px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 25px 50px -12px rgba(59, 130, 246, 0.4),
      0 20px 20px -10px rgba(59, 130, 246, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const RecentActivityCard = styled(Card)`
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
`;

const ActivityIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <HeaderSection>
        <WelcomeTitle>Welcome Back! 👋</WelcomeTitle>
        <WelcomeSubtitle>
          Here's what's happening with your travel plans today
        </WelcomeSubtitle>
      </HeaderSection>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Icon>🏳️</Icon>
          </StatIcon>
          <StatValue>0</StatValue>
          <StatLabel>days remaining</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <Icon>✈️</Icon>
          </StatIcon>
          <StatValue>0</StatValue>
          <StatLabel>trips planned</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <Icon>📄</Icon>
          </StatIcon>
          <StatValue>0</StatValue>
          <StatLabel>files uploaded</StatLabel>
        </StatCard>
      </StatsGrid>

      <div>
        <SectionTitle>Quick Actions</SectionTitle>
        <SectionSubtitle>Get started with your travel planning</SectionSubtitle>
        
        <QuickActionsGrid>
          <ActionButton as={Link} to="/trips">
            <ActionIcon>✈️</ActionIcon>
            Add Trip
          </ActionButton>
          
          <ActionButton as={Link} to="/documents">
            <ActionIcon>📤</ActionIcon>
            Upload Document
          </ActionButton>
          
          <ActionButton as={Link} to="/trips">
            <ActionIcon>🧮</ActionIcon>
            Calculate Status
          </ActionButton>
          
          <ActionButton as={Link} to="/trips">
            <ActionIcon>📊</ActionIcon>
            View Reports
          </ActionButton>
        </QuickActionsGrid>
      </div>

      <div>
        <SectionTitle>Recent Activity</SectionTitle>
        <SectionSubtitle>Your latest travel updates and notifications</SectionSubtitle>
        
        <RecentActivityCard>
          <ActivityIcon>📱</ActivityIcon>
          <Text style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
            No recent activity yet
          </Text>
          <Text style={{ color: '#6b7280' }}>
            Start planning your next trip to see updates here!
          </Text>
        </RecentActivityCard>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
