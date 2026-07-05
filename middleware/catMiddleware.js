const Category = require('../models/Category'); 

const catMiddleware = async (req, res, next) => {
    try {
      
        const categories = await Category.find({}); 
        
        res.locals.categories = categories; 
        next(); 
    } catch (error) {
        console.error("Error in category middleware:", error);
        res.locals.categories = []; 
        next(); 
    }
};

module.exports = catMiddleware;