// Authentication utility functions

export const auth = {
    // Get stored token
    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },

    // Get stored user
    getUser: () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    },

    // Check if user is logged in
    isAuthenticated: () => {
        return !!auth.getToken();
    },

    // Logout user
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    },

    // Get authorization header
    getAuthHeader: () => {
        const token = auth.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};
