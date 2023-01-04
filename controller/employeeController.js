const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};
const getAllEmployees = (req, res) => {
  res.json(data.employees);
};
const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    name: req.body.name,
    age: req.body.age,
  };
  if (!newEmployee.name || !newEmployee.age) {
    return res.status(400).json({ message: "name and age required" });
  }
  data.setEmployees([...data.employees, newEmployee]);
  console.log(data.employees);
  res.json(data.employees);
};
const updateEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `employee id ${req.body.id} not found` });
  }
  if (req.body.name) employee.name = req.body.name;
  if (req.body.age) employee.age = req.body.age;

  //   const filteredArray = data.employees.filter(
  //     (emp) => emp.id !== parseInt(req.body.id)
  //   );
  //   const unsortedArray = [...filteredArray, employee];
  //   data.setEmployees(
  //     unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  //   );

  res.json(data.employees);
};
const deleteEmployee = (req, res) => {
  console.log("delete employee", data.employees);
  console.log("REQ employee", parseInt(req.body.id));
  console.log(
    "delete id",
    data.employees.find((emp) => console.log("emp ID", emp.id))
  );

  const employee = data.employees.find(
    (emp) => parseInt(emp.id) === parseInt(req.body.id)
  );
  console.log("delete employee", employee);
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee id ${req.body.id} not found` });
  }

  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
};
const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `cannot get the employee with ID ${req.params.id}` });
  }
  res.json({
    id: req.params.id,
  });
};
module.exports = {
  getAllEmployees,
  deleteEmployee,
  updateEmployee,
  createNewEmployee,
  getEmployee,
};
