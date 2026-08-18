import { ICriminal, ICitizen, ICriminalResponse } from "../../../../../shared/mdt";

export const mockCitizens: ICitizen[] = [
  { userId: 1, name: 'John Doe' },
  { userId: 2, name: 'Jane Smith' },
  { userId: 3, name: 'Mike Johnson' },
  { userId: 4, name: 'Sarah Williams' },
  { userId: 5, name: 'David Brown' }
];


export const mockCriminals: ICriminalResponse[] = [
  {
    userId: 1,
    name: 'John Doe',
    description: 'Theft',
    proofs: 'Proofs',
    signature: 'Signature',
    paid: true,
    date: new Date()
  },
  {
    userId: 2,
    name: 'Jane Smith',
    description: 'Fraud',
    proofs: 'Proofs',
    signature: 'Signature',
    paid: false,
    date: new Date()
  },
  {
    userId: 3,
    name: 'Mike Johnson',
    description: 'Vandalism',
    proofs: 'Proofs',
    signature: 'Signature',
    paid: false,
    date: new Date()
  }
 
]; 