// client/src/utils/api.js (New file)
import { useAuth0 } from "@auth0/auth0-react";

const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL; // Get from client/.env

  const callApi = async (path, options = {}) => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${backendUrl}${path}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  return { callApi };
};

export default useApi;
