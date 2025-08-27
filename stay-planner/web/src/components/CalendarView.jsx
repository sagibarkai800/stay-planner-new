import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { DayPicker } from 'react-day-picker';
import { Card, Badge, Button } from '../styles/common';
import { api } from '../utils/api';
import { Calendar, AlertTriangle, Info } from 'lucide-react';
import 'react-day-picker/dist/style.css';

const CalendarContainer = styled(Card)`
  max-width: 800px;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
`;

const CalendarTitle = styled.h3`
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

const SchengenStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatusChip = styled(Badge)`
  font-size: var(--font-size-sm);
  padding: 0.5rem 1rem;
  
  &.status-warning {
    background: var(--color-warning);
    color: white;
  }
  
  &.status-danger {
    background: var(--color-error);
    color: white;
  }
  
  &.status-success {
    background: var(--color-success);
    color: white;
  }
`;

const CalendarContent = styled.div`
  padding: 1.5rem;
`;

const StyledDayPicker = styled(DayPicker)`
  --rdp-cell-size: 40px;
  --rdp-accent-color: var(--color-primary);
  --rdp-background-color: var(--color-surface-light);
  --rdp-accent-color-dark: var(--color-primary-hover);
  --rdp-background-color-dark: var(--color-surface);
  --rdp-outline: 2px solid var(--color-primary);
  --rdp-outline-selected: 2px solid var(--color-primary);
  
  .rdp-day_selected {
    background: var(--color-primary);
    color: white;
  }
  
  .rdp-day_selected:hover {
    background: var(--color-primary-hover);
  }
  
  .rdp-day_today {
    font-weight: var(--font-weight-bold);
    color: var(--color-accent);
  }
  
  .rdp-day_outside {
    color: var(--color-text-muted);
  }
  
  .rdp-nav_button {
    background: var(--color-surface-light);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    
    &:hover {
      background: var(--color-surface-hover);
    }
  }
  
  .rdp-head_cell {
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-medium);
  }
`;

const TripLegend = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: var(--color-surface-light);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
`;

const LegendTitle = styled.h4`
  margin: 0 0 1rem;
  color: var(--color-text);
  font-size: var(--font-size-lg);
`;

const LegendItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const WhatIfSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--color-surface-light);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
`;

const WhatIfTitle = styled.h4`
  margin: 0 0 1rem;
  color: var(--color-text);
  font-size: var(--font-size-lg);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--color-accent);
  }
`;

const WhatIfForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const WhatIfInput = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const WhatIfResult = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
`;

const ResultText = styled.div`
  color: var(--color-text);
  font-size: var(--font-size-sm);
  margin-bottom: 0.5rem;
`;

const ResultDays = styled.div`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
`;

const getStatusClass = (remainingDays) => {
  if (remainingDays <= 0) return 'status-danger';
  if (remainingDays <= 7) return 'status-warning';
  if (remainingDays <= 15) return 'status-warning';
  return 'status-success';
};

const getStatusText = (remainingDays) => {
  if (remainingDays <= 0) return 'No days remaining';
  if (remainingDays <= 7) return `${remainingDays} days remaining`;
  if (remainingDays <= 15) return `${remainingDays} days remaining`;
  return `${remainingDays} days remaining`;
};

const CalendarView = ({ trips = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schengenStatus, setSchengenStatus] = useState(null);
  const [whatIfDates, setWhatIfDates] = useState({
    start: '',
    end: ''
  });
  const [whatIfResult, setWhatIfResult] = useState(null);

  // Fetch Schengen status for today
  useEffect(() => {
    const fetchSchengenStatus = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/calcs/schengen?date=${today}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setSchengenStatus(data);
        }
      } catch (error) {
        console.error('Failed to fetch Schengen status:', error);
      }
    };

    fetchSchengenStatus();
  }, []);

  // Calculate what-if scenario
  const calculateWhatIf = async () => {
    if (!whatIfDates.start || !whatIfDates.end) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/calcs/schengen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          start_date: whatIfDates.start,
          end_date: whatIfDates.end,
          country: 'DEU' // Default to Germany for demo
        })
      });

      if (response.ok) {
        const data = await response.json();
        setWhatIfResult(data);
      }
    } catch (error) {
      console.error('Failed to calculate what-if:', error);
    }
  };

  // Get trip dates for calendar highlighting
  const tripDates = trips.map(trip => ({
    from: new Date(trip.start_date),
    to: new Date(trip.end_date),
    country: trip.country
  }));

  // Custom day renderer to show trip indicators
  const dayContent = (day) => {
    const trip = tripDates.find(trip => 
      day >= trip.from && day <= trip.to
    );
    
    if (trip) {
      return (
        <div style={{ position: 'relative' }}>
          {day.getDate()}
          <div style={{
            position: 'absolute',
            bottom: '2px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '4px',
            background: 'var(--color-primary)',
            borderRadius: '50%'
          }} />
        </div>
      );
    }
    
    return day.getDate();
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          <Calendar />
          Travel Calendar
        </CalendarTitle>
        
        <SchengenStatus>
          <Info size={16} />
          <span>Remaining Schengen days:</span>
          {schengenStatus ? (
            <StatusChip className={getStatusClass(schengenStatus.remaining)}>
              {getStatusText(schengenStatus.remaining)}
            </StatusChip>
          ) : (
            <StatusChip>Loading...</StatusChip>
          )}
        </SchengenStatus>
      </CalendarHeader>

      <CalendarContent>
        <StyledDayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{
            trip: tripDates
          }}
          modifiersStyles={{
            trip: {
              fontWeight: 'bold',
              color: 'var(--color-primary)'
            }
          }}
          components={{
            DayContent: dayContent
          }}
        />

        <TripLegend>
          <LegendTitle>Trip Legend</LegendTitle>
          <LegendItems>
            <LegendItem>
              <LegendDot color="var(--color-primary)" />
              <span>Planned trip</span>
            </LegendItem>
            <LegendItem>
              <LegendDot color="var(--color-accent)" />
              <span>Today</span>
            </LegendItem>
          </LegendItems>
        </TripLegend>

        <WhatIfSection>
          <WhatIfTitle>
            <AlertTriangle />
            What-If Planner
          </WhatIfTitle>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            See how a potential trip would affect your remaining Schengen days
          </p>
          
          <WhatIfForm>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                Start Date
              </label>
              <WhatIfInput
                type="date"
                value={whatIfDates.start}
                onChange={(e) => setWhatIfDates(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                End Date
              </label>
              <WhatIfInput
                type="date"
                value={whatIfDates.end}
                onChange={(e) => setWhatIfDates(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            
            <Button onClick={calculateWhatIf} disabled={!whatIfDates.start || !whatIfDates.end}>
              Calculate
            </Button>
          </WhatIfForm>

          {whatIfResult && (
            <WhatIfResult>
              <ResultText>If you take this trip:</ResultText>
              <ResultDays>
                {whatIfResult.remaining} days remaining
              </ResultDays>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                Days used: {whatIfResult.used} | Window: {new Date(whatIfResult.windowStart).toLocaleDateString()} - {new Date(whatIfResult.windowEnd).toLocaleDateString()}
              </div>
            </WhatIfResult>
          )}
        </WhatIfSection>
      </CalendarContent>
    </CalendarContainer>
  );
};

export default CalendarView;
