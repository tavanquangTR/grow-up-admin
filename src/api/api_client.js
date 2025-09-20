import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const URL_BASE = import.meta.env.VITE_URL_BASE;

// Create axios instance with base configuration
const api = axios.create({
    baseURL: `${URL_BASE}/admin`,
    withCredentials: true,
    timeout: 10000
});

// Token refresh function
const refreshAccessToken = async () => {
    try {
        const response = await axios.get(`${URL_BASE}/admin/refresh`, {
            withCredentials: true,
            timeout: 5000
        });

        const newAccessToken = response.data.data?.newAccessToken;
        if (newAccessToken) {
            localStorage.setItem("adminAccessToken", newAccessToken);
            return newAccessToken;
        } else {
            throw new Error("新しいアクセストークンが取得できませんでした");
        }
    } catch (error) {
        console.error("Token refresh failed:", error);
        // Only redirect to login if it's specifically an auth-related error
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Clear tokens and redirect to login
            localStorage.removeItem("adminAccessToken");
            localStorage.removeItem("adminRefreshToken");
            Cookies.remove("adminRefreshToken");
            console.log("Redirecting to login due to auth failure");
            window.location.href = "/login";
        }
        throw error;
    }
};

// Request interceptor for automatic token refresh
api.interceptors.request.use(async (config) => {
    let token = localStorage.getItem("adminAccessToken");

    console.log("API Request:", config.method?.toUpperCase(), config.url);
    console.log("Current token:", token ? "Present" : "None");

    if (token) {
        try {
            const decoded = jwtDecode(token);
            const now = Date.now() / 1000;
            console.log("Token expires in:", Math.round(decoded.exp - now), "seconds");

            // Check if token expires within 2 minutes (120 seconds)
            if (decoded.exp - now < 120) {
                console.log("Token will expire soon, refreshing...");
                try {
                    token = await refreshAccessToken();
                    console.log("Token refreshed successfully");
                } catch (error) {
                    console.error("Token refresh failed in interceptor:", error);
                    // Don't reject here - let the request continue and handle auth errors in response interceptor
                    console.log("Continuing with current token despite refresh failure");
                }
            }

            config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
            console.error("Token decode error:", error);
            // If token is invalid, don't try to refresh in request interceptor
            // Let the response interceptor handle it if the server returns 401
            console.log("Token decode failed, will attempt request without refresh");
            config.headers.Authorization = `Bearer ${token}`;
        }
    } else {
        console.log("No token found, proceeding without authorization header");
    }

    return config;
});

// Response interceptor for handling 401 errors
api.interceptors.response.use(
    (response) => {
        console.log("API Response:", response.status, response.config.url);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.log("API Error:", error.response?.status, error.config?.url, error.message);

        // Only attempt token refresh for 401 errors (not 403)
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("401 error detected, attempting token refresh...");
            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed, user will be redirected to login");
                return Promise.reject(refreshError);
            }
        }

        // For 403 and other errors, don't attempt refresh - just return the error
        if (error.response?.status === 403) {
            console.log("403 Forbidden - insufficient permissions, not attempting refresh");
        }

        return Promise.reject(error);
    }
);

// Admin login API
const handleLogin = async (email, password) => {
    const loginData = { email, password };

    console.log("Login attempt:", { email, url: `${URL_BASE}/admin/login` });

    try {
        const response = await axios.post(`${URL_BASE}/admin/login`, loginData, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        console.log("Login response:", response.status, response.data);

        const { token, refreshToken } = response.data.data;

        if (token) {
            // Store admin access token
            localStorage.setItem("adminAccessToken", token);
            console.log("Token stored successfully");

            // Store refresh token in localStorage for development
            // In production, this should be httpOnly cookie set by server
            if (refreshToken) {
                localStorage.setItem("adminRefreshToken", refreshToken);
                console.log("Refresh token stored successfully");
            }

            return { success: true, data: response.data.data };
        } else {
            throw new Error("トークンが取得できませんでした");
        }

    } catch (error) {
        console.error("Login error:", error);
        console.error("Login error response:", error.response?.data);
        console.error("Login error status:", error.response?.status);

        let errorMessage = "ログインに失敗しました";
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.status === 401 || error.response?.status === 403) {
            errorMessage = "認証エラー: メールアドレスまたはパスワードが正しくありません";
        } else if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
            errorMessage = "サーバーに接続できません。サーバーが起動しているか確認してください。";
        } else if (error.message) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
};

// Admin logout
const logout = () => {
    // Clear admin tokens from localStorage
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");

    // Clear any cookies
    Cookies.remove("adminRefreshToken");
    document.cookie = "adminRefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = "/login";
};

// Get new admin access token using refresh token (legacy function for compatibility)
const getNewAccessToken = async () => {
    return await refreshAccessToken();
};

// Check if user is authenticated
const isAuthenticated = () => {
    const token = localStorage.getItem("adminAccessToken");
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        return decoded.exp > now;
    } catch (error) {
        console.error("Token validation error:", error);
        return false;
    }
};

// Get current admin access token
const getAccessToken = () => {
    return localStorage.getItem("adminAccessToken");
};

// Export the configured axios instance for use in other API files
export { api, handleLogin, logout, getNewAccessToken, isAuthenticated, getAccessToken };
export default api;