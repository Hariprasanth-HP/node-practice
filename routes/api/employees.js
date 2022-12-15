const express = require("express");
const path = require("path");
const router = express.Router();
const data = {};
data.employees = require("../../data/employees.json");
router
  .route("/")
  .get((req, res) => {
    res.json(data.employees);
  })
  .post((req, res) => {
    res.json({
      name: req.body.name,
      age: req.body.age,
    });
  })
  .put((req, res) => {
    res.json({
      name: req.body.name,
      age: req.body.age,
    });
  })
  .delete((req, res) => {
    res.json({ id: req.body.id });
  });
router.route("/:id").get((req, res) => {
  res.json({
    id: req.params.id,
  });
});
module.exports = router;
