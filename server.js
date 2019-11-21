const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = express.Router();
const db = process.env.MONGODB_URL;

// Load Contact model
const ContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: { type: Date, default: Date.now }
  //   published_date: {
  //     type: Date
  //   },
  //   publisher: {
  //     type: String
  //   },
  //   updated_date: {
  //     type: Date,
  //     default: Date.now
  //   }
});
Contact = mongoose.model("contact", ContactSchema);

// routes
// @route GET api/contacts/test
// @description tests contacts route
// @access Public
router.get("/test", (req, res) => res.send("contact route testing!"));

// @route GET api/contacts
// @description Get all contacts
// @access Public
router.get("/", (req, res) => {
  Contact.find()
    .then(contacts => res.json(contacts))
    .catch(err =>
      res.status(404).json({ nocontactsfound: "No contacts found" })
    );
});

// @route GET api/contacts/:id
// @description Get single contact by id
// @access Public
router.get("/:id", (req, res) => {
  Contact.findById(req.params.id)
    .then(contact => res.json(contact))
    .catch(err => res.status(404).json({ nobookfound: "No Contact found" }));
});

// @route GET api/contacts
// @description add/save book
// @access Public
router.post("/", (req, res) => {
  Contact.create(req.body)
    .then(contact => res.json({ msg: "Contact added successfully" }))
    .catch(err =>
      res.status(400).json({ error: "Unable to add this Contact" })
    );
});

// @route GET api/contacts/:id
// @description Update contact
// @access Public
router.put("/:id", (req, res) => {
  Contact.findByIdAndUpdate(req.params.id, req.body)
    .then(contact => res.json({ msg: "Updated successfully" }))
    .catch(err =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

// @route GET api/contacts/:id
// @description Delete contact by id
// @access Public
router.delete("/:id", (req, res) => {
  Contact.findByIdAndRemove(req.params.id, req.body)
    .then(contact => res.json({ mgs: "Contact entry deleted successfully" }))
    .catch(err => res.status(404).json({ error: "No such a contact" }));
});

const app = express();
// CORS set header to allow all complex requests
app.options("*", cors());

// cors origin URL - Allow inbound traffic from origin
corsOptions = {
  origin: "https://portfoliofrontend.herokuapp.com",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
// Connect Database

// add whitelist IP 0.0.0.0/0 in mongo altas

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    console.log("MongoDB is Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

//Connect Database
connectDB();

//  Middleware
app.use(express.json({ extended: false }));
// app.use(morgan("dev"));

// app.get("/", (req, res) => {
//   res.json({ success: true });
// });

app.use("/api/contacts", router);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));
