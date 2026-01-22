import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaUpload, FaFile, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { parseFile, validateData } from '../utils/dataParser';
import { inferSchema } from '../utils/schemaInference';
import { profileData } from '../utils/dataProfiling';

/**
 * Enhanced Data Upload Component
 * Supports CSV, JSON, TXT files with real-time parsing and profiling
 */

const UploadContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const UploadHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;

  h2 {
    font-size: ${props => props.theme.typography.sizes.h2}px;
    font-weight: 600;
    color: ${props => props.theme.colors.text.primary};
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  p {
    font-size: ${props => props.theme.typography.sizes.body}px;
    color: ${props => props.theme.colors.text.secondary};
    margin: 0;
  }
`;

const UploadBox = styled.div`
  border: 2px dashed ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 40px 24px;
  text-align: center;
  transition: all ${props => props.theme.animations.durations.standard}ms ${props => props.theme.animations.easing.easeInOut};
  cursor: pointer;
  background: ${props => props.isDragActive 
    ? props.theme.colors.background.tertiary 
    : props.theme.colors.background.primary};
  border-color: ${props => props.isDragActive 
    ? props.theme.colors.primary.main 
    : props.theme.colors.border.default};

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
    background: ${props => props.theme.colors.background.tertiary};
  }

  ${props => props.isLoading && `
    opacity: 0.7;
    pointer-events: none;
  `}
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  cursor: pointer;

  .file-icon {
    font-size: 48px;
    color: ${props => props.theme.colors.primary.main};
  }

  .label-title {
    font-size: ${props => props.theme.typography.sizes.body}px;
    font-weight: 500;
    color: ${props => props.theme.colors.text.primary};
    margin: 0;
  }

  .label-subtitle {
    font-size: ${props => props.theme.typography.sizes.small}px;
    color: ${props => props.theme.colors.text.secondary};
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.sizes.body}px;
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.animations.durations.standard}ms ${props => props.theme.animations.easing.easeInOut};
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => props.primary ? `
    background: ${props.theme.colors.primary.main};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primary.dark};
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.md};
    }
  ` : `
    background: ${props.theme.colors.background.tertiary};
    color: ${props.theme.colors.text.primary};
    border: 1px solid ${props.theme.colors.border.default};
    
    &:hover:not(:disabled) {
      border-color: ${props.theme.colors.text.secondary};
      background: ${props.theme.colors.background.secondary};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: ${props => props.theme.typography.sizes.body}px;

  ${props => {
    switch (props.status) {
      case 'success':
        return `
          background: ${props.theme.colors.semantic.success.light};
          color: ${props.theme.colors.semantic.success.dark};
          border: 1px solid ${props.theme.colors.semantic.success.main};
        `;
      case 'error':
        return `
          background: ${props.theme.colors.semantic.error.light};
          color: ${props.theme.colors.semantic.error.dark};
          border: 1px solid ${props.theme.colors.semantic.error.main};
        `;
      case 'warning':
        return `
          background: ${props.theme.colors.semantic.warning.light};
          color: ${props.theme.colors.semantic.warning.dark};
          border: 1px solid ${props.theme.colors.semantic.warning.main};
        `;
      case 'loading':
        return `
          background: ${props.theme.colors.semantic.info.light};
          color: ${props.theme.colors.semantic.info.dark};
          border: 1px solid ${props.theme.colors.semantic.info.main};
        `;
      default:
        return '';
    }
  }}

  .icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .icon-spinning {
    animation: spin 1s linear infinite;
  }
`;

const SupportedFormats = styled.div`
  margin-top: 32px;
  padding: 16px;
  background: ${props => props.theme.colors.background.tertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => props.theme.colors.primary.main};

  h4 {
    font-size: ${props => props.theme.typography.sizes.small}px;
    font-weight: 600;
    color: ${props => props.theme.colors.text.primary};
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 8px;

    li {
      font-size: ${props => props.theme.typography.sizes.small}px;
      color: ${props => props.theme.colors.text.secondary};
      
      &::before {
        content: '✓ ';
        color: ${props => props.theme.colors.semantic.success.main};
        font-weight: bold;
        margin-right: 4px;
      }
    }
  }
`;

const DataUpload = ({ onDataLoaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });
  const fileInputRef = useRef(null);

  const supportedFormats = ['.csv', '.json', '.txt', '.tsv'];

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const ext = file.name.toLowerCase().split('.').pop();
    if (!supportedFormats.includes(`.${ext}`)) {
      setMessage({
        type: 'error',
        text: `Unsupported file format: .${ext}. Supported formats: ${supportedFormats.join(', ')}`,
      });
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({
        type: 'error',
        text: `File is too large. Maximum size is 50MB (your file: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
      });
      return;
    }

    setSelectedFile(file);
    setMessage({ type: null, text: '' });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'loading', text: 'Parsing and analyzing file...' });

    try {
      // Parse file
      const parsed = await parseFile(selectedFile);

      // Validate data
      const validation = validateData(parsed);
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Data warnings:', validation.warnings);
      }

      // Infer schema
      setMessage({ type: 'loading', text: 'Inferring schema and detecting data types...' });
      const schema = inferSchema(parsed.headers, parsed.data);

      // Profile data
      setMessage({ type: 'loading', text: 'Profiling data quality...' });
      const profile = profileData(parsed.headers, parsed.data, schema);

      // Success
      setMessage({
        type: 'success',
        text: `✓ Successfully loaded ${parsed.data.length} rows and ${parsed.headers.length} columns`,
      });

      // Call callback with parsed data
      if (onDataLoaded) {
        onDataLoaded({
          parsed,
          schema,
          profile,
        });
      }

      // Reset form
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error: ${error.message}`,
      });
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setMessage({ type: null, text: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <UploadContainer>
      <UploadHeader>
        <h2>
          <FaUpload /> Upload Your Data
        </h2>
        <p>CSV, JSON, TXT, or TSV files</p>
      </UploadHeader>

      <UploadBox
        isDragActive={isDragActive}
        isLoading={isLoading}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <FileInput
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.join(',')}
          onChange={handleFileSelect}
          disabled={isLoading}
        />

        <FileLabel>
          <FaFile className="file-icon" />
          <div>
            <p className="label-title">
              {selectedFile 
                ? `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)` 
                : 'Choose file or drag & drop'}
            </p>
            {!selectedFile && (
              <p className="label-subtitle">
                Supported formats: {supportedFormats.join(', ')}
              </p>
            )}
          </div>
        </FileLabel>
      </UploadBox>

      <ButtonGroup>
        <Button
          primary
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
              Processing...
            </>
          ) : (
            <>
              <FaCheck /> Upload & Analyze
            </>
          )}
        </Button>

        {selectedFile && (
          <Button onClick={handleReset} disabled={isLoading}>
            <FaTimes /> Clear
          </Button>
        )}
      </ButtonGroup>

      {message.type && (
        <StatusMessage status={message.type}>
          <span className={message.type === 'loading' ? 'icon icon-spinning' : 'icon'}>
            {message.type === 'success' && <FaCheck />}
            {message.type === 'error' && <FaTimes />}
            {message.type === 'loading' && <FaSpinner />}
            {message.type === 'warning' && '⚠️'}
          </span>
          <span>{message.text}</span>
        </StatusMessage>
      )}

      <SupportedFormats>
        <h4>Supported Formats</h4>
        <ul>
          <li>CSV (Comma-Separated Values)</li>
          <li>JSON (JavaScript Object Notation)</li>
          <li>TXT (Tab or Line-Separated)</li>
          <li>TSV (Tab-Separated Values)</li>
        </ul>
      </SupportedFormats>
    </UploadContainer>
  );
};

export default DataUpload;
