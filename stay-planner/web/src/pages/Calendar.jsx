import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import CalendarView from '../components/CalendarView';
import Breadcrumb from '../components/Breadcrumb';
import { Card, Title } from '../styles/common';
import { api } from '../utils/api';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled(Title)`
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: var(--color-text-secondary);
  margin: 0;
  font-size: var(--font-size-lg);
`;

const Calendar = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await api.trips.list();
        setTrips(data.trips || []);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <Breadcrumb currentPage="Travel Calendar" />
        <Card>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div>Loading calendar...</div>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb currentPage="Travel Calendar" />
      
      <PageHeader>
        <PageTitle>Travel Calendar</PageTitle>
        <PageDescription>
          Visualize your trips and plan future travel while staying compliant with Schengen rules
        </PageDescription>
      </PageHeader>
      
      <CalendarView trips={trips} />
    </PageContainer>
  );
};

export default Calendar;
