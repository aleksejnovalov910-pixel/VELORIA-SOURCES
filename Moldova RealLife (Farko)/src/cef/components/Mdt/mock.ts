import { MandateType } from "../../../shared/mdt";

export const mockLatest = {
    officers: 0,
    mandates: 0,
    calls: 0,
    latest: {
      criminal: [
        {
          id: 1,
          userId: 1,
          name: "John Doe",
          date: new Date(),
          description: "Description",
          proofs: "Proofs",
          signature: "Signature",
          creator: {
            userId: 1,
            name: "John Doe",
            rank: 1,
            fractionId: 1,
            signature: ""
          },

        },
        {
          id: 2,
          userId: 2,
          name: "Jane Doe",
          date: new Date(),
          description: "Description",
          proofs: "Proofs",
          signature: "Signature",
          creator: {
            userId: 1,
            name: "John Doe",
            rank: 1,
            fractionId: 1,
            signature: ""
          },

        },
        {
          id: 3,
          userId: 3,
          name: "John Doe",
          description: "Description",
          date: new Date(),
          proofs: "Proofs",
          signature: "Signature",
          creator: {
            userId: 1,
            name: "John Doe",
            rank: 1,
            fractionId: 1,
            signature: ""
          },

        }
      ],
      mandates: [
          {
          id: 1,
          userId: 1,
          name: "John Doe",
          orderTitle: "Mandate Title",
          orderTime: "12:00",
          personsInvolved: ["Person 1", "Person 2"],
          orderType: MandateType.ARREST,
          address: "123 Main St",
          description: "Description",
          proofs: "Proofs",
          signature: "Signature",
          date: new Date(),
          creator: {
            userId: 1,
            name: "John Doe",
            rank: 1,
            fractionId: 1,
            signature: ""
          }
        }
      ],
      incidents: [
        {
          userId: 1,
          name: "John Doe",
          orderTime: "12:00",
          personsInvolved: ["Person 1", "Person 2"],
          policeOfficersInvolved: ["Officer 1", "Officer 2"],
          vehiclesInvolved: "Vehicle 1, Vehicle 2",
          description: "Description",
          proofs: "Proofs",
          signature: "Signature",
          date: new Date(),
          creator: {
            userId: 1,
            name: "John Doe",
            rank: 1,
            fractionId: 1,
            signature: ""
          }
        }
      ]
    }

  }