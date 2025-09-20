

const URL_BASE = import.meta.env.VITE_URL_BASE;

// Admin login API
const handleLogin = async (email, password) => {
    const loginData = {
        "email": email,
        "password": password
    };

    try {
        const res = await fetch(`${URL_BASE}/admin/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData),
            credentials: 'include'
        });

        if (!res.ok) {
            let errorMessage = "ログインに失敗しました";
            try {
                const errorData = await res.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // JSON parsing failed, use default message
            }

            if (res.status === 401 || res.status === 403) {
                throw new Error("認証エラー: " + errorMessage);
            }
            throw new Error(errorMessage);
        }

        const data = await res.json();
        const { token, refreshToken } = data.data;

        if (token) {
            // Store admin access token as per API documentation
            localStorage.setItem("adminAccessToken", token);

            // Store refresh token in cookie (for development, using localStorage)
            // In production, this should be httpOnly cookie set by server
            if (refreshToken) {
                localStorage.setItem("adminRefreshToken", refreshToken);
            }

            return { success: true, data: data.data };
        } else {
            throw new Error("トークンが取得できませんでした");
        }

    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

// Admin logout
const logout = () => {
    // Clear admin tokens from localStorage
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");

    // Clear any cookies if using httpOnly cookies in production
    document.cookie = "adminRefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = "/login";
};

// Get new admin access token using refresh token
const getNewAccessToken = async () => {
    try {
        const response = await fetch(`${URL_BASE}/admin/refresh`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            // If refresh fails, redirect to login
            if (response.status === 401 || response.status === 403) {
                logout();
                return null;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const newAccessToken = data.data?.newAccessToken;

        if (newAccessToken) {
            // Update admin access token in localStorage
            localStorage.setItem("adminAccessToken", newAccessToken);
            return newAccessToken;
        } else {
            throw new Error("新しいアクセストークンが取得できませんでした");
        }

    } catch (error) {
        console.error("Token refresh failed:", error);
        // If refresh fails, logout user
        logout();
        return null;
    }
};

// Check if user is authenticated (has valid admin access token)
const isAuthenticated = () => {
    const token = localStorage.getItem("adminAccessToken");
    return !!token;
};

// Get current admin access token
const getAccessToken = () => {
    return localStorage.getItem("adminAccessToken");
};
export { handleLogin, logout, getNewAccessToken, isAuthenticated, getAccessToken };