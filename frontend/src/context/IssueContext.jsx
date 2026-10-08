import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const IssueContext = createContext();

export function IssueProvider({ children }) {
  const [issues, setIssues] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [statusUpdateIssue, setStatusUpdateIssue] = useState(null);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchIssues = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const data = await api.getIssues(filters);
      setIssues(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load issues from server', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchStatistics = useCallback(async () => {
    try {
      const stats = await api.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchIssues();
    fetchStatistics();
  }, [fetchIssues, fetchStatistics]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <IssueContext.Provider
      value={{
        issues,
        statistics,
        loading,
        toasts,
        selectedIssueId,
        statusUpdateIssue,
        setSelectedIssueId,
        setStatusUpdateIssue,
        addToast,
        removeToast,
        fetchIssues,
        fetchStatistics,
        refreshAll,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  return useContext(IssueContext);
}
