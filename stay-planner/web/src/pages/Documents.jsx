import React, { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Subtitle,
  Text,
  Button,
  Grid2,
  Grid3,
  FlexCenter,
  FlexBetween,
  IconContainer,
  Icon,
  Spacer,
  SuccessMessage,
  InfoMessage,
  Input,
  Label,
  FormGroup,
  Form
} from '../styles/common';
import styled from '@emotion/styled';
import Breadcrumb from '../components/Breadcrumb';
import { Upload, FileText, Download, Trash2 } from 'lucide-react';

// Documents-specific styled components
const DocumentsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #E8F4FD 0%, #F0E6FF 50%, #E6F7F0 100%);
  padding: 2rem;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

const UploadSection = styled(Card)`
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
`;

const UploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  background: rgba(249, 250, 251, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }
  
  &.dragover {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #6b7280;
`;

const UploadText = styled.div`
  font-size: 1.125rem;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled(Button)`
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border: none;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  box-shadow: 
    0 10px 15px -3px rgba(139, 92, 246, 0.3),
    0 4px 6px -2px rgba(139, 92, 246, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    transform: translateY(-2px);
    box-shadow: 
      0 20px 25px -5px rgba(139, 92, 246, 0.4),
      0 10px 10px -5px rgba(139, 92, 246, 0.3);
  }
`;

const DocumentsGrid = styled(Grid3)`
  margin-bottom: 2rem;
`;

const DocumentCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.15),
      0 20px 20px -10px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #8b5cf6, #3b82f6, #10b981);
  }
`;

const DocumentIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const DocumentName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;
  word-break: break-word;
`;

const DocumentMeta = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const DocumentSize = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const DocumentDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const DocumentActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const DocActionButton = styled(Button)`
  padding: 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  flex: 1;
  min-height: auto;
`;

const ViewButton = styled(DocActionButton)`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }
`;

const DeleteDocButton = styled(DocActionButton)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  
  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const Documents = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Passport.pdf',
      size: '2.4 MB',
      type: 'pdf',
      uploadDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Visa_Application.jpg',
      size: '1.8 MB',
      type: 'image',
      uploadDate: '2024-01-20'
    },
    {
      id: 3,
      name: 'Travel_Insurance.pdf',
      size: '3.1 MB',
      type: 'pdf',
      uploadDate: '2024-01-25'
    }
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading documents
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleFileUpload = (files) => {
    const newDocs = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type.startsWith('image/') ? 'image' : 'pdf',
      uploadDate: new Date().toISOString().split('T')[0]
    }));
    setDocuments([...documents, ...newDocs]);
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const getFileIcon = (type) => {
    return type === 'pdf' ? '📄' : '🖼️';
  };

  if (loading) {
    return (
      <DocumentsContainer>
        <Breadcrumb currentPage="Documents" />
        <Card>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div>Loading documents...</div>
          </div>
        </Card>
      </DocumentsContainer>
    );
  }

  return (
    <DocumentsContainer>
      <Breadcrumb currentPage="Documents" />
      
      <HeaderSection>
        <PageTitle>My Documents 📄</PageTitle>
        <PageSubtitle>
          Store and manage your travel documents securely
        </PageSubtitle>
      </HeaderSection>

      <UploadSection>
        <Title style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          Upload Documents
        </Title>
        <UploadArea
          className={isDragging ? 'dragover' : ''}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileUpload(e.dataTransfer.files);
          }}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <UploadIcon>📤</UploadIcon>
          <UploadText>Drop files here or click to upload</UploadText>
          <UploadSubtext>Supports PDF and JPG files up to 5MB</UploadSubtext>
          <FileInput
            id="fileInput"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <UploadButton type="button">
            📁 Choose Files
          </UploadButton>
        </UploadArea>
      </UploadSection>

      {documents.length > 0 ? (
        <DocumentsGrid>
          {documents.map((doc) => (
            <DocumentCard key={doc.id}>
              <DocumentIcon>{getFileIcon(doc.type)}</DocumentIcon>
              <DocumentName>{doc.name}</DocumentName>
              <DocumentMeta>
                <DocumentSize>{doc.size}</DocumentSize>
                <DocumentDate>{new Date(doc.uploadDate).toLocaleDateString()}</DocumentDate>
              </DocumentMeta>
              <DocumentActions>
                <ViewButton>👁️ View</ViewButton>
                <DeleteDocButton onClick={() => handleDeleteDocument(doc.id)}>
                  🗑️ Delete
                </DeleteDocButton>
              </DocumentActions>
            </DocumentCard>
          ))}
        </DocumentsGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>📄</EmptyIcon>
          <Title style={{ marginBottom: '1rem' }}>No Documents Yet</Title>
          <Text style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Upload your travel documents to keep them organized and accessible!
          </Text>
          <UploadButton onClick={() => document.getElementById('fileInput').click()}>
            📤 Upload Your First Document
          </UploadButton>
        </EmptyState>
      )}
    </DocumentsContainer>
  );
};

export default Documents;
