const companyprofile = require("../../model/companyprofileModel"); // Adjust path to your model

// View Company Profile
exports.view = async (req, res) => {
    try {
        let profile = await companyprofile.findOne();
        
        // Return empty object if no profile is found yet
        if (!profile) {
            return res.status(200).json({});
        }
        
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update Company Profile
exports.update = async (req, res) => {
    try {
        const { 
            name, email, mobile, address, mapUrl, 
            facebook, twitter, linkedin, instagram, youtube 
        } = req.body;

        const updateData = {
            name, email, mobile, address, mapUrl,
            facebook, twitter, linkedin, instagram, youtube
        };

        // If a new image was uploaded, save the path
        if (req.file) {
            updateData.logoUrl = `/uploads/companyprofile/${req.file.filename}`;
        }

        // findOneAndUpdate with an empty filter {} targets the first document it finds.
        // upsert: true ensures it creates the document if it doesn't exist yet.
        let profile = await companyprofile.findOneAndUpdate(
            {}, 
            updateData,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ 
            message: 'Company profile updated successfully!', 
            profile 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};