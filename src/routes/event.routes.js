const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleAttendance
} = require("../controllers/event.controller");

const validateRequest = require("../middlewares/validateRequest");
const requireAuth = require("../middlewares/auth.middleware");
const {
  createEventValidator,
  updateEventValidator,
  eventIdValidator
} = require("../validators/event.validators");

router.get("/", getAllEvents);

router.get("/:id", eventIdValidator, validateRequest, getEventById);

router.post("/", createEventValidator, validateRequest, createEvent);

router.put("/:id", updateEventValidator, validateRequest, updateEvent);

router.delete("/:id", eventIdValidator, validateRequest, deleteEvent);

router.post("/:id/attend", requireAuth, toggleAttendance);

module.exports = router;