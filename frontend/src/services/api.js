import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://insightful-customerfeedback.onrender.com';
const API_URL = `${BASE_URL}/api/feedback`;
const ACTION_ITEMS_URL = `${BASE_URL}/api/action-items`;

export const api = {
    ingestFeedback: async (feedbacks) => {
        return axios.post(`${API_URL}/ingest`, { feedbacks });
    },
    searchFeedback: async (query) => {
        return axios.post(`${API_URL}/search`, { query });
    },
    getThemes: async () => {
        return axios.get(`${API_URL}/themes`);
    },
    getFeedbackStats: async () => {
        return axios.get(`${API_URL}/stats`);
    },
    getRecentFeedback: async () => {
        return axios.get(`${API_URL}/`);
    },
    clearFeedback: async () => {
        return axios.delete(`${API_URL}/clear`);
    },
    generateActionItem: async (feedbackText) => {
        return axios.post(`${API_URL}/action-item`, { feedbackText });
    },
    deleteFeedback: async (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },
    competitiveAnalysis: async (ourFeedback, competitorFeedback) => {
        return axios.post(`${API_URL}/competitive-analysis`, { ourFeedback, competitorFeedback });
    },
    // Action Items
    createActionItem: async (data) => {
        return axios.post(ACTION_ITEMS_URL, data);
    },
    getAllActionItems: async () => {
        return axios.get(ACTION_ITEMS_URL);
    },
    updateActionItemStatus: async (id, status) => {
        return axios.patch(`${ACTION_ITEMS_URL}/${id}`, { status });
    },
    updateActionItemTeam: async (id, teamName) => {
        return axios.patch(`${ACTION_ITEMS_URL}/${id}`, { teamName });
    },
    deleteActionItem: async (id) => {
        return axios.delete(`${ACTION_ITEMS_URL}/${id}`);
    },
    // Submit feedback form
    submitFeedbackForm: async (feedbackType, description, implementedFeature, productName) => {
        return axios.post(`${ACTION_ITEMS_URL}/from-submission`, {
            feedbackType,
            description,
            implementedFeature,
            productName
        });
    },
    // Generate implementation plan
    generateImplementationPlan: async (feedbackType, description) => {
        return axios.post(`${ACTION_ITEMS_URL}/generate-implementation-plan`, {
            feedbackType,
            description
        });
    },
    // Analyze product feedback
    analyzeProduct: async (feedbackText) => {
        return axios.post(`${API_URL}/analyze-product`, { feedbackText });
    },
    analyzeAllFeedback: async () => {
        return axios.get(`${API_URL}/analyze-all`);
    },
    getCommonComplaints: async () => {
        return axios.get(`${API_URL}/common-complaints`);
    },
    getTrendAnalysis: async (productName, days) => {
        const params = {};
        if (productName) params.productName = productName;
        if (days) params.days = days;
        return axios.get(`${API_URL}/trends`, { params });
    }
};
