import axios from "axios";

export const fetchSaving = async (userId) => {
  if (!userId) return [];

  try {
    const res = await axios.get(`http://localhost:8080/savings/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch savings:", err);
    return [];
  }
};
