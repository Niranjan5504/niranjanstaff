export interface Education {
    degree: string;
    institution: string;
    year: string;
    field: string;
  }
  
  export interface Experience {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }
  
  export interface Research {
    title: string;
    area: string;
    publications: string[];
    description: string;
  }
  
  export interface StaffMember {
    id: string;
    staffId: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    department: string;
    phoneNumber: string;
    imageUrl: string;
    startDate: string;
    status: 'active' | 'inactive';
    education?: Education[];
    experience?: Experience[];
    research?: Research[];
    bio?: string;
  }