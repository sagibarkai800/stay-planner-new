import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { api } from '../utils/api';
import { 
  Card, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button, 
  Title, 
  Text, 
  StyledLink, 
  ErrorMessage,
  Toast,
  FlexCenter,
  MediumIconContainer,
  MediumIcon,
  Spacer,
  MediumTitle,
  MediumSubtitle,
  MediumLabel,
  MediumInput,
  MediumButton
} from '../styles/common';
import { UserPlus, Mail, Lock, Shield } from 'lucide-react';

const RegisterContainer = styled.div`
  width: 100%;
  max-width: 32rem;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await api.auth.register({
        email: formData.email,
        password: formData.password
      });
      
      showToast('Registration successful! Please log in.', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      {toast && (
        <Toast className={`toast-${toast.type}`}>
          {toast.message}
        </Toast>
      )}
      
      <Card>
        <FlexCenter>
          <MediumIconContainer>
            <MediumIcon>🚀</MediumIcon>
          </MediumIconContainer>
        </FlexCenter>
        
        <Spacer size="var(--spacing-8)" />
        
        <MediumTitle style={{ textAlign: 'center' }}>
          Create Account
        </MediumTitle>
        
        <MediumSubtitle style={{ textAlign: 'center' }}>
          Join Stay Planner and start organizing your travels
        </MediumSubtitle>
        
        <Spacer size="var(--spacing-8)" />
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <MediumLabel htmlFor="email">Email Address</MediumLabel>
            <MediumInput
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              disabled={isLoading}
            />
            {errors.email && (
              <ErrorMessage style={{ marginTop: 'var(--spacing-2)' }}>
                {errors.email}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <MediumLabel htmlFor="password">Password</MediumLabel>
            <MediumInput
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={!!errors.password}
              disabled={isLoading}
            />
            {errors.password && (
              <ErrorMessage style={{ marginTop: 'var(--spacing-2)' }}>
                {errors.password}
              </ErrorMessage>
            )}
            <Text style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-2)' }}>
              Must be at least 6 characters with uppercase, lowercase, and number
            </Text>
          </FormGroup>
          
          <FormGroup>
            <MediumLabel htmlFor="confirmPassword">Confirm Password</MediumLabel>
            <MediumInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <ErrorMessage style={{ marginTop: 'var(--spacing-2)' }}>
                {errors.confirmPassword}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <Spacer size="var(--spacing-6)" />
          
          <MediumButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </MediumButton>
        </Form>
        
        <Spacer size="var(--spacing-6)" />
        
        <Text style={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <StyledLink to="/login">Sign in here</StyledLink>
        </Text>
      </Card>
    </>
  );
};

export default Register;
