import React, { useState } from 'react';
import styled from '@emotion/styled';
import { MapPin, Calendar, Users, Search, ExternalLink } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Input as BaseInput, Select as BaseSelect, Button, Badge } from '../styles/common';

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

  // Adults options
  const adultsOptions = [
    { value: '1', label: '1 Adult' },
    { value: '2', label: '2 Adults' },
    { value: '3', label: '3 Adults' },
    { value: '4', label: '4 Adults' },
    { value: '5', label: '5 Adults' },
    { value: '6', label: '6 Adults' }
  ];

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
           } finally {
             setIsLoading(false);
           }
         };

  const openUrl = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div>
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
        </ResultsSection>
      )}
    </div>
  );
};

export default FindStays;
