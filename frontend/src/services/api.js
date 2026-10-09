import axios from 'axios';

const RAW_URL = import.meta.env.VITE_API_URL || "https://insightful-customerfeedback.onrender.com";

// Extract ONLY the valid first domain origin and discard any repeated protocols or concatenations
let cleanOrigin = "https://insightful-customerfeedback.onrender.com";
try {
  const match = String(RAW_URL).match(/https?:\/\/[a-zA-Z0-9.-]+\.onrender\.com/);
  if (match) {
    cleanOrigin = match[0];
  }
} catch (e) {
  cleanOrigin = "https://insightful-customerfeedback.onrender.com";
}

export const API_BASE_URL = cleanOrigin;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach helper methods with clean relative endpoints
api.ingestFeedback = async (feedbacks) => api.post('/api/feedback/ingest', { feedbacks });
api.searchFeedback = async (query) => api.post('/api/feedback/search', { query });
api.getThemes = async () => api.get('/api/feedback/themes');
api.getFeedbackStats = async () => api.get('/api/feedback/stats');
api.getRecentFeedback = async () => api.get('/api/feedback/');
api.clearFeedback = async () => api.delete('/api/feedback/clear');
api.generateActionItem = async (feedbackText) => api.post('/api/feedback/action-item', { feedbackText });
api.deleteFeedback = async (id) => api.delete(`/api/feedback/${id}`);
api.competitiveAnalysis = async (ourFeedback, competitorFeedback) => api.post('/api/feedback/competitive-analysis', { ourFeedback, competitorFeedback });

// Action Items
api.createActionItem = async (data) => api.post('/api/action-items', data);
api.getAllActionItems = async () => api.get('/api/action-items');
api.updateActionItemStatus = async (id, status) => api.patch(`/api/action-items/${id}`, { status });
api.updateActionItemTeam = async (id, teamName) => api.patch(`/api/action-items/${id}`, { teamName });
api.deleteActionItem = async (id) => api.delete(`/api/action-items/${id}`);

// Submit feedback form
api.submitFeedbackForm = async (feedbackType, description, implementedFeature, productName) => {
    return api.post('/api/action-items/from-submission', {
        feedbackType,
        description,
        implementedFeature,
        productName
    });
};

// Generate implementation plan
api.generateImplementationPlan = async (feedbackType, description) => {
    return api.post('/api/action-items/generate-implementation-plan', {
        feedbackType,
        description
    });
};

// Analyze product feedback
api.analyzeProduct = async (feedbackText) => api.post('/api/feedback/analyze-product', { feedbackText });
api.analyzeAllFeedback = async () => api.get('/api/feedback/analyze-all');
api.getCommonComplaints = async () => api.get('/api/feedback/common-complaints');
api.getTrendAnalysis = async (productName, days) => {
    const params = {};
    if (productName) params.productName = productName;
    if (days) params.days = days;
    return api.get('/api/feedback/trends', { params });
};

export default api;
