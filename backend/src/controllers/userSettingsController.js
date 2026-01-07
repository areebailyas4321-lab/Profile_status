const UserSettings = require('../models/UserSettings');

const getUserSettings = async (req, res) => {
    try {
        const { userId } = req.params;
        let settings = await UserSettings.findOne({ userId });

        if (!settings) {
            return res.status(404).json({ message: 'User settings not found' });
        }

        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUserSettings = async (req, res) => {
    try {
        const { userId, status, theme } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'UserId is required' });
        }

        const startStatus = status || 'Offline';
        const startTheme = theme || 'Light';
        const userExists = await UserSettings.findOne({ userId });
        if (userExists) {
            return res.status(400).json({ message: 'User settings already exist' });
        }

        const settings = await UserSettings.create({
            userId,
            status: startStatus,
            theme: startTheme
        });

        console.log(`[CREATE] User ${userId} created with status: ${startStatus}, theme: ${startTheme}`);

        res.status(201).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateUserSettings = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, theme } = req.body;

        const updatedSettings = await UserSettings.findOneAndUpdate(
            { userId },
            {
                ...(status && { status }),
                ...(theme && { theme })
            },
            { new: true, runValidators: true }
        );

        if (!updatedSettings) {
            return res.status(404).json({ message: 'User settings not found' });
        }

        // Log AFTER successful update
        if (status) {
            console.log(`[UPDATE SUCCESS] User ${userId} status updated to: ${updatedSettings.status}`);
        }
        if (theme) {
            console.log(`[UPDATE SUCCESS] User ${userId} theme updated to: ${updatedSettings.theme}`);
        }
        console.log(`[DB CONFIRM] Document last modified at: ${updatedSettings.updatedAt}`);

        res.status(200).json(updatedSettings);

    } catch (error) {
        console.error(`[UPDATE ERROR] User ${req.params.userId}: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserSettings,
    createUserSettings,
    updateUserSettings
};
