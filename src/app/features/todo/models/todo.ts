export interface Todo {
  id: string;
  title: string;
  createdAt: string;      // ISO string
  expiration: string;     // ISO string
  isFavorite: boolean;
}
