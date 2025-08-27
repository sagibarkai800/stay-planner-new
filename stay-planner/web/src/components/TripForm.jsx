import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button, Input, Select, Card, FormGroup, Label } from '../styles/common';
import { Plus, Calendar } from 'lucide-react';

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

const TripForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    country: initialData?.country || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      if (startDate >= endDate) {
        newErrors.end_date = 'End date must be after start date';
      }
      
      if (startDate < today) {
        newErrors.start_date = 'Start date cannot be in the past';
      }
      
      if (endDate < today) {
        newErrors.end_date = 'End date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <FormContainer>
      <FormHeader>
        <Calendar size={24} />
        <FormTitle>
          {isEditing ? 'Edit Trip' : 'Add New Trip'}
        </FormTitle>
      </FormHeader>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="country">Country *</Label>
          <Select
            id="country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            error={!!errors.country}
          >
            <option value="">Select a country</option>
            {SCHENGEN_COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </Select>
          {errors.country && <ErrorText>{errors.country}</ErrorText>}
        </FormGroup>
        
        <FormRow>
          <FormGroup>
            <Label htmlFor="start_date">Start Date *</Label>
            <Input
              type="date"
              id="start_date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              error={!!errors.start_date}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.start_date && <ErrorText>{errors.start_date}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="end_date">End Date *</Label>
            <Input
              type="date"
              id="end_date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              error={!!errors.end_date}
              min={formData.start_date || new Date().toISOString().split('T')[0]}
            />
            {errors.end_date && <ErrorText>{errors.end_date}</ErrorText>}
          </FormGroup>
        </FormRow>
        
        <ButtonGroup>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
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
