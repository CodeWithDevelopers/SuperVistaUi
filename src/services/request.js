import Cookies from "js-cookie";

// Utility for making API requests
const HTTPRequest = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // should now be "http://localhost:5000"

    const token = Cookies.get("token");
    const DEFAULT_HEADERS = {
        "Content-Type": "application/json",
        ...(token && { "Authorization" :`Bearer ${token}`})   
    };

    // 👉 GET Request
    const GetRequest = async (
        params,
        getURI,
        returnJson = false,
        customHeader = null
    ) => {
        try {
            let queryString = "";
            if (params && typeof params === "object") {
                queryString = "?" + new URLSearchParams(params).toString();
            }

            const response = await fetch(API_BASE_URL + getURI + queryString, {
                method: "GET",
                headers: customHeader || DEFAULT_HEADERS,
            });

            if (!response.ok) throw new Error(`GET failed: ${response.status}`);
            const result = await response.json();

            return returnJson ? result : result.data;
        } catch (err) {
            console.error("GET Error:", err);
            throw err;
        }
    };

    // 👉 PUT Request
    const PUTRequest = async (
        params,
        putData,
        putURI,
        returnJson = false,
        customHeader = DEFAULT_HEADERS
    ) => {
        try {
            let queryString = "";
            if (params) {
                queryString = "?" + new URLSearchParams(params).toString();
            }

            const response = await fetch(API_BASE_URL + putURI + queryString, {
                method: "PUT",
                headers: customHeader,
                body: JSON.stringify(putData),
            });

            if (!response.ok) throw new Error(`PUT failed: ${response.status}`);
            const result = await response.json();

            return returnJson ? result : result.data;
        } catch (err) {
            console.error("PUT Error:", err);
            throw err;
        }
    };

    // 👉 POST Request
    const POSTRequest = async (
        params,
        postData,
        postURI,
        returnJson = false,
        customHeader = DEFAULT_HEADERS
    ) => {
        try {
            let queryString = "";
            if (params) {
                queryString = "?" + new URLSearchParams(params).toString();
            }

            const response = await fetch(API_BASE_URL + postURI + queryString, {
                method: "POST",
                headers: customHeader,
                body: JSON.stringify(postData),
            });

            if (!response.ok) throw new Error(`POST failed: ${response.status}`);
            const result = await response.json();

            return returnJson ? result : result.data;
        } catch (err) {
            console.error("POST Error:", err);
            throw err;
        }
    };

    // 👉 DELETE Request
    const DELETERequest = async (
        params,
        deleteData,
        deleteURI,
        returnJson = false,
        customHeader = DEFAULT_HEADERS
    ) => {
        try {
            let queryString = "";
            if (params) {
                queryString = "?" + new URLSearchParams(params).toString();
            }

            const response = await fetch(API_BASE_URL + deleteURI + queryString, {
                method: "DELETE",
                headers: customHeader,
                body: JSON.stringify(deleteData ?? {}),
            });

            if (!response.ok) throw new Error(`DELETE failed: ${response.status}`);

            const result = await response.json();

            return returnJson ? result : result.data;
        } catch (err) {
            console.error("DELETE Error:", err);
            throw err;
        }
    };

    return {
        getAction: GetRequest,
        putAction: PUTRequest,
        postAction: POSTRequest,
        deleteAction: DELETERequest,
    };
};

export default HTTPRequest;