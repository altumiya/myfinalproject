const ContactEnquiry = require("../../model/contactenquiryModel");

exports.create = async (req, res) => {
    try {
        const { name, email, mobile, subject, message } = req.body;

        const newEnquiry = new ContactEnquiry({
            name,
            email,
            mobile,
            subject,
            message
        });

        await newEnquiry.save();

        res.status(201).json({
            success: true,
            message: "Your message has been sent successfully!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.view = async (req, res) => {
    try {
        const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: enquiries
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        const enquiry = await ContactEnquiry.findById(id);
        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }

        enquiry.status = enquiry.status === 'Active' ? 'Inactive' : 'Active';
        await enquiry.save();

        res.status(200).json({
            success: true,
            message: "Status updated successfully!",
            data: enquiry
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedEnquiry = await ContactEnquiry.findByIdAndDelete(id);
        
        if (!deletedEnquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }

        res.status(200).json({
            success: true,
            message: "Enquiry deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};