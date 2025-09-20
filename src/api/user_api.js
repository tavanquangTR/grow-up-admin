import { getNewAccessToken } from "./auth_api";

const URL_BASE = import.meta.env.VITE_URL_BASE;

const countUsersAPI = async () => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/sum/users`, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to count users:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return countUsersAPI();
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error counting users:", error);
        throw error;
    }
};

const countWorkshopsAPI = async () => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/sum/workshops`, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to count workshops:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return countWorkshopsAPI();
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error counting workshops:", error);
        throw error;
    }
};

const countSkillsAPI = async () => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/sum/skills`, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to count skills:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return countSkillsAPI();
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error counting skills:", error);
        throw error;
    }
};

const fetchAllUser = async () => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/users`, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to fetch users:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return fetchAllUser();
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

const getUserById = async (userId) => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/users/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.data;
        } else {
            console.error("Failed to get user:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return getUserById(userId);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
};

const createUser = async (userData) => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/users`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to create user:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return createUser(userData);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

const updateUser = async (userId, userData) => {
    const access_token = localStorage.getItem("adminAccessToken");
    console.log('updateUser called with:', { userId, userData });
    console.log('Request URL:', `${URL_BASE}/admin/users/${userId}`);

    try {
        const response = await fetch(`${URL_BASE}/admin/users/${userId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorText = await response.text();
            console.error("Failed to update user:", response.status, response.statusText, errorText);
            if (response.status === 401) {
                await getNewAccessToken();
                return updateUser(userId, userData);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

const deleteUser = async (userId) => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/users/${userId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to delete user:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return deleteUser(userId);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export {
    countUsersAPI,
    countWorkshopsAPI,
    countSkillsAPI,
    fetchAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};