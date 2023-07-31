const bcrypt = require('bcrypt')
const User = require("../models/user")

exports.users = async (req, res, next) => {
    try {
        const input = req.body
        const allUsers = await User.find({ role: input.role }).sort('Role')

        return res.status(200).json(allUsers)
    } catch (error) {
        console.log(error)
    }
}

exports.user = async (req, res, next) => {
    try {
        const input = req.body
        const user = await User.findOne({ id: input._id})

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const input = req.body
        const updateUser = await User.findOne({ id: input._id})

        return res.status(200).json(updateUser)
    } catch (error) {
        console.log(error)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const deleteUser = await User.findById(req.body.id);

        return res.status(200).json(deleteUser);
    } catch (error) {
        console.log(error)
    }
};