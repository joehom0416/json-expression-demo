export const sampleData = {
  version: "2.0",
  status: "active",
  createdAt: "2024-04-16T10:30:00Z",
  metadata: {
    settings: {
      enableLogging: true,
      maxRetries: 5,
      timeout: 30000,
    },
  },
  configuration: {
    features: {
      maxFileSize: 50000000,
    },
  },
  statistics: {
    companyGrowthRate: 12.678,
    quarterlyData: [
      { quarter: "Q1", revenue: 3200000, expenses: 2100000, profit: 1100000 },
      { quarter: "Q2", revenue: 4100000, expenses: 2800000, profit: 1300000 },
      { quarter: "Q3", revenue: 3800000, expenses: 2500000, profit: 1300000 },
      { quarter: "Q4", revenue: 5200000, expenses: 3200000, profit: 2000000 },
    ],
  },
  companies: [
    {
      id: "company1",
      name: "Acme Corporation",
      type: "corporation",
      isActive: true,
      revenue: 15000000.5,
      description: "  Leading technology company  ",
      email: "info@acme.com",
      locations: [
        { city: "New York", country: "US" },
        { city: "London", country: "UK" },
      ],
    },
    {
      id: "company2",
      name: "Tech Solutions Ltd",
      type: "limited",
      isActive: true,
      revenue: 8500000,
      description: null,
      email: "hello@techsolutions.com",
      locations: [{ city: "Berlin", country: "DE" }],
    },
    {
      id: "company3",
      name: "Global Innovations Corp",
      type: "corporation",
      isActive: false,
      revenue: 22000000,
      description: "Global reach, local touch",
      email: "contact@globalinno.com",
      locations: [{ city: "Singapore", country: "SG" }],
    },
  ],
  employees: [
    {
      id: "emp1",
      name: "John Doe",
      department: "Engineering",
      salary: 120000,
      isRemote: false,
      companyId: "company1",
    },
    {
      id: "emp2",
      name: "Jane Smith",
      department: "Sales",
      salary: 95000,
      isRemote: true,
      companyId: "company2",
    },
    {
      id: "emp3",
      name: "Bob Johnson",
      department: "Engineering",
      salary: 135000,
      isRemote: true,
      companyId: "company1",
    },
  ],
};
