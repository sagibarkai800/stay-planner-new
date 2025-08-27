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

const LoginContainer = styled.div`
  width: 100%;
  max-width: 28rem;
`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toastError, setToastError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await api.auth.login(formData);
      // Success - cookie is automatically set by the server
      navigate('/app');
    } catch (error) {
      console.error('Login error:', error);
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
      
      <PageContainer>
        <LoginContainer>
          <MediumCard>
            <FlexCenter>
              <MediumIconContainer>
                <MediumIcon>🔐</MediumIcon>
              </MediumIconContainer>
            </FlexCenter>
            
            <Spacer size="var(--spacing-8)" />
            
            <MediumTitle style={{ textAlign: 'center' }}>
              Welcome Back
            </MediumTitle>
            
            <MediumSubtitle style={{ textAlign: 'center' }}>
              Sign in to your account to continue
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
                  placeholder="Enter your password"
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
              </FormGroup>
              
              <Spacer size="var(--spacing-6)" />
              
              <MediumButton type="submit" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </MediumButton>
            </Form>
            
            <Spacer size="var(--spacing-6)" />
            
            <Text style={{ textAlign: 'center' }}>
              Don't have an account?{' '}
              <StyledLink to="/register">Sign up here</StyledLink>
            </Text>
          </MediumCard>
        </LoginContainer>
      </PageContainer>
    </>
  );
};

export default Login;
