import User from "../models/User.js";
import Patient from "../models/Patient.js";

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


  const addPatient=async(req,res)=>{
    try {
         const {patientName,bloodType,city,hospital,details,phone, gender}=req.body;
         const patientExists = await Patient.findOne({ patientName, bloodType, city, hospital });

         if (patientExists) {
           return res.status(400).json({
             message: "Patient already exists"
           });
         }
    // Create new patient
        const patient = await Patient.create({
            patientName,
            bloodType,
            city,
            hospital,
            details,
            phone, 
            gender
            });

        res.status(201).json({
            message: "Patient added successfully",
            patient
          
          });
        } catch (error) {
          console.error("Error adding patient:", error.message);
          res.status(500).json({
            message: "Internal Server Error"
          });
        }
      };


      const getPatients = async (req, res) => {
        try {
          const { patientName, bloodType, city, hospital, details,phone,gender } = req.query;
      
          // Build dynamic filter
          const filter = {};
      
          if (patientName) filter.patientName = new RegExp(patientName, "i"); // case-insensitive search
          if (city) filter.city = new RegExp(city, "i");
          if (hospital) filter.hospital = new RegExp(hospital, "i");
          if (details) filter.details = new RegExp(details, "i");
          if (bloodType) filter.bloodType = bloodType.trim();
          if (phone) filter.phone = new RegExp(phone, "i"); // partial match allowed
          if (gender) filter.gender = gender.trim(); // exact match (male/female/other)
      
          // Query patients collection
          const patients = await Patient.find(filter);
      
          if (patients.length === 0) {
            return res.status(404).json({
              message: "No patients found"
            });
          }
      
          res.json(patients);
        } catch (error) {
          console.error("Error fetching patients:", error.message);
          res.status(500).json({
            message: "Internal Server Error",
            error: error.message
          });
        }
      };
  
  export { getUsers,addPatient,getPatients };
  