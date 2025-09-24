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
  Wallet,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Globe,
  Users,
  Settings,
} from "lucide-react";

interface CompanyData {
  name: string;
  description: string;
  industry: string;
  country: string;
  wallet: string;
  currency: string;
  payrollFrequency: string;
  timezone: string;
}

export default function CompanySetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    description: "",
    industry: "",
    country: "",
    wallet: "",
    currency: "USDC",
    payrollFrequency: "monthly",
    timezone: "UTC",
  });

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const steps = [
    { id: 1, title: "Company Info", description: "Basic company information" },
    {
      id: 2,
      title: "Payment Setup",
      description: "Wallet and currency configuration",
    },
    {
      id: 3,
      title: "Payroll Settings",
      description: "Payroll frequency and preferences",
    },
    {
      id: 4,
      title: "Review & Create",
      description: "Review and finalize setup",
    },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would typically save to database
    console.log("Company setup complete:", companyData);
    setIsSetupComplete(true);
  };

  if (isSetupComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Company Setup Complete!
              </h2>
              <p className="text-muted-foreground">
                Your company "{companyData.name}" has been successfully set up.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Company Name:</span>
                <span>{companyData.name}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Primary Currency:</span>
                <span>{companyData.currency}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Payroll Frequency:</span>
                <span className="capitalize">
                  {companyData.payrollFrequency}
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button asChild className="flex-1">
                <a href="/payroll">Go to Payroll System</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard">View Dashboard</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Company Setup</h1>
          <p className="text-muted-foreground">
            Set up your company for global payroll management
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {/* Step 1: Company Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Company Information
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Tell us about your company to get started with payroll
                    management.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">
                      Company Name *
                    </label>
                    <Input
                      value={companyData.name}
                      onChange={(e) =>
                        setCompanyData({ ...companyData, name: e.target.value })
                      }
                      placeholder="TechCorp Global"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Industry</label>
                    <select
                      value={companyData.industry}
                      onChange={(e) =>
                        setCompanyData({
                          ...companyData,
                          industry: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md mt-1"
                    >
                      <option value="">Select Industry</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Country</label>
                    <select
                      value={companyData.country}
                      onChange={(e) =>
                        setCompanyData({
                          ...companyData,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md mt-1"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="SG">Singapore</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Timezone</label>
                    <select
                      value={companyData.timezone}
                      onChange={(e) =>
                        setCompanyData({
                          ...companyData,
                          timezone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md mt-1"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time (EST)</option>
                      <option value="PST">Pacific Time (PST)</option>
                      <option value="GMT">Greenwich Mean Time (GMT)</option>
                      <option value="CET">Central European Time (CET)</option>
                      <option value="JST">Japan Standard Time (JST)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Company Description
                  </label>
                  <textarea
                    value={companyData.description}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of your company..."
                    className="w-full px-3 py-2 border rounded-md mt-1 h-24 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Payment Setup */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Payment Configuration
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Set up your company wallet and preferred payment currency.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">
                      Company Wallet Address *
                    </label>
                    <Input
                      value={companyData.wallet}
                      onChange={(e) =>
                        setCompanyData({
                          ...companyData,
                          wallet: e.target.value,
                        })
                      }
                      placeholder="0x..."
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This wallet will be used to send payments to employees
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Primary Currency *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      {[
                        {
                          value: "USDC",
                          label: "USDC",
                          description: "USD Coin",
                        },
                        {
                          value: "USDT",
                          label: "USDT",
                          description: "Tether USD",
                        },
                        {
                          value: "DAI",
                          label: "DAI",
                          description: "Dai Stablecoin",
                        },
                      ].map((currency) => (
                        <div
                          key={currency.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            companyData.currency === currency.value
                              ? "border-primary bg-primary/5"
                              : "border-muted hover:border-primary/50"
                          }`}
                          onClick={() =>
                            setCompanyData({
                              ...companyData,
                              currency: currency.value,
                            })
                          }
                        >
                          <div className="font-medium">{currency.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {currency.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Payment Benefits
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Instant global payments</li>
                      <li>• Ultra-low fees (0.1% network fee)</li>
                      <li>• 24/7 availability</li>
                      <li>• Transparent transaction history</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payroll Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Payroll Preferences
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Configure how often you want to process payroll.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">
                      Payroll Frequency *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      {[
                        {
                          value: "weekly",
                          label: "Weekly",
                          description: "Every week",
                        },
                        {
                          value: "biweekly",
                          label: "Bi-weekly",
                          description: "Every 2 weeks",
                        },
                        {
                          value: "monthly",
                          label: "Monthly",
                          description: "Every month",
                        },
                      ].map((frequency) => (
                        <div
                          key={frequency.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            companyData.payrollFrequency === frequency.value
                              ? "border-primary bg-primary/5"
                              : "border-muted hover:border-primary/50"
                          }`}
                          onClick={() =>
                            setCompanyData({
                              ...companyData,
                              payrollFrequency: frequency.value,
                            })
                          }
                        >
                          <div className="font-medium">{frequency.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {frequency.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      Payroll Features
                    </h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Automated payroll processing</li>
                      <li>• Employee self-service portal</li>
                      <li>• Real-time payment tracking</li>
                      <li>• Compliance reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Create */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Review Your Setup
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Please review your company information before creating your
                    account.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Company Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span>{companyData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Industry:
                          </span>
                          <span>{companyData.industry || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Country:
                          </span>
                          <span>{companyData.country || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Timezone:
                          </span>
                          <span>{companyData.timezone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Payment Settings</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Currency:
                          </span>
                          <span>{companyData.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Frequency:
                          </span>
                          <span className="capitalize">
                            {companyData.payrollFrequency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Wallet:</span>
                          <span className="font-mono text-xs">
                            {companyData.wallet || "Not set"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {companyData.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {companyData.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Company
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
