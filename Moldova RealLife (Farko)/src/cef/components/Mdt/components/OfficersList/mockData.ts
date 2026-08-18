import { CallList, MembersList } from "../../../../../shared/mdt";


export const mockOfficersList = (selectedInfo: string): MembersList | CallList => {
    if (selectedInfo === "members") {
      return [
        {
          id: 1,
          name: "John Doe",
          serviceLife: "10 years",
          rank: 1
        },
        {
          id: 2,
          name: "Jane Smith",
          serviceLife: "7 years",
          rank: 2
        }
      ] as MembersList;
    }
  
    if (selectedInfo === "calls") {
      return [
        {
          id: 1,
          name: "John Doe",
          location: "123 Main St, Anytown, USA",
          date: new Date(),
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
          id: 2,
          name: "Jane Smith",
          location: "456 Park Ave, Anytown, USA",
          date: new Date(),
          description: "Emergency call received. Officers dispatched to the scene."
        }
      ] as CallList;
    }
  
    return [] as any;
  }
  
  