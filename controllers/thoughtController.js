const { Thought } = require("../models");
const User = require("../models/User");

module.exports = {
  // Get all Thoughts
  getThought(req, res) {
    Thought.find()
    // populate reaction id
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : User.deleteMany({ _id: { $in: thought.User } })
      )
      .then(() => res.json({ message: "thought and users deleted!" }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  addReaction(req, res) {

    Thought.findOneAndUpdate(
      { _id: req.params.thoughtid },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No thought found with that ID : " })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteReaction(req, res) {

    Thought.findOneAndUpdate(
      { _id: req.params.thoughtid },
      { $pull: { reactions: {reactionId:req.params.reactionid} } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No thought found with that ID : " })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
