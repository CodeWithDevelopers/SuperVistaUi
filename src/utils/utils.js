
export const getLoggedInUser = () => {
    try {
        // Prevent SSR issues
        if (typeof window === "undefined") return null;

        const user = localStorage.getItem("user");

        // Prevent parsing invalid values
        if (!user || user === "undefined" || user === "null") {
            return null;
        }

        return JSON.parse(user);
    } catch (error) {
        console.error("Error fetching logged-in user:", error);
        return null;
    }
};


export const getLoggedInUserRole = () => {
    try {
        const user = getLoggedInUser();
        return user?.role || null;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
}

export const getLoggedInUserId = () => {
    try {
        const user = getLoggedInUser();
        return user?.id || null;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
}

export const successResponse = (response) => {
    if (response && response.success && response.code === 200) {
        return true;
    }
    return ;
}

export const formatString = (str) => {
    if (!str) return "";
    return str
        .replace(/[-_]/g, " ")               // replace _ and - with space
        .split(" ")                          // split into words
        .filter(Boolean)                     // remove empty strings
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // capitalize
        .join(" ");                          // join back with space
};
 