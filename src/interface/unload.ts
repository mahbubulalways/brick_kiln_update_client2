export interface TUnloadItem {
  id: number;
  unloadId: number;
  classId: number;
  quantity: number;
  class: {
    className: string;
    id: number;
    classType: string
  };
}

export interface TUnloadResponse {
  id: number;
  date: string;
  roundId: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  round: {
    id: number;
    name: string;
  };
  items: TUnloadItem[];
}