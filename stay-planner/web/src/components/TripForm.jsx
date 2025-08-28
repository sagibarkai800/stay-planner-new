import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, Input, Select, Card, FormGroup, Label } from '../styles/common';
import { Plus, Calendar } from 'lucide-react';
import { validateTripData, validateTripOverlap, formatOverlapError, getCountryName } from '../utils/validation';
import ErrorDisplay from './ErrorDisplay';

const FormContainer = styled(Card)`
  max-width: 600px;
  margin-bottom: 2rem;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  svg {
    margin-right: 0.75rem;
    color: var(--color-primary);
  }
`;

const FormTitle = styled.h3`
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-xl);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const ErrorText = styled.div`
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: 0.5rem;
`;

const OverlapDetails = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #fbbf24;
  border-radius: 0.75rem;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #92400e;
`;

// List of Schengen countries
const SCHENGEN_COUNTRIES = [
  { code: 'AUT', name: 'Austria' },
  { code: 'BEL', name: 'Belgium' },
  { code: 'CZE', name: 'Czech Republic' },
  { code: 'DNK', name: 'Denmark' },
  { code: 'EST', name: 'Estonia' },
  { code: 'FIN', name: 'Finland' },
  { code: 'FRA', name: 'France' },
  { code: 'DEU', name: 'Germany' },
  { code: 'GRC', name: 'Greece' },
  { code: 'HUN', name: 'Hungary' },
  { code: 'ISL', name: 'Iceland' },
  { code: 'ITA', name: 'Italy' },
  { code: 'LVA', name: 'Latvia' },
  { code: 'LIE', name: 'Liechtenstein' },
  { code: 'LTU', name: 'Lithuania' },
  { code: 'LUX', name: 'Luxembourg' },
  { code: 'MLT', name: 'Malta' },
  { code: 'NLD', name: 'Netherlands' },
  { code: 'NOR', name: 'Norway' },
  { code: 'POL', name: 'Poland' },
  { code: 'PRT', name: 'Portugal' },
  { code: 'SVK', name: 'Slovakia' },
  { code: 'SVN', name: 'Slovenia' },
  { code: 'ESP', name: 'Spain' },
  { code: 'SWE', name: 'Sweden' },
  { code: 'CHE', name: 'Switzerland' }
];

const TripForm = ({ onSubmit, onCancel, initialData = null, isEditing = false, existingTrips = [] }) => {
  const [formData, setFormData] = useState({
    country: initialData?.country || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || ''
  });
  
  const [errors, setErrors] = useState([]);
  const [overlapErrors, setOverlapErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors when form data changes
  useEffect(() => {
    if (errors.length > 0 || overlapErrors.length > 0) {
      validateForm();
    }
  }, [formData.country, formData.start_date, formData.end_date]);

  const validateForm = () => {
    const validationErrors = [];
    let overlapValidation = { isValid: true, errors: [], overlappingTrips: [] };
    
    // Basic validation
    const basicValidation = validateTripData(formData);
    if (!basicValidation.isValid) {
      validationErrors.push(...basicValidation.errors);
    }
    
    // Overlap validation (only if we have country and dates)
    if (formData.country && formData.start_date && formData.end_date && basicValidation.isValid) {
      overlapValidation = validateTripOverlap(
        formData, 
        existingTrips, 
        isEditing ? initialData?.id : null
      );
      
      if (!overlapValidation.isValid) {
        validationErrors.push(...overlapValidation.errors);
      }
    }
    
    setErrors(validationErrors);
    setOverlapErrors(overlapValidation.overlappingTrips);
    
    return validationErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        country: '',
        start_date: '',
        end_date: ''
      });
      setErrors([]);
      setOverlapErrors([]);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearErrors = () => {
    setErrors([]);
    setOverlapErrors([]);
  };

  return (
    <FormContainer>
      <FormHeader>
        <Calendar size={24} />
        <FormTitle>
          {isEditing ? 'Edit Trip' : 'Add New Trip'}
        </FormTitle>
      </FormHeader>
      
      {/* Display validation errors */}
      <ErrorDisplay 
        errors={errors} 
        onClose={clearErrors}
        showCloseButton={true}
      />
      
      {/* Display overlap details */}
      {overlapErrors.length > 0 && (
        <OverlapDetails>
          {overlapErrors.some(trip => trip.sameDates) ? (
            <>
              <strong>⚠️ Same Date Conflict:</strong>
              <p style={{ margin: '0.5rem 0', color: '#dc2626' }}>
                You cannot have multiple trips on the exact same dates. This would mean being in multiple places at once!
              </p>
              <strong>Conflicting trips:</strong>
              <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                {overlapErrors.filter(trip => trip.sameDates).map((overlap, index) => (
                  <li key={index}>
                    {getCountryName(overlap.country)}: {overlap.start_date} to {overlap.end_date}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <strong>⚠️ Date Overlap Conflicts:</strong>
              <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                {overlapErrors.map((overlap, index) => (
                  <li key={index}>
                    {formatOverlapError(overlap, getCountryName(overlap.country))}
                  </li>
                ))}
              </ul>
            </>
          )}
        </OverlapDetails>
      )}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="country">Country *</Label>
          <Select
            id="country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            error={errors.some(e => e.includes('Country'))}
          >
            <option value="">Select a country</option>
            {SCHENGEN_COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        
        <FormRow>
          <FormGroup>
            <Label htmlFor="start_date">Start Date *</Label>
            <Input
              type="date"
              id="start_date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              error={errors.some(e => e.includes('start date') || e.includes('Start date'))}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="end_date">End Date *</Label>
            <Input
              type="date"
              id="end_date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              error={errors.some(e => e.includes('end date') || e.includes('End date'))}
              min={formData.start_date || new Date().toISOString().split('T')[0]}
            />
          </FormGroup>
        </FormRow>
        
        {/* Helpful tip about same-day travel */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
          border: '2px solid #0ea5e9', 
          borderRadius: '0.75rem', 
          padding: '0.75rem', 
          marginTop: '1rem',
          fontSize: '0.875rem',
          color: '#0369a1'
        }}>
          <strong>💡 Travel Tip:</strong> You can plan trips that start on the same day another trip ends 
          (e.g., fly from France to Italy on the same day). The system will automatically handle the 
          Schengen day counting correctly.
        </div>
        
        <ButtonGroup>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || errors.length > 0}>
            {isSubmitting ? (
              'Saving...'
            ) : (
              <>
                <Plus size={16} />
                {isEditing ? 'Update Trip' : 'Add Trip'}
              </>
            )}
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default TripForm;
