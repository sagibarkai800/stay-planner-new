import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { MapPin, Calendar, Users, Search, ExternalLink, Plane, Info } from 'lucide-react';
import { getCountryName } from '../utils/validation';
import { validateRequiredFields, validateNumericRange, isValidDateRange } from '../utils/shared';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import telemetry from '../services/telemetry';
import { Input as BaseInput, Select as BaseSelect, Button, Badge } from '../styles/common';
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

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-6);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  text-align: center;
  transition: all var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
`;

const PrimaryCard = styled(Card)`
  border-color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-light) 100%);
`;

const SecondaryCard = styled(Card)`
  opacity: 0.8;
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: white;
`;

const CardTitle = styled.h4`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-3);
`;

const CardDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-4);
  line-height: 1.5;
`;

const CardButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: var(--spacing-3);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-4);
  font-size: var(--font-size-sm);
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid var(--color-border);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
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

const LegalNotices = styled.div`
  margin-top: var(--spacing-6);
  padding: var(--spacing-4);
  background: var(--color-surface-light);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
`;

const NoticeItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-2);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoIcon = styled(Info)`
  color: var(--color-primary);
  flex-shrink: 0;
`;

const FindStays = () => {
  const [formData, setFormData] = useState({
    destination: '',
    checkin: '',
    checkout: '',
    adults: '2',
    lat: '',
    lng: ''
  });
  
           const [searchResults, setSearchResults] = useState(null);
         const [isLoading, setIsLoading] = useState(false);
         const [error, setError] = useState(null);
         const [showCheckinPicker, setShowCheckinPicker] = useState(false);
         const [showCheckoutPicker, setShowCheckoutPicker] = useState(false);
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
           telemetry.logPageView('find_stays', {});
           
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
      if (field === 'checkin') {
        setShowCheckinPicker(false);
      } else if (field === 'checkout') {
        setShowCheckoutPicker(false);
      }
    }
  };

           const handleSubmit = async (e) => {
           e.preventDefault();
           setError(null);
           setIsLoading(true);
           
           // Log telemetry
           telemetry.logFormSubmit('accommodation_search', {
             destination: formData.destination,
             checkin: formData.checkin,
             checkout: formData.checkout,
             adults: formData.adults,
             hasCoordinates: !!(formData.lat && formData.lng)
           });
           
           try {
             console.log('🔍 Frontend: Submitting form data:', formData);
             
             const response = await fetch('/api/stays/links', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify(formData),
               credentials: 'include'
             });
             
             console.log('🔍 Frontend: Response status:', response.status);
             console.log('🔍 Frontend: Response headers:', response.headers);
             
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
               throw new Error(errorData.error || 'Failed to generate links');
             }
             
             console.log('🔍 Frontend: Response OK, trying to parse data');
             const data = await response.json();
             console.log('🔍 Frontend: Parsed data:', data);
             setSearchResults(data);
           } catch (error) {
             console.error('🔍 Frontend: Error in handleSubmit:', error);
             setError(error.message);
             
             // Log error telemetry
             telemetry.logError('accommodation_search_failed', {
               error: error.message,
               destination: formData.destination
             });
           } finally {
             setIsLoading(false);
           }
         };

           const openUrl = (url) => {
           // Log telemetry
           const provider = url.includes('booking.com') ? 'booking' : 
                           url.includes('airbnb') ? 'airbnb' : 'unknown';
           telemetry.logExternalLink(provider, { url: url.substring(0, 100) });
           
           window.open(url, '_blank', 'noopener,noreferrer');
         };

         const useUpcomingTrip = () => {
           if (upcomingTrip) {
             setFormData({
               destination: getCountryName(upcomingTrip.country),
               checkin: upcomingTrip.start_date,
               checkout: upcomingTrip.end_date,
               adults: '2',
               lat: '',
               lng: ''
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
                 💡 <strong>Tip:</strong> Add trips to your planner to quickly pre-fill accommodation searches
               </div>
             )}
               
             <SearchForm onSubmit={handleSubmit}>
             <FormTitle>Find Accommodation</FormTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormGrid>
          <FormGroup>
            <FormLabel>Destination</FormLabel>
            <CustomInput
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="e.g., Paris, France"
              icon={<MapPin size={20} />}
              required
            />
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
          
          <FormGroup>
            <FormLabel>Check-in Date</FormLabel>
            <DateInputContainer>
              <CustomInput
                name="checkin"
                value={formData.checkin}
                onChange={handleInputChange}
                placeholder="YYYY-MM-DD"
                icon={<Calendar size={20} />}
                onClick={() => setShowCheckinPicker(!showCheckinPicker)}
                readOnly
                required
              />
              {showCheckinPicker && (
                <DatePickerContainer>
                  <DayPicker
                    mode="single"
                    selected={formData.checkin ? new Date(formData.checkin) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'checkin')}
                    disabled={{ before: new Date() }}
                  />
                </DatePickerContainer>
              )}
            </DateInputContainer>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Check-out Date</FormLabel>
            <DateInputContainer>
              <CustomInput
                name="checkout"
                value={formData.checkout}
                onChange={handleInputChange}
                placeholder="YYYY-MM-DD"
                icon={<Calendar size={20} />}
                onClick={() => setShowCheckoutPicker(!showCheckoutPicker)}
                readOnly
                required
              />
              {showCheckoutPicker && (
                <DatePickerContainer>
                  <DayPicker
                    mode="single"
                    selected={formData.checkout ? new Date(formData.checkout) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'checkout')}
                    disabled={{ before: formData.checkin ? new Date(formData.checkin) : new Date() }}
                  />
                </DatePickerContainer>
              )}
            </DateInputContainer>
          </FormGroup>
        </FormGrid>
        
                       <SubmitButton type="submit" disabled={isLoading}>
                 {isLoading ? (
                   <>
                     <LoadingSpinner />
                     Generating Links...
                   </>
                 ) : (
                   <>
                     <Search size={20} />
                     Find Accommodation
                   </>
                 )}
               </SubmitButton>
               
               <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'center' }}>
                          <Button
           type="button"
           variant="secondary"
           onClick={async () => {
             // Log telemetry
             telemetry.logButtonClick('test_api_endpoint', { endpoint: '/api/stays/test' });
             
             try {
               console.log('🔍 Testing stays API endpoint...');
               const response = await fetch('/api/stays/test');
               const data = await response.json();
               console.log('🔍 Test response:', data);
               alert('API Test: ' + JSON.stringify(data, null, 2));
             } catch (error) {
               console.error('🔍 Test failed:', error);
               alert('API Test failed: ' + error.message);
             }
           }}
         >
           Test API Endpoint
         </Button>
                 
                 <Button 
                   type="button" 
                   variant="secondary" 
                   style={{ marginLeft: 'var(--spacing-3)' }}
                   onClick={async () => {
                     // Log telemetry
                     telemetry.logButtonClick('test_post_request', { endpoint: '/api/stays/links' });
                     
                     try {
                       console.log('🔍 Testing stays API with POST...');
                       const testData = {
                         destination: 'Paris',
                         checkin: '2025-09-01',
                         checkout: '2025-09-05',
                         adults: '2'
                       };
                       console.log('🔍 Test data:', testData);
                       
                       const response = await fetch('/api/stays/links', {
                         method: 'POST',
                         headers: {
                           'Content-Type': 'application/json',
                         },
                         body: JSON.stringify(testData),
                         credentials: 'include'
                       });
                       
                       console.log('🔍 Response status:', response.status);
                       console.log('🔍 Response headers:', response.headers);
                       
                       if (response.ok) {
                         const data = await response.json();
                         console.log('🔍 Test POST response:', data);
                         alert('POST Test Success: ' + JSON.stringify(data, null, 2));
                       } else {
                         const errorText = await response.text();
                         console.log('🔍 Error response text:', errorText);
                         alert('POST Test Failed: ' + response.status + ' - ' + errorText);
                       }
                     } catch (error) {
                       console.error('🔍 POST test failed:', error);
                       alert('POST Test failed: ' + error.message);
                     }
                   }}
                 >
                   Test POST Request
                 </Button>
               </div>
             </SearchForm>

      {searchResults && (
        <ResultsSection>
          <ResultsHeader>
            <ResultsTitle>Accommodation Options</ResultsTitle>
            <ResultsSubtitle>
              Click on the buttons below to search for accommodation on each platform
            </ResultsSubtitle>
          </ResultsHeader>
          
                           <CardsGrid>
                   <PrimaryCard>
                     <CardIcon>
                       <MapPin size={24} />
                     </CardIcon>
                     <CardTitle>Search on Booking.com</CardTitle>
                     <CardDescription>
                       Find hotels, apartments, and vacation rentals with our affiliate partnership
                     </CardDescription>
                     {searchResults.bookingUrl && searchResults.bookingUrl.includes('aid=DEMO') && (
                       <Badge style={{ marginBottom: 'var(--spacing-3)' }}>Demo Mode</Badge>
                     )}
                     <CardButton onClick={() => openUrl(searchResults.bookingUrl)}>
                       <ExternalLink size={18} />
                       Search on Booking.com
                     </CardButton>
                   </PrimaryCard>

                   {searchResults.airbnbUrl && (
                     <SecondaryCard>
                       <CardIcon>
                         <MapPin size={24} />
                       </CardIcon>
                       <CardTitle>Open on Airbnb</CardTitle>
                       <CardDescription>
                         Explore unique stays and local experiences
                       </CardDescription>
                       <CardButton onClick={() => openUrl(searchResults.airbnbUrl)}>
                         <ExternalLink size={18} />
                         Open on Airbnb
                       </CardButton>
                     </SecondaryCard>
                   )}
                 </CardsGrid>

                 {/* Legal Notices */}
                 <LegalNotices>
                   <NoticeItem>
                     <InfoIcon size={16} />
                     <span>Prices and availability are provided by partners and may change at checkout.</span>
                   </NoticeItem>
                   <NoticeItem>
                     <InfoIcon size={16} />
                     <span>We may earn an affiliate commission.</span>
                   </NoticeItem>
                 </LegalNotices>
        </ResultsSection>
      )}
      
      {/* Telemetry Debug Component */}
      <TelemetryDebug />
    </div>
  );
};

export default FindStays;
