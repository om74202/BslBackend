const bcrypt=require('bcrypt')


const hashPassword = async (password) => {
    try {
      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.log(error);
    }
  };
  
  const comparePassword = async (password, hashedPassword) => {
    try {
      
      // Ensure both arguments are present
      if (!password || !hashedPassword) {
        throw new Error('data and hash arguments required');
      }
  
      // Compare the plain password with the hashed password
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  module.exports={comparePassword,hashPassword}