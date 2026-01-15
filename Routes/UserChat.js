const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  sendmessage,
  getmessage,
  user,
  getusers,
  share,
} = require("../Controllers/ChatController");
router.post(
  "/sendmessage",
  upload.fields([{ name: "image", maxCount: 1 }]),
  sendmessage
);

router.post("/share", share);

router.get("/getmessage", getmessage);

router.get("/user", user);

router.get("/getusers", getusers);
module.exports = router;
