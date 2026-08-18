import { Incident, IncidentResponse } from "../../../../../shared/mdt";

export const mockCitizens: IncidentResponse[] = [
    {
        userId: 1,
        name: 'John Doe',
        description: 'Traffic violation',
        age: '35',
        phone: '555-1234',
        personsInvolved: ['John Doe'],
        policeOfficersInvolved: ['Officer Smith'],
        vehiclesInvolved: 'ABC123',
        proofs: 'image1.jpg',
        signature: 'signature1',
        date: new Date('2023-05-10')
    },
    {
        userId: 2,
        name: 'Jane Smith',
        description: 'Public disturbance',
        age: '28',
        phone: '555-5678',
        personsInvolved: ['Jane Smith'],
        policeOfficersInvolved: ['Officer Johnson'],
        vehiclesInvolved: 'XYZ789',
        proofs: 'image2.jpg',
        signature: 'signature2',
        date: new Date('2023-06-22')
    },
    {
        userId: 3,
        name: 'Mike Johnson',
        description: 'Speeding ticket',
        age: '42',
        phone: '555-9012',
        personsInvolved: ['Mike Johnson'],
        policeOfficersInvolved: ['Officer Davis'],
        vehiclesInvolved: 'DEF456',
        proofs: 'image3.jpg',
        signature: 'signature3',
        date: new Date('2023-07-05')
    }
];

export const mockIncidentData: Record<number, Incident[]> = {
    1: [
        {
            userId: 1,
            name: 'John Doe',
            description: 'Traffic violation',
            personsInvolved: ['John Doe'],
            policeOfficersInvolved: ['Officer Smith'],
            vehiclesInvolved: 'ABC123',
            proofs: 'image1.jpg',
            signature: 'signature1',
            date: '2023-05-10'
        },
        {
            userId: 1,
            name: 'John Doe',
            description: 'Parking violation',
            personsInvolved: ['John Doe'],
            policeOfficersInvolved: ['Officer Brown'],
            vehiclesInvolved: 'ABC123',
            proofs: 'image4.jpg',
            signature: 'signature4',
            date: '2023-06-15'
        }
    ],
    2: [
        {
            userId: 2,
            name: 'Jane Smith',
            description: 'Public disturbance',
            personsInvolved: ['Jane Smith'],
            policeOfficersInvolved: ['Officer Johnson'],
            vehiclesInvolved: 'XYZ789',
            proofs: 'image2.jpg',
            signature: 'signature2',
            date: '2023-06-22'
        }
    ],
    3: [
        {
            userId: 3,
            name: 'Mike Johnson',
            description: 'Speeding ticket',
            personsInvolved: ['Mike Johnson'],
            policeOfficersInvolved: ['Officer Davis'],
            vehiclesInvolved: 'DEF456',
            proofs: 'image3.jpg',
            signature: 'signature3',
            date: '2023-07-05'
        }
    ]
};