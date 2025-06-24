const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = async() =>{
   await mongoose.connect(process.env.DATABASE_URI)
    .then(()=> console.log("DB connection succesfull"))
    .catch((error) =>{
        console.log("issue in DB connect");
        console.error(error.message);
        process.exit(1);
    });
}

module.exports = dbConnect;