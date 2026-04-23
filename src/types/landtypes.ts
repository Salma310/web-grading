export interface CreateLandPayload {
  farmer_id: string;
  land_code: string;
  land_name?: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  area_size?: number;
  fruit_type?: string;
}
 
export interface UpdateLandPayload {
  land_name?: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  area_size?: number;
  fruit_type?: string;
  is_active?: boolean;
}