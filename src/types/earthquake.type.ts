export interface EQParams {
   date?: string;
}

export interface EQData {
  id: string;
  type: string;
  properties: RawEQData;
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export interface RawEQData {
  dateTime: string;
  location: string;
  depth: string;
  magnitude: string;
  isLatest?: boolean;
}

export interface EQDetail extends RawEQData {
  origin: string;
  reportedIntensities?: Intensities[];
  instrumentalIntensities?: Intensities[];
  expectingDamage: string;
  expectingAftershocks: string;
  issuedOn: string;
  preparedBy: string;
}

interface Intensities {
   intensity: string;
   locations: string[];
}