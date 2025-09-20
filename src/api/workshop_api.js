import api from "./api_client";

const fetchAllWorkshops = async () => {
    try {
        const response = await api.get('/workshops');
        return response.data;
    } catch (error) {
        console.error("Error fetching workshops:", error);
        throw error;
    }
};

const getWorkshopById = async (workshopId) => {
    try {
        const response = await api.get(`/workshops/${workshopId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error getting workshop:", error);
        throw error;
    }
};

const createWorkshop = async (workshopData) => {
    try {
        const response = await api.post('/workshops', workshopData);
        return response.data;
    } catch (error) {
        console.error("Error creating workshop:", error);
        throw error;
    }
};

const updateWorkshop = async (workshopId, workshopData) => {
    try {
        const response = await api.put(`/workshops/${workshopId}`, workshopData);
        return response.data;
    } catch (error) {
        console.error("Error updating workshop:", error);
        throw error;
    }
};

const deleteWorkshop = async (workshopId) => {
    try {
        const response = await api.delete(`/workshops/${workshopId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting workshop:", error);
        throw error;
    }
};

export {
    fetchAllWorkshops,
    getWorkshopById,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop
};