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
  PageContainer,
  MediumCard,
  FlexCenter,
  MediumIconContainer,
  MediumIcon,
  MediumTitle,
  MediumSubtitle,
  Spacer,
  MediumLabel,
  MediumInput,
  MediumButton
} from '../styles/common';
import { LogIn, Mail, Lock } from 'lucide-react';

const LoginContainer = styled.div`
  width: 100%;
  max-width: 28rem;
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      await api.auth.login(formData);
      navigate('/app');
    } catch (error) {
      console.error('Login failed:', error);
      showToast(error.message || 'Login failed. Please check your credentials.', 'error');
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
                  placeholder="Enter your password"
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
