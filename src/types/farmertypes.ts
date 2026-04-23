export interface Land {
  id: string;
  land_code: string;
  land_name?: string;
  location?: string;
  area_size?: number;
  fruit_type?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  farmer_id: string;
  createdAt: string;
  updatedAt: string;
}
 
export interface Farmer {
  id: string;
  farmer_code: string;
  name: string;
  phone?: string;
  address?: string;
  village?: string;
  district?: string;
  city?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  lands: Land[];
  batches: Batch[];
}
 
export interface Batch {
  id: string;
  lot_code: string;
  status: string;
  total_fruits: number;
}
 
export interface CreateFarmerPayload {
  farmer_code: string;
  name: string;
  phone?: string;
  address?: string;
  village?: string;
  district?: string;
  city?: string;
}
 
export interface UpdateFarmerPayload {
  name?: string;
  phone?: string;
  address?: string;
  village?: string;
  district?: string;
  city?: string;
  is_active?: boolean;
}