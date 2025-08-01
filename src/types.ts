export interface Person {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  gender?: 'male' | 'female' | 'other';
  x: number;
  y: number;
}

export interface Relationship {
  id: string;
  type: 'parent' | 'spouse' | 'child';
  from: string; // person id
  to: string; // person id
}

export interface FamilyTree {
  people: Person[];
  relationships: Relationship[];
}