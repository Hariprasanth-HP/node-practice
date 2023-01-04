const express = require("express");
const path = require("path");
const router = express.Router();
const employeeController = require("../../controller/employeeController");
const verifyJWT = require("../../middleware/verifyJWT");
router
  .route("/")
  .get(verifyJWT, employeeController.getAllEmployees)
  .post(employeeController.createNewEmployee)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);
router.route("/:id").get(employeeController.getEmployee);
module.exports = router;
