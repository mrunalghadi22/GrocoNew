const Feedback = require('../models/Feedback');

const submitFeedback = async (req, res) => {
    try {
      
        if (!req.session || !req.session.user) {
            return res.status(401).json({ 
                success: false, 
                message: "Please log in to submit feedback." 
            });
        }

        const userId = req.session.user.id || req.session.user._id;
        const { message } = req.body;

      
        if (!message || message.trim() === "") {
            return res.status(400).json({ 
                success: false, 
                message: "Feedback message cannot be empty." 
            });
        }

        const newFeedback = new Feedback({
            user_id: userId,
            message: message
        });

        await newFeedback.save();

        res.json({ 
            success: true, 
            message: "Thank you! Your feedback has been received." 
        });

    } catch (error) {
        console.error("Feedback Submission Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error. Please try again later." 
        });
    }
};

module.exports = { submitFeedback };