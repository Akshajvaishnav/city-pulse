const API_BASE = '/api';

export const api = {
  // AI Detection
  async detect(formData) {
    const response = await fetch(`${API_BASE}/detect`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Detection failed' }));
      throw new Error(err.detail || 'Failed to analyze image');
    }
    return response.json();
  },

  // Issues
  async getIssues(params = {}) {
    const query = new URLSearchParams();
    if (params.city && params.city !== 'All') query.append('city', params.city);
    if (params.defect_type && params.defect_type !== 'All') query.append('defect_type', params.defect_type);
    if (params.severity && params.severity !== 'All') query.append('severity', params.severity);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.limit) query.append('limit', params.limit);

    const url = `${API_BASE}/issues${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch issues');
    return response.json();
  },

  async getIssue(id) {
    const response = await fetch(`${API_BASE}/issues/${id}`);
    if (!response.ok) throw new Error('Failed to fetch issue details');
    return response.json();
  },

  async createIssue(data) {
    const response = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Failed to create report' }));
      throw new Error(err.detail || 'Failed to submit report');
    }
    return response.json();
  },

  async updateStatus(id, statusData) {
    const response = await fetch(`${API_BASE}/issues/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Failed to update status' }));
      throw new Error(err.detail || 'Failed to update status');
    }
    return response.json();
  },

  async deleteIssue(id) {
    const response = await fetch(`${API_BASE}/issues/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete issue');
    return true;
  },

  async getMapMarkers(city = null) {
    const url = city && city !== 'All' ? `${API_BASE}/issues/map?city=${encodeURIComponent(city)}` : `${API_BASE}/issues/map`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch map markers');
    return response.json();
  },

  // Statistics
  async getStatistics(city = null) {
    const url = city && city !== 'All' ? `${API_BASE}/statistics?city=${encodeURIComponent(city)}` : `${API_BASE}/statistics`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch city statistics');
    return response.json();
  },

  // Future City Readiness & 2070 Scenario
  async getReadiness(scenario = 'current_trend') {
    const response = await fetch(`${API_BASE}/readiness?scenario=${encodeURIComponent(scenario)}`);
    if (!response.ok) throw new Error('Failed to fetch Future City Readiness data');
    return response.json();
  },

  async calculateReadiness(payload) {
    const response = await fetch(`${API_BASE}/readiness/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to calculate custom readiness scenario');
    return response.json();
  },

  // Authentication
  async login(username, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(err.detail || 'Login failed');
    }
    return response.json();
  },
};
