export interface HawkerCentre {
  help: string;
  success: boolean;
  result: Result;
}

export interface Result {
  resource_id: string;
  fields: Field[];
  records: Record[];
  _links: Links;
  total: number;
}

export interface Links {
  start: string;
  next: string;
}

export interface Field {
  type: string;
  id: string;
}

export interface Record {
  location_of_centre: string;
  no_of_cooked_food_stalls: string;
  no_of_mkt_produce_stalls: string;
  name_of_centre: string;
  type_of_centre: TypeOfCentre;
  no_of_stalls: string;
  owner: Owner;
  _id: number;
}

export enum Owner {
  Government = "Government",
  Hdb = "HDB",
}

export enum TypeOfCentre {
  Hc = "HC",
  Mhc = "MHC",
  Mk = "MK",
}
