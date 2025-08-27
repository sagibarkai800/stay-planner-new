import React, { useState } from 'react';
import {
  Card,
  Title,
  Subtitle,
  Text,
  Button,
  Grid2,
  FlexCenter,
  FlexBetween,
  IconContainer,
  Icon,
  Spacer,
  SuccessMessage,
  InfoMessage,
  Input,
  Label,
  FormGroup,
  Form
} from '../styles/common';
import styled from '@emotion/styled';

// Trips-specific styled components
const TripsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #E8F4FD 0%, #F0E6FF 50%, #E6F7F0 100%);
  padding: 2rem;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

const AddTripSection = styled(Card)`
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
`;

const AddTripForm = styled(Form)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  align-items: end;
`;

const AddButton = styled(Button)`
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  box-shadow: 
    0 10px 15px -3px rgba(16, 185, 129, 0.3),
    0 4px 6px -2px rgba(16, 185, 129, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-2px);
    box-shadow: 
      0 20px 25px -5px rgba(16, 185, 129, 0.4),
      0 10px 10px -5px rgba(16, 185, 129, 0.3);
  }
`;

const TripsGrid = styled(Grid2)`
  margin-bottom: 2rem;
`;

const TripCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.15),
      0 20px 20px -10px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981);
  }
`;

const TripHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TripCountry = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
`;

const TripDates = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DateItem = styled.div`
  text-align: center;
`;

const DateLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const DateValue = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

const TripActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ActionButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  flex: 1;
`;

const EditButton = styled(ActionButton)`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }
`;

const DeleteButton = styled(ActionButton)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  
  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const Trips = () => {
  const [trips, setTrips] = useState([
    {
      id: 1,
      country: 'France',
      startDate: '2024-01-15',
      endDate: '2024-01-30',
      days: 15
    },
    {
      id: 2,
      country: 'Germany',
      startDate: '2024-02-10',
      endDate: '2024-02-25',
      days: 15
    }
  ]);

  const [newTrip, setNewTrip] = useState({
    country: '',
    startDate: '',
    endDate: ''
  });

  const handleAddTrip = (e) => {
    e.preventDefault();
    if (newTrip.country && newTrip.startDate && newTrip.endDate) {
      const trip = {
        id: Date.now(),
        ...newTrip,
        days: Math.ceil((new Date(newTrip.endDate) - new Date(newTrip.startDate)) / (1000 * 60 * 60 * 24))
      };
      setTrips([...trips, trip]);
      setNewTrip({ country: '', startDate: '', endDate: '' });
    }
  };

  const handleDeleteTrip = (id) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  return (
    <TripsContainer>
      <HeaderSection>
        <PageTitle>My Trips ✈️</PageTitle>
        <PageSubtitle>
          Manage your travel plans and track your Schengen status
        </PageSubtitle>
      </HeaderSection>

      <AddTripSection>
        <Title style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          Add New Trip
        </Title>
        <AddTripForm onSubmit={handleAddTrip}>
          <FormGroup>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              type="text"
              placeholder="e.g., France, Germany"
              value={newTrip.country}
              onChange={(e) => setNewTrip({ ...newTrip, country: e.target.value })}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={newTrip.startDate}
              onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={newTrip.endDate}
              onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
              required
            />
          </FormGroup>
          
          <AddButton type="submit">
            ✈️ Add Trip
          </AddButton>
        </AddTripForm>
      </AddTripSection>

      {trips.length > 0 ? (
        <TripsGrid>
          {trips.map((trip) => (
            <TripCard key={trip.id}>
              <TripHeader>
                <TripCountry>🇫🇷 {trip.country}</TripCountry>
                <Text style={{ color: '#10b981', fontWeight: '600' }}>
                  {trip.days} days
                </Text>
              </TripHeader>
              
              <TripDates>
                <DateItem>
                  <DateLabel>Start</DateLabel>
                  <DateValue>{new Date(trip.startDate).toLocaleDateString()}</DateValue>
                </DateItem>
                <DateItem>
                  <DateLabel>End</DateLabel>
                  <DateValue>{new Date(trip.endDate).toLocaleDateString()}</DateValue>
                </DateItem>
              </TripDates>
              
              <TripActions>
                <EditButton>✏️ Edit</EditButton>
                <DeleteButton onClick={() => handleDeleteTrip(trip.id)}>
                  🗑️ Delete
                </DeleteButton>
              </TripActions>
            </TripCard>
          ))}
        </TripsGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>✈️</EmptyIcon>
          <Title style={{ marginBottom: '1rem' }}>No Trips Yet</Title>
          <Text style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Start planning your adventures by adding your first trip!
          </Text>
          <AddButton onClick={() => document.getElementById('country').focus()}>
            ✈️ Plan Your First Trip
          </AddButton>
        </EmptyState>
      )}
    </TripsContainer>
  );
};

export default Trips;
