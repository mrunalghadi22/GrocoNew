const User = require("../models/User");
const bcrypt = require("bcrypt");


exports.showLogin = (req, res) => {
    res.render("user/login", {
        title: "Login"
    });
};

exports.showRegister = (req, res) => {
    res.render("user/register", {
        title: "Register"
    });
};




exports.register = async (req, res) => {
    try {
       
        const firstName = req.body['first-name'] ? req.body['first-name'].trim() : '';
        const lastName = req.body['last-name'] ? req.body['last-name'].trim() : '';
        const email = req.body.email ? req.body.email.trim() : '';
        const password = req.body.password;

       
        const nameRegex = /^[A-Za-z]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;

        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
            return res.json({ success: false, message: "Names must contain only letters." });
        }
        if (!emailRegex.test(email)) {
            return res.json({ success: false, message: "Please enter a valid email address." });
        }
        if (!passwordRegex.test(password)) {
            return res.json({ success: false, message: "Password must be at least 6 chars, with 1 uppercase, 1 lowercase, and 1 special character." });
        }

      
        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "This email is already registered." });
        }

        
        const hash = await bcrypt.hash(password, 10);
        

        await User.create({
            first_name: firstName,
            last_name: lastName, 
            email: email,
            password: hash
            
        });

      
        return res.json({ success: true, message: "Registration successful! Redirecting..." });

    } catch (err) {
        console.error(err);
        return res.json({ success: false, message: "Registration failed. Please try again." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Email or Password" });
        }

        
        req.session.user = {
            id: user._id,
            name: user.first_name,
            
            first_name: user.name ? user.name.split(' ')[0] : 'User', 
            email: user.email,
            role: user.role,
        };

        
        return res.json({ success: true, message: "Login successful! Redirecting..." });

    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: `Login failed. Please try again. {err}` });
    }
};


exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send("Logout failed");
        }
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};