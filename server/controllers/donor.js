import User from "../models/User.js";

const getUsers = async (req, res) => {
    try {
      const { city, bloodType } = req.query;
  
      const filter = {};
      const cityFilter = typeof city === 'string' ? city.trim().toLowerCase() : undefined;
      const bloodFilter = typeof bloodType === 'string' ? bloodType.trim().toLowerCase() : undefined;
      if (cityFilter) filter.city = cityFilter;
      if (bloodFilter) filter.bloodType = bloodFilter;
  
      const users = await User.find(filter);
  
      if (users.length === 0) {
        return res.status(404).json({
          message: "No users found"
        });
      }
  
      res.json(users);
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message
      });
    }
  };
  
  export { getUsers };
  