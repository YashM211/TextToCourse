// client/src/utils/api.js
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react"; // <--- ADD THIS IMPORT

const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
  const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  // Wrap callApi with useCallback to memoize it
  const callApi = useCallback(
    async (path, options = {}) => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: auth0Audience,
          },
        });

        const response = await fetch(`${backendUrl}${path}`, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          let errorData = await response
            .json()
            .catch(() => ({ message: "Server error" }));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        return response.json();
      } catch (error) {
        console.error("API call failed:", error);
        throw error;
      }
    },
    [getAccessTokenSilently, backendUrl, auth0Audience]
  ); // <--- DEPENDENCY ARRAY FOR useCallback

  return { callApi };
};

export default useApi;
