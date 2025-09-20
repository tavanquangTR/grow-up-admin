import React, { createContext, useState } from 'react';

// Contextオブジェクトを作成
export const ThemeContext = createContext();

// プロバイダーコンポーネントを作成
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true); // デフォルトをダークモードに

    return (
        <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;