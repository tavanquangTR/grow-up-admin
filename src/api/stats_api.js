import api from "./api_client";

/**
 * 管理者ダッシュボード用の統計データAPI
 */

/**
 * ユーザー数を取得
 * @returns {Promise<number>} ユーザーの総数
 */
const fetchUserCount = async () => {
    try {
        const response = await api.get('/sum/users');
        console.log('ユーザー数取得:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching user count:", error);
        throw error;
    }
};

/**
 * ワークショップ数を取得
 * @returns {Promise<number>} ワークショップの総数
 */
const fetchWorkshopCount = async () => {
    try {
        const response = await api.get('/sum/workshops');
        console.log('ワークショップ数取得:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching workshop count:", error);
        throw error;
    }
};

/**
 * スキル数を取得
 * @returns {Promise<number>} スキルの総数
 */
const fetchSkillCount = async () => {
    try {
        const response = await api.get('/sum/skills');
        console.log('スキル数取得:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching skill count:", error);
        throw error;
    }
};

/**
 * 全ての統計データを一括取得
 * @returns {Promise<{userCount: number, workshopCount: number, skillCount: number}>}
 */
const fetchAllStats = async () => {
    try {
        const [userCount, workshopCount, skillCount] = await Promise.all([
            fetchUserCount(),
            fetchWorkshopCount(),
            fetchSkillCount()
        ]);

        return {
            userCount,
            workshopCount,
            skillCount
        };
    } catch (error) {
        console.error("Error fetching all stats:", error);
        throw error;
    }
};

export {
    fetchUserCount,
    fetchWorkshopCount,
    fetchSkillCount,
    fetchAllStats
};