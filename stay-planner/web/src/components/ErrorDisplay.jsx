import React from 'react';
import styled from '@emotion/styled';
import { AlertCircle, X } from 'lucide-react';

const ErrorContainer = styled.div`
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #fecaca;
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: 
    0 10px 15px -3px rgba(239, 68, 68, 0.1),
    0 4px 6px -2px rgba(239, 68, 68, 0.05);
`;

const ErrorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ErrorIcon = styled(AlertCircle)`
  color: #dc2626;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
`;

const ErrorTitle = styled.h4`
  color: #dc2626;
  font-weight: 600;
  margin: 0;
  font-size: 1rem;
`;

const ErrorList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  color: #991b1b;
`;

const ErrorItem = styled.li`
  margin: 0.25rem 0;
  font-size: 0.875rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  margin-left: auto;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(220, 38, 38, 0.1);
  }
`;

const ErrorDisplay = ({ 
  errors = [], 
  title = "Please fix the following errors:", 
  onClose, 
  showCloseButton = false 
}) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <ErrorContainer>
      <ErrorHeader>
        <ErrorIcon />
        <ErrorTitle>{title}</ErrorTitle>
        {showCloseButton && onClose && (
          <CloseButton onClick={onClose}>
            <X size={16} />
          </CloseButton>
        )}
      </ErrorHeader>
      
      <ErrorList>
        {errors.map((error, index) => (
          <ErrorItem key={index}>{error}</ErrorItem>
        ))}
      </ErrorList>
    </ErrorContainer>
  );
};

export default ErrorDisplay;
