"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Users,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  DollarSign,
  UserPlus,
  Settings,
  Wallet,
  CheckCircle,
} from "lucide-react";
import Navigation from "./Navigation";

interface Employee {
  id: string;
  name: string;
  email: string;
  wallet: string;
  position: string;
  salary: number;
  currency: string;
  status: "active" | "inactive";
}

interface Company {
  id: string;
  name: string;
  description: string;
  wallet: string;
  currency: string;
  totalEmployees: number;
  monthlyPayroll: number;
}

export default function PayrollSystem() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showCompanySetup, setShowCompanySetup] = useState(false);

  const [company, setCompany] = useState<Company>({
    id: "1",
    name: "TechCorp Global",
    description: "Global technology company",
    wallet: "0x1234...5678",
    currency: "USDC",
    totalEmployees: 0,
    monthlyPayroll: 0,
  });

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@techcorp.com",
      wallet: "0x1234...5678",
      position: "Senior Developer",
      salary: 5000,
      currency: "USDC",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@techcorp.com",
      wallet: "0x8765...4321",
      position: "Product Manager",
      salary: 6000,
      currency: "USDC",
      status: "active",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@techcorp.com",
      wallet: "0xabcd...efgh",
      position: "DevOps Engineer",
      salary: 4500,
      currency: "USDC",
      status: "active",
    },
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    wallet: "",
    position: "",
    salary: "",
    currency: "USDC",
  });

  const totalPayroll = employees
    .filter((emp) => emp.status === "active")
    .reduce((sum, emp) => sum + emp.salary, 0);

  const addEmployee = () => {
    if (
      newEmployee.name &&
      newEmployee.email &&
      newEmployee.wallet &&
      newEmployee.position &&
      newEmployee.salary
    ) {
      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        email: newEmployee.email,
        wallet: newEmployee.wallet,
        position: newEmployee.position,
        salary: parseFloat(newEmployee.salary),
        currency: newEmployee.currency,
        status: "active",
      };
      setEmployees([...employees, employee]);
      setNewEmployee({
        name: "",
        email: "",
        wallet: "",
        position: "",
        salary: "",
        currency: "USDC",
      });
      setShowAddEmployee(false);
    }
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? { ...emp, status: emp.status === "active" ? "inactive" : "active" }
          : emp
      )
    );
  };

  const updateEmployee = () => {
    if (editingEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id ? editingEmployee : emp
        )
      );
      setEditingEmployee(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="payroll" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Payroll Management System</h2>
          <p className="text-muted-foreground">
            Manage your company payroll, employees, and payments
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === "employees" ? "default" : "outline"}
            onClick={() => setActiveTab("employees")}
          >
            <Users className="h-4 w-4 mr-2" />
            Employees
          </Button>
          <Button
            variant={activeTab === "payroll" ? "default" : "outline"}
            onClick={() => setActiveTab("payroll")}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Payroll
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "outline"}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Company Setup Banner */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        Company Setup Required
                      </h3>
                      <p className="text-sm text-blue-700">
                        Complete your company setup to start managing payroll
                      </p>
                    </div>
                  </div>
                  <Button asChild>
                    <a href="/setup">Setup Company</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">{company.name}</h3>
                    <p className="text-muted-foreground mb-4">
                      {company.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Wallet className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{company.wallet}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                          Primary Currency: {company.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {employees.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Employees
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${totalPayroll.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Monthly Payroll
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">
                        {
                          employees.filter((emp) => emp.status === "active")
                            .length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Employees
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">
                        ${(totalPayroll * 0.001).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Network Fees (0.1%)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-purple-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">Instant</div>
                      <div className="text-sm text-muted-foreground">
                        Settlement Time
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Employee Management</h3>
              <Button onClick={() => setShowAddEmployee(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>

            {/* Add Employee Modal */}
            {showAddEmployee && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Employee</CardTitle>
                  <CardDescription>
                    Enter employee details to add them to the payroll
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        value={newEmployee.name}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            name: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        value={newEmployee.email}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            email: e.target.value,
                          })
                        }
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Wallet Address
                      </label>
                      <Input
                        value={newEmployee.wallet}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            wallet: e.target.value,
                          })
                        }
                        placeholder="0x..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Position</label>
                      <Input
                        value={newEmployee.position}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            position: e.target.value,
                          })
                        }
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Salary</label>
                      <Input
                        type="number"
                        value={newEmployee.salary}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            salary: e.target.value,
                          })
                        }
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Currency</label>
                      <select
                        value={newEmployee.currency}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            currency: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="USDC">USDC</option>
                        <option value="USDT">USDT</option>
                        <option value="DAI">DAI</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={addEmployee}>
                      <Save className="h-4 w-4 mr-2" />
                      Add Employee
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddEmployee(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Employee List */}
            <div className="space-y-4">
              {employees.map((employee) => (
                <Card key={employee.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-lg">
                            {employee.name}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              employee.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <strong>Email:</strong> {employee.email}
                          </div>
                          <div>
                            <strong>Position:</strong> {employee.position}
                          </div>
                          <div>
                            <strong>Wallet:</strong> {employee.wallet}
                          </div>
                          <div>
                            <strong>Salary:</strong> {employee.salary}{" "}
                            {employee.currency}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingEmployee(employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEmployeeStatus(employee.id)}
                        >
                          {employee.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEmployee(employee.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Payroll Tab */}
        {activeTab === "payroll" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary</CardTitle>
                <CardDescription>
                  Review and process employee payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">
                        {
                          employees.filter((emp) => emp.status === "active")
                            .length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Employees
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">
                        ${totalPayroll.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Payroll
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">
                        ${(totalPayroll * 0.001).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Network Fees
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Employee Payments</h4>
                    {employees
                      .filter((emp) => emp.status === "active")
                      .map((employee) => (
                        <div
                          key={employee.id}
                          className="flex justify-between items-center p-4 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {employee.position}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {employee.salary} {employee.currency}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Fee: {(employee.salary * 0.001).toFixed(2)}{" "}
                              {employee.currency}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="flex space-x-4">
                    <Button className="flex-1">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Process Payroll (
                      {
                        employees.filter((emp) => emp.status === "active")
                          .length
                      }{" "}
                      employees)
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Schedule Recurring
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
                <CardDescription>
                  Manage your company information and payroll settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">Company Name</label>
                    <Input value={company.name} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Primary Currency
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={company.currency}
                    >
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                      <option value="DAI">DAI</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">
                      Company Wallet
                    </label>
                    <Input value={company.wallet} readOnly />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
