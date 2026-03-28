export interface Fruit {
  id?: number;
  name: string;
  color: string;
  createdAt: number;
}

export interface FruitPayload {
  name: string;
  color?: string;
}
