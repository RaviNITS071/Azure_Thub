import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

/**
 * Custom hook to fetch tenders from the backend database.
 * Utilizing React Query handles loading states, error states, and caching automatically.
 * 
 * @param {Object} filters - Optional query parameters (e.g., { status: 'active', type: 'Govt' })
 * @returns {Object} React Query result object containing data, isLoading, isError, etc.
 */
export const useTenders = (filters = {}) => {
  return useQuery({
    // The queryKey is used by React Query to cache and track this specific request.
    // If 'filters' change, React Query will automatically refetch the data.
    queryKey: ['tenders', filters],
    
    // The queryFn contains the actual asynchronous logic to fetch data.
    queryFn: async () => {
      // Execute a GET request to the /tenders endpoint, passing any filters as query parameters
      const response = await api.get('/tenders', { params: filters });
      
      // Return the data payload from the response
      return response.data; 
    },
    
    // staleTime dictates how long the fetched data is considered "fresh".
    // 5 minutes (1000ms * 60s * 5) prevents redundant API calls if the user navigates back and forth quickly.
    staleTime: 1000 * 60 * 5, 
  });
};