export type TLoadResponse = {
  id: string;
  roundId: number;
  date: string;
  quantity: number;
  loadType: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  classType:string
  round: {
    id: number;
    name: string;
  };
};