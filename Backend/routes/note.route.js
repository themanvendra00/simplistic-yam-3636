const express = require("express");
const { NoteModel } = require("../models/note.model");
const { authenticate } = require("../middlewares/authenticate.middleware");

const noteRoute = express.Router();
noteRoute.use(authenticate);

noteRoute.get("/", async (req, res) => {
  const allnotes = await NoteModel.find();
  res.json(allnotes);
});

noteRoute.post("/create", async (req, res) => {
  const data = req.body;
  try {
    const note = new NoteModel(data);
    await note.save();
    res.send({ msg: "Note has been added!" });
  } catch (error) {
    console.log("Error occurred while posting the note data to database");
    console.log(error);
  }
});

noteRoute.patch("/update/:id", async (req, res) => {
  const ID = req.params.id;
  const add_data = req.body;
  const note = await NoteModel.findOne({ _id: ID });
  const userID_in_note = note.userID;
  const userID_making_req = req.body.userID;
  try {
    if (userID_making_req !== userID_in_note) {
      res.send({ msg: "You are not authorized to do this" });
    } else {
      await NoteModel.findByIdAndUpdate({ _id: ID }, add_data);
      res.send({ msg: `Note with id: ${ID} Updated successfully` });
    }
  } catch (error) {
    console.log(`Error occurred while updating the note with id:${ID}`);
    console.log(error);
  }
});

noteRoute.delete("/delete/:id", async (req, res) => {
  const ID = req.params.id;
  try {
    await NoteModel.findByIdAndDelete({ _id: ID });
    res.send({ msg: `Note with id: ${ID} Deleted successfully` });
  } catch (error) {
    console.log(`Error occurred while deleting the note with id:${ID}`);
    console.log(error);
  }
});

module.exports = { noteRoute };
