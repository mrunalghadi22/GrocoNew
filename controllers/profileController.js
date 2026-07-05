const User = require("../models/User");
const Address = require('../models/Address');

const profilePage = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const user = await User.findById(req.session.user.id);

    console.log(user)

    res.render("user/profile", {
      title: "My Profile",
      user:req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};


const getPersonalInfo = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
          }
      
        const user = await User.findById(req.session.user.id);
        res.render("partials/personal_info", {
            user,
        });
    } catch (error) {
        console.error("Error loading personal info partial:", error);
        res.status(500).send("Error loading content");
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.session.user.id;
        
     
        const { 'first-name': firstName, 'last-name': lastName, gender, 'm-number': phn, 'email' :email } = req.body;

        // Find the user and update their document in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                first_name: firstName,
                last_name: lastName,
                gender: gender,
                phone: phn,
                email: email
            },
            { new: true } 
        );

        req.session.user.email = updatedUser.email;
        
        // Send a success message back to the frontend popup
        res.json({ success: true, message: "Your profile has been updated successfully." });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Server error updating profile." });
    }
};



const addAddress = async (req, res) => {
  try {
  
      const newAddress = new Address({
          user_id: req.session.user.id,        
          user_name: req.body['user-name'],
          phn_num: req.body['mob-num'],        
          street_address: req.body.addressline1,
          locality: req.body.locality,
          city: req.body.city,
          state: req.body.state,
          pin_code: req.body.pincode,
          address_type: req.body['address-type']
      });


      await newAddress.save();

      
      res.json({ success: true, message: "Address saved successfully!" });

  } catch (error) {
      console.error("Error saving address:", error);
      res.status(500).json({ success: false, message: "Server error while saving address." });
  }
};

const getAddress = async (req, res) => {
  try {
      if (!req.session.user) {
          return res.redirect("/login");
        }
    
      const userId = req.session.user.id;

      const addresses = await Address.find({ user_id: userId }).sort({ createdAt: -1 });
      res.render("partials/manage_address", {
        addresses,
      });
  } catch (error) {
      console.error("Error loading personal info partial:", error);
      res.status(500).send("Error loading content");
  }
};


const getSingleAddress = async (req, res) => {
  try {
      const addressId = req.params.id;
      const userId = req.session.user.id;

      const address = await Address.findOne({ _id: addressId, user_id: userId });
      
      if (!address) return res.json({ success: false, message: "Address not found." });
      
      res.json({ success: true, address: address });
  } catch (error) {
      console.error("Error fetching single address:", error);
      res.status(500).json({ success: false, message: "Server error." });
  }
};


const updateAddress = async (req, res) => {
  try {
      
      const addressId = req.body.address_id; 
      const userId = req.session.user.id;

      const updatedData = {
          user_name: req.body['user-name'],
          phn_num: req.body['mob-num'],
          street_address: req.body.addressline1,
          locality: req.body.locality,
          city: req.body.city,
          state: req.body.state,
          pin_code: req.body.pincode,
          address_type: req.body['address-type']
      };

      
      await Address.findOneAndUpdate(
          { _id: addressId, user_id: userId }, 
          updatedData
      );

      res.json({ success: true, message: "Address updated!" });
  } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({ success: false, message: "Server error updating address." });
  }
};


const deleteAddress = async (req, res) => {
  try {
  
      const addressId = req.params.id;
      const userId = req.session.user.id;

   
      const deletedAddress = await Address.findOneAndDelete({ 
          _id: addressId, 
          user_id: userId 
      });

      if (!deletedAddress) {
          return res.status(404).json({ success: false, message: "Address not found or unauthorized." });
      }

      res.json({ success: true, message: "Address deleted successfully." });

  } catch (error) {
      console.error("Error deleting address:", error);
      res.status(500).json({ success: false, message: "Server error while deleting address." });
  }
};

module.exports = {
  profilePage,
  getPersonalInfo,
  updateProfile,
  getAddress,
  updateAddress,
  getSingleAddress,
  addAddress,
  deleteAddress,
};