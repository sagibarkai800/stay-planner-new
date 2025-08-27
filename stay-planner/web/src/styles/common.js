import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

// Common Layout Components
export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 3rem;
  border: 2px solid #e5e7eb;
`;

export const LargeCard = styled(Card)`
  padding: 5rem;
  max-width: 72rem;
  width: 100%;
`;

export const MediumCard = styled(Card)`
  padding: 3.5rem;
  max-width: 56rem;
  width: 100%;
`;

// Common Form Components
export const Form = styled.form`
  margin-top: 2rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
`;

export const LargeLabel = styled(Label)`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
`;

export const MediumLabel = styled(Label)`
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  color: #111827;
  background: #f9fafb;
  border: 2px solid #d1d5db;
  border-radius: 0.75rem;
  outline: none;
  transition: all 0.2s;
  
  &::placeholder {
    color: #6b7280;
  }
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

export const LargeInput = styled(Input)`
  padding: 2rem 2.5rem;
  font-size: 1.25rem;
  border-radius: 1rem;
`;

export const MediumInput = styled(Input)`
  padding: 1.5rem 2rem;
  font-size: 1.125rem;
  border-radius: 0.875rem;
`;

export const Button = styled.button`
  padding: 1rem 2rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  background: #2563eb;
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #1d4ed8;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LargeButton = styled(Button)`
  padding: 2rem 2.5rem;
  font-size: 1.25rem;
  border-radius: 1rem;
  width: 100%;
`;

export const MediumButton = styled(Button)`
  padding: 1.5rem 2rem;
  font-size: 1.125rem;
  border-radius: 0.875rem;
  width: 100%;
`;

export const SecondaryButton = styled(Button)`
  background: #6b7280;
  
  &:hover:not(:disabled) {
    background: #4b5563;
  }
`;

// Common Text Components
export const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
`;

export const LargeTitle = styled(Title)`
  font-size: 3.75rem;
  margin-bottom: 1.5rem;
`;

export const MediumTitle = styled(Title)`
  font-size: 2.75rem;
  margin-bottom: 1.25rem;
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 1rem;
`;

export const LargeSubtitle = styled(Subtitle)`
  font-size: 1.5rem;
`;

export const MediumSubtitle = styled(Subtitle)`
  font-size: 1.25rem;
`;

export const Text = styled.p`
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
`;

// Common Icon Components
export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

export const LargeIconContainer = styled(IconContainer)`
  width: 10rem;
  height: 10rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

export const MediumIconContainer = styled(IconContainer)`
  width: 8rem;
  height: 8rem;
  border-radius: 1.25rem;
  box-shadow: 0 15px 20px -3px rgba(0, 0, 0, 0.1);
`;

export const Icon = styled.span`
  font-size: 1.5rem;
  color: white;
`;

export const LargeIcon = styled(Icon)`
  font-size: 3.75rem;
`;

export const MediumIcon = styled(Icon)`
  font-size: 3rem;
`;

// Common Link Components
export const StyledLink = styled(Link)`
  font-weight: 500;
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #1d4ed8;
  }
`;

// Common Status Components
export const ErrorMessage = styled.div`
  background: #fef2f2;
  border-left: 4px solid #ef4444;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

export const SuccessMessage = styled.div`
  background: #f0fdf4;
  border-left: 4px solid #22c55e;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

export const InfoMessage = styled.div`
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
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
  gap: 1.5rem;
`;

export const Grid2 = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export const Grid3 = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

// Common Spacing
export const Spacer = styled.div`
  height: ${props => props.size || '1rem'};
`;

export const HorizontalSpacer = styled.div`
  width: ${props => props.size || '1rem'};
`;
