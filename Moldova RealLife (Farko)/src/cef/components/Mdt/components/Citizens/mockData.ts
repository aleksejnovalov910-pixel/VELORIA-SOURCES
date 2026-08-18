import { ICar, ICitizenDetails } from "../../../../../shared/mdt";


export const mockCitizens: ICitizenDetails[] = [
  {
    userId: 1001,
    name: "John Smith",
    age: 32,
    phone: "555-1234",
    licenses: [{ licenceType: "car", date: new Date() }],
    criminalRecords: [],
    incidents: []
  },
  {
    userId: 1002,
    name: "Emily Johnson",
    age: 28,
    phone: "555-5678",
    licenses: [
      { licenceType: "car", date: new Date() }, 
      { licenceType: "moto", date: new Date() },
      { licenceType: "boat", date: new Date() },
      { licenceType: "truck", date: new Date() },
      { licenceType: "biz", date: new Date() }     
    ],
    criminalRecords: [],
    incidents: []
  },
  {
    userId: 1003,
    name: "Michael Davis",
    age: 41,
    phone: "555-9012",
    licenses: [{ licenceType: "car", date: new Date() }],
    criminalRecords: [],
    incidents: []
  },
  {
    userId: 1004,
    name: "Sarah Wilson",
    age: 35,
    phone: "555-3456",
    licenses: [{ licenceType: "car", date: new Date() }],
    criminalRecords: [],
    incidents: []
  }
];


export const mockCars: ICar[] = [ 
  {
    owner: {
      userId: 1001,
      name: "John Smith"      
    },
    name: "Tesla Model 3",
    plate: "ABC123"
  },
  {
    owner: {
      userId: 1002,
      name: "Emily Johnson"
    },
    name: "Toyota Camry",
    plate: "XYZ789"
  },
  {
    owner: {
      userId: 1003,
      name: "Michael Davis"
    },
    name: "Ford Mustang",
    plate: "DEF456"
  },
  {
    owner: {
      userId: 1004,
      name: "Sarah Wilson"
    },
    name: "Honda Civic",
    plate: "GHI789"
  }
]; 