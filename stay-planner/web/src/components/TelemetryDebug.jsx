import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Download, Trash2, Eye, EyeOff } from 'lucide-react';
import telemetry from '../services/telemetry';

const DebugContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-width: 400px;
  max-height: 500px;
  overflow: hidden;
`;

const DebugHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3);
  background: var(--color-primary);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
`;

const DebugContent = styled.div`
  padding: var(--spacing-3);
  max-height: 400px;
  overflow-y: auto;
`;

const DebugActions = styled.div`
  display: flex;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-light);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
`;

const LogEntry = styled.div`
  padding: var(--spacing-2);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-xs);
  font-family: monospace;
  
  &:last-child {
    border-bottom: none;
  }
`;

const LogTimestamp = styled.span`
  color: var(--color-text-secondary);
  margin-right: var(--spacing-2);
`;

const LogEvent = styled.span`
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
`;

const LogParams = styled.div`
  margin-top: var(--spacing-1);
  color: var(--color-text-secondary);
  font-size: 10px;
`;

const TelemetryDebug = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isDevelopment] = useState(import.meta.env.DEV);

  useEffect(() => {
    if (isVisible) {
      setLogs(telemetry.getLocalLogs());
    }
  }, [isVisible]);

  const handleDownload = () => {
    telemetry.downloadLocalLogs();
  };

  const handleClear = () => {
    telemetry.clearLocalLogs();
    setLogs([]);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isDevelopment) {
    return null;
  }

  return (
    <DebugContainer>
      <DebugHeader>
        <span>📊 Telemetry Debug</span>
        <button
          onClick={toggleVisibility}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </DebugHeader>
      
      {isVisible && (
        <>
          <DebugContent>
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 'var(--spacing-4)' }}>
                No telemetry logs yet
              </div>
            ) : (
              logs.slice(-10).reverse().map((log, index) => (
                <LogEntry key={index}>
                  <div>
                    <LogTimestamp>{new Date(log.timestamp).toLocaleTimeString()}</LogTimestamp>
                    <LogEvent>{log.eventType}</LogEvent>
                  </div>
                  {log.params && Object.keys(log.params).length > 0 && (
                    <LogParams>
                      {JSON.stringify(log.params, null, 2)}
                    </LogParams>
                  )}
                </LogEntry>
              ))
            )}
          </DebugContent>
          
          <DebugActions>
            <ActionButton onClick={handleDownload}>
              <Download size={14} />
              Download
            </ActionButton>
            <ActionButton onClick={handleClear}>
              <Trash2 size={14} />
              Clear
            </ActionButton>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>
              {logs.length} logs
            </div>
          </DebugActions>
        </>
      )}
    </DebugContainer>
  );
};

export default TelemetryDebug;
