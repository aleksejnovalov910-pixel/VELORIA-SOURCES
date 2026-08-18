import { LicenceType } from "./licence";

export enum MandateType {
  SEARCH = 'Search',
  ARREST = 'Arrest',
  CAUTION = 'Caution'
}

export enum ResponseType  {
  Mandate = 'mandate',
  Incident = 'incident',
  Criminal = 'criminal',
  Car = 'car',
}

export interface IMandate {

  orderTitle: string;  
  orderTime: string;  
  personsInvolved: string[];
  orderType: MandateType;
  address: string;
  description: string;
  proofs: string;
  signature: string;  
}
export interface IMandateResponse extends IMandate {
  id?: number;
  userId: number;
  name: string;
  signature: ResponseType;
  creator?: ICreator;
  date: Date;
}

export interface Incident {
  orderTitle: string;
  orderTime: string;
  personsInvolved: string[];
  policeOfficersInvolved: string[];
  vehiclesInvolved: string;
  description: string;
  proofs: string;
  signature: string;
}

export interface IncidentResponse extends Incident {
  id?: number;
  creator?: ICreator;
  userId: number;
  name: string;
  signature: ResponseType;
  date: Date;
}

export interface ICriminal {
  userId: number;
  description: string;
  proofs: string;
  signature: string;
}
export interface ICriminalResponse extends ICriminal {
  id?: number;
  name: string;
  paid?: boolean;
  creator?: ICreator;
  signature: ResponseType;
  date: Date;
}

export interface ICitizen {
  userId: number;
  name: string;
}

export interface ICitizenDetails extends ICitizen {
  age: number;
  phone: string;
  licenses: { licenceType: LicenceType, date: Date }[];
  criminalRecords: ICriminalResponse[];
  incidents: IncidentResponse[];
  mandates: IMandateResponse[];
}


export interface ICarForm {
  plate: string;
  elements: {[key: string]: boolean};
  proofs: string;
  signature: string;
}

export interface ICarResponse extends ICarForm {
  id?: number;
  model: string;
  name: string;
  owner: ICitizen;
  signature: ResponseType;
  date: Date;
  creator?: ICreator;
}

export interface ICreator {
  userId: number;
  name: string;
  rank: number;
  fractionId?: number;
  // signature?: string;
}



export interface MdtInfo {
  officers: number;
  mandates: number;
  calls: number;

  latest?: LatestData;
}

export interface LatestData {
  criminal: ICriminalResponse[];
  mandates: IMandateResponse[];
  incidents: IncidentResponse[];
}



export type MembersList = {
  id: number;
  name: string;
  serviceLife: string;
  rank: number;
}[]

export type CallList = {
  id: number;
  date: Date;
  name: string;
  description: string;
  location: string;
}[]

