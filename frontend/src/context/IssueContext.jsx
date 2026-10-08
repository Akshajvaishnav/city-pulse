import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const IssueContext = createContext();

export function IssueProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState('Gurugram'); // Default to Gurugram as primary demo city
  const [issues, setIssues] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
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
      const activeFilters = { ...filters };
      if (selectedCity && selectedCity !== 'All' && !activeFilters.city) {
        activeFilters.city = selectedCity;
      }
      const data = await api.getIssues(activeFilters);
      setIssues(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load issues from server', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedCity, addToast]);

  const fetchStatistics = useCallback(async (city = null) => {
    try {
      const targetCity = city !== null ? city : selectedCity;
      const stats = await api.getStatistics(targetCity);
      setStatistics(stats);
    } catch (err) {
      console.error(err);
    }
  }, [selectedCity]);

  const fetchReadiness = useCallback(async (scenario = 'current_trend') => {
    try {
      const data = await api.getReadiness(scenario);
      setReadinessData(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchIssues();
    fetchStatistics();
    fetchReadiness();
  }, [fetchIssues, fetchStatistics, fetchReadiness]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <IssueContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        issues,
        statistics,
        readinessData,
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
        fetchReadiness,
        setReadinessData,
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
