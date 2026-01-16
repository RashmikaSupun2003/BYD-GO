export interface EVStation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  price?: string;
  connectorTypes?: string[];
  available?: boolean;
  distance?: number;
  image?: any; // Image source
  connectorCount?: number; // Number of connectors
}

export interface Location {
  latitude: number;
  longitude: number;
}
