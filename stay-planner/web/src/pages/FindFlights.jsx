import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Calendar, Users, MapPin, Search, Plane, ExternalLink, Info } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Input as BaseInput, Select as BaseSelect, Button, Badge } from '../styles/common';
import { getCountryName } from '../utils/validation';
import { validateRequiredFields, validateNumericRange, isValidDateRange } from '../utils/shared';
import telemetry from '../services/telemetry';
import TelemetryDebug from '../components/TelemetryDebug';

// Custom component wrappers
const CustomInput = ({ icon, ...props }) => (
  <StyledBaseInput {...props}>
    {icon && <IconContainer>{icon}</IconContainer>}
    <BaseInput {...props} />
  </StyledBaseInput>
);

const CustomSelect = ({ options, icon, ...props }) => (
  <StyledBaseSelect {...props}>
    {icon && <IconContainer>{icon}</IconContainer>}
    <BaseSelect {...props}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </BaseSelect>
  </StyledBaseSelect>
);

// Styled components
const IconContainer = styled.div`
  position: absolute;
  left: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  z-index: 1;
`;

const StyledBaseInput = styled.div`
  position: relative;
  
  input {
    padding-left: ${props => props.icon ? 'var(--spacing-10)' : 'var(--spacing-3)'};
  }
`;

const StyledBaseSelect = styled.div`
  position: relative;
  
  select {
    padding-left: ${props => props.icon ? 'var(--spacing-10)' : 'var(--spacing-3)'};
  }
`;

const SearchForm = styled.form`
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-6);
`;

const FormTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-6);
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;

const FormLabel = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
`;

const DateInputContainer = styled.div`
  position: relative;
`;

const DatePickerContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-3);
`;

const SubmitButton = styled(Button)`
  width: 100%;
  font-size: var(--font-size-lg);
  padding: var(--spacing-4);
`;

const ResultsSection = styled.div`
  margin-top: var(--spacing-8);
`;

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-6);
`;

const ResultsTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-2);
`;

const ResultsSubtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
`;

const UpcomingTripCard = styled.div`
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  box-shadow: var(--shadow-md);
`;

const UpcomingTripContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
`;

const UpcomingTripTitle = styled.div`
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
`;

const UpcomingTripDates = styled.div`
  font-size: var(--font-size-sm);
  opacity: 0.9;
`;

const UseTripButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FindFlights = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    depart: '',
    return: '',
    adults: '2'
  });

  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDepartPicker, setShowDepartPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [upcomingTrip, setUpcomingTrip] = useState(null);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);

  // Adults options
  const adultsOptions = [
    { value: '1', label: '1 Adult' },
    { value: '2', label: '2 Adults' },
    { value: '3', label: '3 Adults' },
    { value: '4', label: '4 Adults' },
    { value: '5', label: '5 Adults' },
    { value: '6', label: '6 Adults' }
  ];

  // Fetch upcoming trips on component mount
  useEffect(() => {
    // Log page view
    telemetry.logPageView('find_flights', {});
    
    const fetchUpcomingTrip = async () => {
      try {
        setIsLoadingTrips(true);
        const response = await fetch('/api/trips', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.trips.length > 0) {
            // Find the next upcoming trip
            const now = new Date();
            const upcomingTrips = data.trips
              .filter(trip => new Date(trip.start_date) > now)
              .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            
            if (upcomingTrips.length > 0) {
              setUpcomingTrip(upcomingTrips[0]);
            }
          }
        }
      } catch (error) {
        console.log('No trips found or user not logged in');
      } finally {
        setIsLoadingTrips(false);
      }
    };
    
    fetchUpcomingTrip();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelect = (date, field) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        [field]: formattedDate
      }));

      // Close the appropriate picker
      if (field === 'depart') {
        setShowDepartPicker(false);
      } else if (field === 'return') {
        setShowReturnPicker(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Log telemetry
    telemetry.logFormSubmit('flight_search', {
      origin: formData.origin,
      destination: formData.destination,
      depart: formData.depart,
      return: formData.return,
      adults: formData.adults
    });

    try {
      console.log('🔍 Frontend: Submitting flight search:', formData);
      
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      console.log('🔍 Frontend: Response status:', response.status);
      
      if (!response.ok) {
        console.log('🔍 Frontend: Response not OK, trying to parse error');
        let errorData;
        try {
          errorData = await response.json();
          console.log('🔍 Frontend: Error data:', errorData);
        } catch (parseError) {
          console.log('🔍 Frontend: Could not parse error response:', parseError);
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || 'Failed to search flights');
      }

      console.log('🔍 Frontend: Response OK, trying to parse data');
      const data = await response.json();
      console.log('🔍 Frontend: Parsed data:', data);
      setSearchResults(data);
    } catch (error) {
      console.error('🔍 Frontend: Error in handleSubmit:', error);
      setError(error.message);
      
      // Log error telemetry
      telemetry.logError('flight_search_failed', {
        error: error.message,
        origin: formData.origin,
        destination: formData.destination
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useUpcomingTrip = () => {
    if (upcomingTrip) {
      setFormData({
        origin: 'LON', // Default origin - user can change
        destination: upcomingTrip.country,
        depart: upcomingTrip.start_date,
        return: upcomingTrip.end_date,
        adults: '2'
      });
      
      // Log telemetry
      telemetry.logButtonClick('use_upcoming_trip', {
        tripId: upcomingTrip.id,
        country: upcomingTrip.country,
        startDate: upcomingTrip.start_date,
        endDate: upcomingTrip.end_date
      });
    }
  };

  return (
    <div>
             {/* Upcoming Trip Action */}
       {upcomingTrip && (
         <UpcomingTripCard>
           <UpcomingTripContent>
             <Plane size={20} />
             <div>
               <UpcomingTripTitle>Next Trip: {getCountryName(upcomingTrip.country)}</UpcomingTripTitle>
               <UpcomingTripDates>{upcomingTrip.start_date} to {upcomingTrip.end_date}</UpcomingTripDates>
             </div>
           </UpcomingTripContent>
           <UseTripButton 
             type="button" 
             variant="secondary" 
             onClick={useUpcomingTrip}
             disabled={isLoadingTrips}
           >
             {isLoadingTrips ? 'Loading...' : 'Use This Trip'}
           </UseTripButton>
         </UpcomingTripCard>
       )}
       
       {!isLoadingTrips && !upcomingTrip && (
         <div style={{
           background: 'var(--color-surface-light)',
           border: '1px solid var(--color-border)',
           borderRadius: 'var(--radius-lg)',
           padding: 'var(--spacing-4)',
           marginBottom: 'var(--spacing-6)',
           textAlign: 'center',
           color: 'var(--color-text-secondary)',
           fontSize: 'var(--font-size-sm)'
         }}>
           💡 <strong>Tip:</strong> Add trips to your planner to quickly pre-fill flight searches
         </div>
       )}

      <SearchForm onSubmit={handleSubmit}>
        <FormTitle>Find Flights</FormTitle>

        {error && (
          <div style={{ 
            background: '#fef2f2', 
            border: '1px solid #fecaca', 
            color: '#dc2626', 
            padding: 'var(--spacing-3)', 
            borderRadius: 'var(--radius-lg)', 
            marginBottom: 'var(--spacing-4)', 
            fontSize: 'var(--font-size-sm)' 
          }}>
            {error}
          </div>
        )}

        <FormGrid>
          <FormGroup>
            <FormLabel>Origin</FormLabel>
            <CustomInput
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              placeholder="e.g., LON, CDG, FRA"
              icon={<MapPin size={20} />}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Destination</FormLabel>
            <CustomInput
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="e.g., FRA, CDG, MUC"
              icon={<MapPin size={20} />}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Departure Date</FormLabel>
            <DateInputContainer>
              <CustomInput
                name="depart"
                value={formData.depart}
                onChange={handleInputChange}
                placeholder="YYYY-MM-DD"
                icon={<Calendar size={20} />}
                onClick={() => setShowDepartPicker(!showDepartPicker)}
                readOnly
                required
              />
              {showDepartPicker && (
                <DatePickerContainer>
                  <DayPicker
                    mode="single"
                    selected={formData.depart ? new Date(formData.depart) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'depart')}
                    disabled={{ before: new Date() }}
                  />
                </DatePickerContainer>
              )}
            </DateInputContainer>
          </FormGroup>

          <FormGroup>
            <FormLabel>Return Date (Optional)</FormLabel>
            <DateInputContainer>
              <CustomInput
                name="return"
                value={formData.return}
                onChange={handleInputChange}
                placeholder="YYYY-MM-DD"
                icon={<Calendar size={20} />}
                onClick={() => setShowReturnPicker(!showReturnPicker)}
                readOnly
              />
              {showReturnPicker && (
                <DatePickerContainer>
                  <DayPicker
                    mode="single"
                    selected={formData.return ? new Date(formData.return) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'return')}
                    disabled={{ before: formData.depart ? new Date(formData.depart) : new Date() }}
                  />
                </DatePickerContainer>
              )}
            </DateInputContainer>
          </FormGroup>

          <FormGroup>
            <FormLabel>Adults</FormLabel>
            <CustomSelect
              name="adults"
              value={formData.adults}
              onChange={handleInputChange}
              options={adultsOptions}
              icon={<Users size={20} />}
              required
            />
          </FormGroup>
        </FormGrid>

                 <SubmitButton type="submit" disabled={isLoading}>
           {isLoading ? (
             <>
               <div style={{
                 display: 'inline-block',
                 width: '20px',
                 height: '20px',
                 border: '3px solid var(--color-border)',
                 borderRadius: '50%',
                 borderTopColor: 'var(--color-primary)',
                 animation: 'spin 1s ease-in-out infinite',
                 marginRight: 'var(--spacing-2)'
               }} />
               Searching Flights...
             </>
           ) : (
             <>
               <Search size={20} />
               Search Flights
             </>
           )}
         </SubmitButton>
       </SearchForm>

       {/* Legal Notices */}
       <div style={{
         marginTop: 'var(--spacing-6)',
         padding: 'var(--spacing-4)',
         background: 'var(--color-surface-light)',
         borderRadius: 'var(--radius-lg)',
         border: '1px solid var(--color-border)'
       }}>
         <div style={{
           display: 'flex',
           alignItems: 'center',
           gap: 'var(--spacing-2)',
           color: 'var(--color-text-secondary)',
           fontSize: 'var(--font-size-sm)',
           marginBottom: 'var(--spacing-2)'
         }}>
           <Info size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
           <span>Prices and availability are provided by partners and may change at checkout.</span>
         </div>
         <div style={{
           display: 'flex',
           alignItems: 'center',
           gap: 'var(--spacing-2)',
           color: 'var(--color-text-secondary)',
           fontSize: 'var(--font-size-sm)'
         }}>
           <Info size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
           <span>We may earn an affiliate commission.</span>
         </div>
       </div>

      {searchResults && (
        <ResultsSection>
          <ResultsHeader>
            <ResultsTitle>Flight Search Results</ResultsTitle>
            <ResultsSubtitle>
              {searchResults.length} flights found for your search
            </ResultsSubtitle>
          </ResultsHeader>

          <div style={{ 
            background: 'var(--color-surface)', 
            borderRadius: 'var(--radius-xl)', 
            padding: 'var(--spacing-6)', 
            textAlign: 'center',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 2rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <Plane size={40} color="white" />
            </div>
            
            <h2 style={{ 
              fontSize: 'var(--font-size-xl)', 
              fontWeight: 'var(--font-weight-semibold)', 
              color: 'var(--color-text)', 
              margin: '0 0 1rem 0' 
            }}>
              Flight Search Coming Soon
            </h2>
            <p style={{ 
              fontSize: 'var(--font-size-base)', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6', 
              margin: '0', 
              maxWidth: '600px' 
            }}>
              We're working on integrating comprehensive flight search capabilities. 
              Soon you'll be able to find the best routes, compare prices, and book 
              flights directly within Stay Planner while keeping track of your 
              Schengen compliance.
            </p>
          </div>

          {/* Legal Notices */}
          <div style={{
            marginTop: 'var(--spacing-6)',
            padding: 'var(--spacing-4)',
            background: 'var(--color-surface-light)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-sm)',
              marginBottom: 'var(--spacing-2)'
            }}>
              <Info size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span>Prices and availability are provided by partners and may change at checkout.</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-sm)'
            }}>
              <Info size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span>We may earn an affiliate commission.</span>
            </div>
          </div>
        </ResultsSection>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Telemetry Debug Component */}
      <TelemetryDebug />
    </div>
  );
};

export default FindFlights;
