import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
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
  StyledLink
} from '../styles/common';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.auth.login(formData);
      navigate('/app');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <MediumCard>
        <MediumIconContainer style={{ margin: '0 auto 2rem' }}>
          <MediumIcon>🏠</MediumIcon>
        </MediumIconContainer>
        
        <MediumTitle style={{ textAlign: 'center' }}>Stay Planner</MediumTitle>
        <MediumSubtitle style={{ textAlign: 'center' }}>Sign in to your account</MediumSubtitle>
        
        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              <Text style={{ color: '#b91c1c', fontSize: '1rem' }}>{error}</Text>
            </ErrorMessage>
          )}
          
          <FormGroup>
            <MediumLabel htmlFor="email">Email address</MediumLabel>
            <MediumInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </FormGroup>
          
          <FormGroup>
            <MediumLabel htmlFor="password">Password</MediumLabel>
            <MediumInput
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </FormGroup>

          <MediumButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </MediumButton>
        </Form>

        <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <Text style={{ fontSize: '1.125rem' }}>
            Don't have an account?{' '}
            <StyledLink to="/register">Sign up here</StyledLink>
          </Text>
        </div>
      </MediumCard>
    </PageContainer>
  );
};

export default Login;
