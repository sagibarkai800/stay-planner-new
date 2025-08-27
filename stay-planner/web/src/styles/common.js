import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

// Common Layout Components
export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-12) var(--spacing-4);
`;

export const Card = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-8);
  border: 2px solid var(--color-border);
  transition: all var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-xl);
    border-color: var(--color-border-light);
  }
`;

export const LargeCard = styled(Card)`
  padding: var(--spacing-20);
  max-width: 72rem;
  width: 100%;
`;

export const MediumCard = styled(Card)`
  padding: var(--spacing-14);
  max-width: 56rem;
  width: 100%;
`;

// Common Form Components
export const Form = styled.form`
  margin-top: var(--spacing-8);
`;

export const FormGroup = styled.div`
  margin-bottom: var(--spacing-8);
`;

export const Label = styled.label`
  display: block;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-3);
  font-family: var(--font-family-sans);
`;

export const LargeLabel = styled(Label)`
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-6);
`;

export const MediumLabel = styled(Label)`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-4);
`;

export const Input = styled.input`
  width: 100%;
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background: var(--color-surface-light);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  outline: none;
  transition: all var(--transition-normal);
  font-family: var(--font-family-sans);
  
  &::placeholder {
    color: var(--color-text-muted);
  }
  
  &:focus {
    border-color: var(--color-primary);
    box-shadow: var(--focus-ring);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LargeInput = styled(Input)`
  padding: var(--spacing-8) var(--spacing-10);
  font-size: var(--font-size-xl);
  border-radius: var(--radius-xl);
`;

export const MediumInput = styled(Input)`
  padding: var(--spacing-6) var(--spacing-8);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-lg);
`;

// NEW: Select Component
export const Select = styled.select`
  width: 100%;
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background: var(--color-surface-light);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  outline: none;
  transition: all var(--transition-normal);
  font-family: var(--font-family-sans);
  cursor: pointer;
  
  &:focus {
    border-color: var(--color-primary);
    box-shadow: var(--focus-ring);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  option {
    background: var(--color-surface);
    color: var(--color-text);
    padding: var(--spacing-2);
  }
`;

export const Button = styled.button`
  padding: var(--spacing-4) var(--spacing-8);
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: var(--font-family-sans);
  
  &:hover:not(:disabled) {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: var(--focus-ring);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LargeButton = styled(Button)`
  padding: var(--spacing-8) var(--spacing-10);
  font-size: var(--font-size-xl);
  border-radius: var(--radius-xl);
  width: 100%;
`;

export const MediumButton = styled(Button)`
  padding: var(--spacing-6) var(--spacing-8);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-lg);
  width: 100%;
`;

export const SecondaryButton = styled(Button)`
  background: var(--color-secondary);
  
  &:hover:not(:disabled) {
    background: var(--color-secondary-light);
  }
`;

// NEW: Badge Component
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-full);
  font-family: var(--font-family-sans);
  
  &.badge-primary {
    background: var(--color-primary);
    color: white;
  }
  
  &.badge-secondary {
    background: var(--color-secondary);
    color: var(--color-text);
  }
  
  &.badge-success {
    background: var(--color-success);
    color: white;
  }
  
  &.badge-warning {
    background: var(--color-warning);
    color: white;
  }
  
  &.badge-error {
    background: var(--color-error);
    color: white;
  }
  
  &.badge-info {
    background: var(--color-info);
    color: white;
  }
`;

// Common Text Components
export const Title = styled.h1`
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: var(--spacing-4);
  font-family: var(--font-family-sans);
`;

export const LargeTitle = styled(Title)`
  font-size: var(--font-size-5xl);
  margin-bottom: var(--spacing-6);
`;

export const MediumTitle = styled(Title)`
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-5);
`;

export const Subtitle = styled.p`
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-4);
  font-family: var(--font-family-sans);
`;

export const LargeSubtitle = styled(Subtitle)`
  font-size: var(--font-size-xl);
`;

export const MediumSubtitle = styled(Subtitle)`
  font-size: var(--font-size-lg);
`;

export const Text = styled.p`
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: var(--line-height-normal);
  font-family: var(--font-family-sans);
`;

// Common Icon Components
export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
`;

export const LargeIconContainer = styled(IconContainer)`
  width: 10rem;
  height: 10rem;
  border-radius: var(--radius-3xl);
  box-shadow: var(--shadow-xl);
`;

export const MediumIconContainer = styled(IconContainer)`
  width: 8rem;
  height: 8rem;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
`;

export const Icon = styled.span`
  font-size: var(--font-size-2xl);
  color: white;
`;

export const LargeIcon = styled(Icon)`
  font-size: var(--font-size-5xl);
`;

export const MediumIcon = styled(Icon)`
  font-size: var(--font-size-4xl);
`;

// Common Link Components
export const StyledLink = styled(Link)`
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
  font-family: var(--font-family-sans);
  
  &:hover {
    color: var(--color-primary-hover);
  }
  
  &:focus {
    outline: none;
    box-shadow: var(--focus-ring);
    border-radius: var(--radius-base);
  }
`;

// Enhanced Status Components with NEW Alert component
export const ErrorMessage = styled.div`
  background: var(--color-error);
  border-left: 4px solid var(--color-error-hover);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-4);
`;

export const SuccessMessage = styled.div`
  background: var(--color-success);
  border-left: 4px solid var(--color-success-hover);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-4);
`;

export const InfoMessage = styled.div`
  background: var(--color-info);
  border-left: 4px solid var(--color-info-hover);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-4);
`;

// NEW: Alert Component
export const Alert = styled.div`
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-4);
  border: 1px solid transparent;
  font-family: var(--font-family-sans);
  
  &.alert-info {
    background: rgba(59, 130, 246, 0.1);
    border-color: var(--color-info);
    color: var(--color-info);
  }
  
  &.alert-success {
    background: rgba(16, 185, 129, 0.1);
    border-color: var(--color-success);
    color: var(--color-success);
  }
  
  &.alert-warning {
    background: rgba(245, 158, 11, 0.1);
    border-color: var(--color-warning);
    color: var(--color-warning);
  }
  
  &.alert-error {
    background: rgba(239, 68, 68, 0.1);
    border-color: var(--color-error);
    color: var(--color-error);
  }
`;

// NEW: Toast Component
export const Toast = styled.div`
  position: fixed;
  top: var(--spacing-6);
  right: var(--spacing-6);
  padding: var(--spacing-4) var(--spacing-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-tooltip);
  animation: slideIn 0.3s ease-out;
  max-width: 24rem;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  &.toast-success {
    background: var(--color-success);
    color: white;
  }
  
  &.toast-error {
    background: var(--color-error);
    color: white;
  }
  
  &.toast-warning {
    background: var(--color-warning);
    color: white;
  }
  
  &.toast-info {
    background: var(--color-info);
    color: white;
  }
`;

// Common Layout Utilities
export const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Grid = styled.div`
  display: grid;
  gap: var(--spacing-6);
`;

export const Grid2 = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export const Grid3 = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

// Common Spacing
export const Spacer = styled.div`
  height: ${props => props.size || 'var(--spacing-4)'};
`;

export const HorizontalSpacer = styled.div`
  width: ${props => props.size || 'var(--spacing-4)'};
`;
