import { getNewAccessToken } from "./auth_api";

const URL_BASE = import.meta.env.VITE_URL_BASE;

const fetchAllSkills = async () => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/skills`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to fetch skills:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return fetchAllSkills();
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error fetching skills:", error);
        throw error;
    }
};

const getSkillById = async (skillId) => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/skills/${skillId}`, {
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
            console.error("Failed to get skill:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return getSkillById(skillId);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error getting skill:", error);
        throw error;
    }
};

const createSkill = async (skillData) => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        // POST endpoint according to API doc
        const response = await fetch(`${URL_BASE}/admin/skills`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(skillData)
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to create skill:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return createSkill(skillData);
            }
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }
    } catch (error) {
        console.error("Error creating skill:", error);
        throw error;
    }
};

const updateSkill = async (skillId, skillData) => {
    const access_token = localStorage.getItem("adminAccessToken");

    try {
        const response = await fetch(`${URL_BASE}/admin/skills/${skillId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(skillData)
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorText = await response.text();
            console.error("Failed to update skill:", response.status, response.statusText, errorText);
            if (response.status === 401) {
                await getNewAccessToken();
                return updateSkill(skillId, skillData);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }
    } catch (error) {
        console.error("Error updating skill:", error);
        throw error;
    }
};

const deleteSkill = async (skillId) => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/skills/${skillId}`, {
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
            console.error("Failed to delete skill:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return deleteSkill(skillId);
            }
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }
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