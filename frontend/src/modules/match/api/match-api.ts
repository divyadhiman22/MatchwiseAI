import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_MATCH_BASE_URL; 

export const matchResumeAndJD = async (formData: FormData) => {
  const token = localStorage.getItem("token");
  return await axios.post(`${API_BASE_URL}`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};
