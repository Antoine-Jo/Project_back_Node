const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    UserModel.findById(req.params.id, (err, docs) => {
        if(!err) res.send(docs);
        else console.log('ID unknown : ' + err);
    }).select('-password');
};

module.exports.updateUser = async (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    try {
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: {
                    bio: req.body.bio
                }
            },
            {new: true, upsert: true, setDefaultsOnInsert: true},
            (error, docs) => {
                if(!error) return res.send(docs);
                if(error) return res.status(500).send({ message: error });
            }
        )
    } 
    catch (error) {
        return res.status(500).json({ message: error });
    }
};

module.exports.deleteUser = async (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    try {
        await UserModel.deleteOne({ _id: req.params.id}).exec();
        res.status(200).json({ message: "Succesfully deleted. " });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}