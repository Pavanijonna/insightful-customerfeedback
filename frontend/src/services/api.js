import axios from 'axios';

const getCleanBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'https://insightful-customerfeedback.onrender.com';
    if (typeof url === 'string') {
        url = url.replace(/https\/\//g, 'https://');
        const match = url.match(/(https?:\/\/[^\/]+)/i);
        if (match) {
            url = match[1];
        }
    }
    return url.replace(/\/$/, "");
};

const API_BASE_URL = getCleanBaseUrl();

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const api = {
    ingestFeedback: async (feedbacks) => {
        return apiClient.post('/api/feedback/ingest', { feedbacks });
    },
    searchFeedback: async (query) => {
        return apiClient.post('/api/feedback/search', { query });
    },
    getThemes: async () => {
        return apiClient.get('/api/feedback/themes');
    },
    getFeedbackStats: async () => {
        return apiClient.get('/api/feedback/stats');
    },
    getRecentFeedback: async () => {
        return apiClient.get('/api/feedback/');
    },
    clearFeedback: async () => {
        return apiClient.delete('/api/feedback/clear');
    },
    generateActionItem: async (feedbackText) => {
        return apiClient.post('/api/feedback/action-item', { feedbackText });
    },
    deleteFeedback: async (id) => {
        return apiClient.delete(`/api/feedback/${id}`);
    },
    competitiveAnalysis: async (ourFeedback, competitorFeedback) => {
        return apiClient.post('/api/feedback/competitive-analysis', { ourFeedback, competitorFeedback });
    },
    // Action Items
    createActionItem: async (data) => {
        return apiClient.post('/api/action-items', data);
    },
    getAllActionItems: async () => {
        return apiClient.get('/api/action-items');
    },
    updateActionItemStatus: async (id, status) => {
        return apiClient.patch(`/api/action-items/${id}`, { status });
    },
    updateActionItemTeam: async (id, teamName) => {
        return apiClient.patch(`/api/action-items/${id}`, { teamName });
    },
    deleteActionItem: async (id) => {
        return apiClient.delete(`/api/action-items/${id}`);
    },
    // Submit feedback form
    submitFeedbackForm: async (feedbackType, description, implementedFeature, productName) => {
        return apiClient.post('/api/action-items/from-submission', {
            feedbackType,
            description,
            implementedFeature,
            productName
        });
    },
    // Generate implementation plan
    generateImplementationPlan: async (feedbackType, description) => {
        return apiClient.post('/api/action-items/generate-implementation-plan', {
            feedbackType,
            description
        });
    },
    // Analyze product feedback
    analyzeProduct: async (feedbackText) => {
        return apiClient.post('/api/feedback/analyze-product', { feedbackText });
    },
    analyzeAllFeedback: async () => {
        return apiClient.get('/api/feedback/analyze-all');
    },
    getCommonComplaints: async () => {
        return apiClient.get('/api/feedback/common-complaints');
    },
    getTrendAnalysis: async (productName, days) => {
        const params = {};
        if (productName) params.productName = productName;
        if (days) params.days = days;
        return apiClient.get('/api/feedback/trends', { params });
    }
};

