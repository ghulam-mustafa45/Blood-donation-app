const home=async(req,res)=>{
    try {
        res.send("Login Page 🚀");
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }

}

const register=async(req,res)=>{
    try {
        res.send("This is Register Page 🚀");
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }

}

module.exports={
    home,
    register
}