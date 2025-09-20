

// Re-export from the new API client for backward compatibility
export {
    handleLogin,
    logout,
    getNewAccessToken,
    isAuthenticated,
    getAccessToken,
    api
} from './api_client.js';