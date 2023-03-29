const Toilet = require("../models/toilet");
const Address = require("../models/address");
const User = require("../models/user");
const Review = require("../models/review");
const generateToken = require("../models/tokenGenerator");
const tokenChecker = require("../middleware/tokenChecker");

const getAllToilets = async (req, res) => {
  try {
    const toilets = await Toilet.find()
      .sort({ createdAt: -1 })
      .populate([
        { path: "address", model: "Address" },
        { path: "addedBy", model: "User" },
        {
          path: "reviews",
          model: "Review",
          populate: {
            path: "user",
            model: "User",
            select: "name",
          },
        },
      ]);
    const token = await generateToken(req.userId);

    res.status(200).json({ toilets, token });
  } catch (error) {
    res.status(500).json({ error_message: error.message });
  }
};

const addNewToilet = async (req, res) => {
  try {
    const { name, accessible, babyChanging, price, address } = req.body;
    const toilet = await new Toilet({
      name: name,
      accessible: accessible,
      babyChanging: babyChanging,
      price: price,
      addedBy: req.userId,
      address: address,
    });
    // const toilet = await new Toilet(req.body);
    await toilet.save();

    // Generate a new token
    const token = await generateToken(req.userId);
    res.status(201).json({ toilet, token });
  } catch (error) {
    res.status(500).json({ error_message: error.message });
  }
};

module.exports = { getAllToilets, addNewToilet };
