import React from 'react';
import styled from '@emotion/styled';
import { Card, Button, Badge } from '../styles/common';
import { Edit, Trash2, Calendar, MapPin } from 'lucide-react';

const TableContainer = styled(Card)`
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
`;

const TableTitle = styled.h3`
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-xl);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: var(--color-primary);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: var(--color-surface-light);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
`;

const TripRow = styled.tr`
  transition: background var(--transition-normal);
  
  &:hover {
    background: var(--color-surface-hover);
  }
`;

const TripInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TripCountry = styled.div`
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--color-primary);
    width: 16px;
    height: 16px;
  }
`;

const TripDates = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--color-text-muted);
    width: 14px;
    height: 14px;
  }
`;

const TripDuration = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(Button)`
  padding: 0.5rem;
  min-width: auto;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--color-text-secondary);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  margin: 0 0 1rem;
  font-size: var(--font-size-lg);
`;

const EmptySubtext = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  opacity: 0.7;
`;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getCountryName = (countryCode) => {
  const countries = {
    'AUT': 'Austria', 'BEL': 'Belgium', 'CZE': 'Czech Republic',
    'DNK': 'Denmark', 'EST': 'Estonia', 'FIN': 'Finland',
    'FRA': 'France', 'DEU': 'Germany', 'GRC': 'Greece',
    'HUN': 'Hungary', 'ISL': 'Iceland', 'ITA': 'Italy',
    'LVA': 'Latvia', 'LIE': 'Liechtenstein', 'LTU': 'Lithuania',
    'LUX': 'Luxembourg', 'MLT': 'Malta', 'NLD': 'Netherlands',
    'NOR': 'Norway', 'POL': 'Poland', 'PRT': 'Portugal',
    'SVK': 'Slovakia', 'SVN': 'Slovenia', 'ESP': 'Spain',
    'SWE': 'Sweden', 'CHE': 'Switzerland'
  };
  return countries[countryCode] || countryCode;
};

const TripsTable = ({ trips, onEdit, onDelete, onAddNew }) => {
  if (!trips || trips.length === 0) {
    return (
      <TableContainer>
        <TableHeader>
          <TableTitle>
            <Calendar />
            Your Trips
          </TableTitle>
          {onAddNew && (
            <Button onClick={onAddNew}>
              Add First Trip
            </Button>
          )}
        </TableHeader>
        
        <EmptyState>
          <EmptyIcon>✈️</EmptyIcon>
          <EmptyText>No trips planned yet</EmptyText>
          <EmptySubtext>Start by adding your first trip to track your travel compliance</EmptySubtext>
        </EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>
          <Calendar />
          Your Trips ({trips.length})
        </TableTitle>
        {onAddNew && (
          <Button onClick={onAddNew}>
            Add Trip
          </Button>
        )}
      </TableHeader>
      
      <Table>
        <TableHead>
          <tr>
            <Th>Destination</Th>
            <Th>Dates</Th>
            <Th>Duration</Th>
            <Th>Actions</Th>
          </tr>
        </TableHead>
        <tbody>
          {trips.map((trip) => (
            <TripRow key={trip.id}>
              <Td>
                <TripInfo>
                  <TripCountry>
                    <MapPin />
                    {getCountryName(trip.country)}
                  </TripCountry>
                  <Badge className="badge-primary">
                    {trip.country}
                  </Badge>
                </TripInfo>
              </Td>
              <Td>
                <TripDates>
                  <Calendar />
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </TripDates>
              </Td>
              <Td>
                <TripDuration>
                  {calculateDuration(trip.start_date, trip.end_date)} days
                </TripDuration>
              </Td>
              <Td>
                <ActionButtons>
                  <ActionButton variant="secondary" onClick={() => onEdit(trip)}>
                    <Edit />
                  </ActionButton>
                  <ActionButton variant="error" onClick={() => onDelete(trip.id)}>
                    <Trash2 />
                  </ActionButton>
                </ActionButtons>
              </Td>
            </TripRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default TripsTable;
