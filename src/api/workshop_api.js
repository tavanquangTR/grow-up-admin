import { getNewAccessToken } from "./auth_api";

const URL_BASE = import.meta.env.VITE_URL_BASE;

// ワークショップ一覧取得
const fetchAllWorkshops = async () => {
    const access_token = localStorage.getItem("adminAccessToken");
    console.log('fetchAllWorkshops called');
    console.log('Request URL:', `${URL_BASE}/admin/workshops`);

    try {
        const response = await fetch(`${URL_BASE}/admin/workshops`, {
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
            console.error("Failed to fetch workshops:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return fetchAllWorkshops();
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error fetching workshops:", error);
        throw error;
    }
};

// ワークショップ詳細取得
const getWorkshopById = async (workshopId) => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/workshops/${workshopId}`, {
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
            console.error("Failed to get workshop:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return getWorkshopById(workshopId);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error getting workshop:", error);
        throw error;
    }
};

// ワークショップ新規作成
const createWorkshop = async (workshopData) => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/workshops`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(workshopData)
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to create workshop:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return createWorkshop(workshopData);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error creating workshop:", error);
        throw error;
    }
};

// ワークショップ更新
const updateWorkshop = async (workshopId, workshopData) => {
    const access_token = localStorage.getItem("adminAccessToken");
    console.log('updateWorkshop called with:', { workshopId, workshopData });
    console.log('Request URL:', `${URL_BASE}/admin/workshops/${workshopId}`);

    try {
        const response = await fetch(`${URL_BASE}/admin/workshops/${workshopId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(workshopData)
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorText = await response.text();
            console.error("Failed to update workshop:", response.status, response.statusText, errorText);
            if (response.status === 401) {
                await getNewAccessToken();
                return updateWorkshop(workshopId, workshopData);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }
    } catch (error) {
        console.error("Error updating workshop:", error);
        throw error;
    }
};

// ワークショップ削除
const deleteWorkshop = async (workshopId) => {
    const access_token = localStorage.getItem("adminAccessToken");
    try {
        const response = await fetch(`${URL_BASE}/admin/workshops/${workshopId}`, {
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
            console.error("Failed to delete workshop:", response.status, response.statusText);
            if (response.status === 401) {
                await getNewAccessToken();
                return deleteWorkshop(workshopId);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
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