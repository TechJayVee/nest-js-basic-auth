export class User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  hash: string;
  hashRt: string;
  firstName: string;
  lastName: string;
  role: string[];
}

export class Role {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
}
