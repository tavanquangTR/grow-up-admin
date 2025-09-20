import api from "./api_client";

const countUsersAPI = async () => {
    try {
        const response = await api.get('/sum/users');
        return response.data;
    } catch (error) {
        console.error("Error counting users:", error);
        throw error;
    }
};

const countWorkshopsAPI = async () => {
    try {
        const response = await api.get('/sum/workshops');
        return response.data;
    } catch (error) {
        console.error("Error counting workshops:", error);
        throw error;
    }
};

const countSkillsAPI = async () => {
    try {
        const response = await api.get('/sum/skills');
        return response.data;
    } catch (error) {
        console.error("Error counting skills:", error);
        throw error;
    }
};

const fetchAllUser = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

const getUserById = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
};

const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
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