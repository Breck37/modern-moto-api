import connectToDatabase from './utils/connectToDatabase';

module.exports = async (req, res) => {
    res.status(200).json({ success: true });
}