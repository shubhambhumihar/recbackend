const express = require("express");
const {
  createContact,
  getAllContact,
  getSingleContact,
  deleteSingleContact,
  updateSingleContact,
} = require("../controllers/contactCntrlr");

const router = express.Router();

router.route("/").post(createContact);

router.route("/").get(getAllContact);

router.route("/:id").get(getSingleContact);

router.route("/:id").delete(deleteSingleContact);
router.route("/:id").put(updateSingleContact);

module.exports = router;
