import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PageContainer,
  MediumCard,
  MediumIconContainer,
  MediumIcon,
  MediumTitle,
  MediumSubtitle,
  Form,
  FormGroup,
  MediumLabel,
  MediumInput,
  MediumButton,
  ErrorMessage,
  Text,
  StyledLink,
  FlexCenter,
  Spacer,
  Toast
} from '../styles/common';
import { api, ApiError } from '../utils/api';
import styled from '@emotion/styled';

const RegisterContainer = styled.div`
  width: 100%;
  max-width: 32rem;
`;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toastError, setToastError] = useState('');
  const [toastSuccess, setToastSuccess] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const showErrorToast = (message) => {
    setToastError(message);
    setTimeout(() => setToastError(''), 5000);
  };

  const showSuccessToast = (message) => {
    setToastSuccess(message);
    setTimeout(() => setToastSuccess(''), 3000);
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
      
      showSuccessToast('Account created successfully! Redirecting...');
      // Wait a moment for the toast to show, then redirect
      setTimeout(() => {
        navigate('/app');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof ApiError) {
        showErrorToast(error.message);
      } else {
        showErrorToast('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {toastError && (
        <Toast className="toast-error">
          {toastError}
        </Toast>
      )}
      
      {toastSuccess && (
        <Toast className="toast-success">
          {toastSuccess}
        </Toast>
      )}
      
      <PageContainer>
        <RegisterContainer>
          <MediumCard>
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
          </MediumCard>
        </RegisterContainer>
      </PageContainer>
    </>
  );
};

export default Register;
