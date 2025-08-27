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

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      await api.auth.register(formData);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
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
        <MediumSubtitle style={{ textAlign: 'center' }}>Create your account</MediumSubtitle>
        
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
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </FormGroup>

          <FormGroup>
            <MediumLabel htmlFor="confirmPassword">Confirm Password</MediumLabel>
            <MediumInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </FormGroup>

          <MediumButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </MediumButton>
        </Form>

        <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <Text style={{ fontSize: '1.125rem' }}>
            Already have an account?{' '}
            <StyledLink to="/login">Sign in here</StyledLink>
          </Text>
        </div>
      </MediumCard>
    </PageContainer>
  );
};

export default Register;
