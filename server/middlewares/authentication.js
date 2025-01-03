const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

const authentication = async (req, res, next) => {
  try {
    //! 1. Melakukan check pada token dengan bearerToken yang diambil dari headers
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      throw { name: "Unauthorized" };
    }

    //! 2. Pisahkan string Bearer dengan token, lalu verifikasi tokennya.
    const token = bearerToken.split(" ")[1];
    const verified = verifyToken(token); 

    //! 3. Mencari user menggunakan userId yang didapatkan di verified.id
    const user = await User.findByPk(verified.id);
    if (!user) {
      throw { name: "Unauthorized" };
    }
    console.log(user);
    
    req.user = {
      id: user.id,
    };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;
