import api from "./api_client";

const fetchAllSkills = async () => {
    try {
        const response = await api.get('/skills');
        return response.data;
    } catch (error) {
        console.error("Error fetching skills:", error);
        throw error;
    }
};

const getSkillById = async (skillId) => {
    try {
        const response = await api.get(`/skills/${skillId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error getting skill:", error);
        throw error;
    }
};

const createSkill = async (skillData) => {
    try {
        const response = await api.post('/skills', skillData);
        return response.data;
    } catch (error) {
        console.error("Error creating skill:", error);
        throw error;
    }
};

const updateSkill = async (skillId, skillData) => {
    try {
        const response = await api.put(`/skills/${skillId}`, skillData);
        return response.data;
    } catch (error) {
        console.error("Error updating skill:", error);
        throw error;
    }
};

const deleteSkill = async (skillId) => {
    try {
        const response = await api.delete(`/skills/${skillId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting skill:", error);
        throw error;
    }
};

export {
    fetchAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
};