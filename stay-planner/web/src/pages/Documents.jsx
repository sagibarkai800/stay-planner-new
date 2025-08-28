import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Title,
  Subtitle,
  Text,
  Button,
  FlexCenter,
  FlexBetween,
  Spacer,
  Toast
} from '../styles/common';
import styled from '@emotion/styled';
import Breadcrumb from '../components/Breadcrumb';
import { Upload, FileText, Download, Trash2, Eye, AlertCircle, CheckCircle, X } from 'lucide-react';
import { api } from '../utils/api';

// Enhanced Documents-specific styled components
const DocumentsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled(Title)`
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: var(--color-text-secondary);
  margin: 0;
  font-size: var(--font-size-lg);
`;

const UploadSection = styled(Card)`
  margin-bottom: 2rem;
  border: 2px dashed var(--color-border);
  background: var(--color-surface-light);
  text-align: center;
  padding: 3rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    border-color: var(--color-primary);
    background: var(--color-surface-hover);
  }
  
  &.dragging {
    border-color: var(--color-primary);
    background: var(--color-surface-hover);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }
  
  &.uploading {
    border-color: var(--color-success);
    background: var(--color-surface-light);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-success));
  width: ${props => props.progress}%;
  transition: width var(--transition-normal);
`;

const ProgressText = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
`;

const FileList = styled.div`
  margin-top: 1rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  margin-bottom: 0.5rem;
  border: 1px solid var(--color-border);
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FileIcon = styled.div`
  font-size: 1.5rem;
`;

const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileName = styled.span`
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
`;

const FileSize = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const FileStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  
  &.success {
    background: var(--color-success);
    color: white;
  }
  
  &.error {
    background: var(--color-error);
    color: white;
  }
  
  &.uploading {
    background: var(--color-primary);
    color: white;
  }
`;

const DocumentsTable = styled(Card)`
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
`;

const TableTitle = styled.h3`
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-xl);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: var(--color-primary);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: var(--color-surface-light);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
`;

const DocumentRow = styled.tr`
  transition: background var(--transition-normal);
  
  &:hover {
    background: var(--color-surface-hover);
  }
`;

const DocumentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DocumentName = styled.div`
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--color-primary);
    width: 16px;
    height: 16px;
  }
`;

const DocumentMeta = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(Button)`
  padding: 0.5rem;
  min-width: auto;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--color-text-secondary);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  margin: 0 0 1rem;
  font-size: var(--font-size-lg);
`;

const EmptySubtext = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  opacity: 0.7;
`;

const ErrorMessage = styled.div`
  background: var(--color-error);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  background: var(--color-success);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type) => {
  if (type.startsWith('image/')) return '🖼️';
  if (type === 'application/pdf') return '📄';
  return '📁';
};

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.docs.list();
      setDocuments(response.documents || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      showToast('Failed to load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'File type not supported. Please upload PDF or image files only.' };
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'File size too large. Maximum size is 5MB.' };
    }
    
    return { valid: true };
  };

  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    // Validate files
    fileArray.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    // Show errors if any
    if (errors.length > 0) {
      showToast(errors.join('\n'), 'error');
    }

    if (validFiles.length === 0) return;

    // Add files to uploading state
    const newUploadingFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload each file
    for (const uploadFile of newUploadingFiles) {
      try {
        await uploadSingleFile(uploadFile);
      } catch (error) {
        console.error('Upload failed:', error);
        updateUploadStatus(uploadFile.id, 'error', error.message);
      }
    }
  };

  const uploadSingleFile = async (uploadFile) => {
    const formData = new FormData();
    formData.append('document', uploadFile.file);

    // Simulate progress (in real app, you'd use XMLHttpRequest or fetch with progress)
    const progressInterval = setInterval(() => {
      setUploadingFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, progress: Math.min(f.progress + Math.random() * 20, 90) }
          : f
      ));
    }, 200);

    try {
      const response = await api.docs.upload(formData);
      
      clearInterval(progressInterval);
      
      // Complete progress
      updateUploadStatus(uploadFile.id, 'success', null, response.document);
      
      // Refresh documents list
      await fetchDocuments();
      
      showToast('File uploaded successfully!', 'success');
      
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  };

  const updateUploadStatus = (id, status, error = null, document = null) => {
    setUploadingFiles(prev => prev.map(f => 
      f.id === id 
        ? { ...f, status, progress: status === 'success' ? 100 : f.progress, error, document }
        : f
    ));

    // Remove from uploading after a delay
    if (status !== 'uploading') {
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.id !== id));
      }, 3000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    handleFileUpload(e.target.files);
    e.target.value = ''; // Reset input
  };

  const handleViewDocument = (document) => {
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/docs/${document.id}`;
    window.open(url, '_blank');
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.docs.delete(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      showToast('Document deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete document:', error);
      showToast('Failed to delete document', 'error');
    }
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
        <PageDescription>
          Store and manage your travel documents securely. Upload PDFs and images up to 5MB.
        </PageDescription>
      </HeaderSection>

      <UploadSection
        className={`${isDragging ? 'dragging' : ''} ${uploadingFiles.length > 0 ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <FileInput
          id="fileInput"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
        />
        
        <UploadIcon>
          <Upload size={48} />
        </UploadIcon>
        
        <UploadText>Drop files here or click to upload</UploadText>
        <UploadSubtext>
          Supports PDF, JPG, and PNG files up to 5MB
        </UploadSubtext>

        {uploadingFiles.length > 0 && (
          <FileList>
            {uploadingFiles.map((uploadFile) => (
              <FileItem key={uploadFile.id}>
                <FileInfo>
                  <FileIcon>{getFileIcon(uploadFile.file.type)}</FileIcon>
                  <FileDetails>
                    <FileName>{uploadFile.file.name}</FileName>
                    <FileSize>{formatFileSize(uploadFile.file.size)}</FileSize>
                  </FileDetails>
                </FileInfo>
                
                <FileStatus>
                  {uploadFile.status === 'uploading' && (
                    <>
                      <ProgressBar>
                        <ProgressFill progress={uploadFile.progress} />
                      </ProgressBar>
                      <ProgressText>{Math.round(uploadFile.progress)}%</ProgressText>
                    </>
                  )}
                  
                  {uploadFile.status === 'success' && (
                    <StatusIcon className="success">
                      <CheckCircle size={16} />
                    </StatusIcon>
                  )}
                  
                  {uploadFile.status === 'error' && (
                    <StatusIcon className="error">
                      <X size={16} />
                    </StatusIcon>
                  )}
                </FileStatus>
              </FileItem>
            ))}
          </FileList>
        )}
      </UploadSection>

      {documents.length > 0 ? (
        <DocumentsTable>
          <TableHeader>
            <TableTitle>
              <FileText />
              Your Documents ({documents.length})
            </TableTitle>
          </TableHeader>
          
          <Table>
            <TableHead>
              <tr>
                <Th>Document</Th>
                <Th>Type</Th>
                <Th>Size</Th>
                <Th>Upload Date</Th>
                <Th>Actions</Th>
              </tr>
            </TableHead>
            <tbody>
              {documents.map((doc) => (
                <DocumentRow key={doc.id}>
                  <Td>
                    <DocumentInfo>
                      <DocumentName>
                        {getFileIcon(doc.mime_type || 'application/pdf')}
                        {doc.filename}
                      </DocumentName>
                      <DocumentMeta>
                        ID: {doc.id}
                      </DocumentMeta>
                    </DocumentInfo>
                  </Td>
                  <Td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      background: 'var(--color-surface-light)', 
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--font-size-sm)'
                    }}>
                      {doc.mime_type || 'application/pdf'}
                    </span>
                  </Td>
                  <Td>{formatFileSize(doc.file_size || 0)}</Td>
                  <Td>
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </Td>
                  <Td>
                    <ActionButtons>
                      <ActionButton variant="secondary" onClick={() => handleViewDocument(doc)}>
                        <Eye />
                      </ActionButton>
                      <ActionButton variant="error" onClick={() => handleDeleteDocument(doc.id)}>
                        <Trash2 />
                      </ActionButton>
                    </ActionButtons>
                  </Td>
                </DocumentRow>
              ))}
            </tbody>
          </Table>
        </DocumentsTable>
      ) : (
        <EmptyState>
          <EmptyIcon>📄</EmptyIcon>
          <EmptyText>No Documents Yet</EmptyText>
          <EmptySubtext>
            Upload your travel documents to keep them organized and accessible!
          </EmptySubtext>
        </EmptyState>
      )}

      {toast && (
        <Toast className={`toast-${toast.type}`}>
          {toast.message}
        </Toast>
      )}
    </DocumentsContainer>
  );
};

export default Documents;
