export type TGoodsCategory = {
  id: string;
  name: string;
};

export type TGoodsStock = {
  id: string;
  vataId: string;
  categoryId: string;
  name: string;
  shop: string;
  quantity: number;
  price: number;
  image: string;
  warranty: string | null;
  createdAt: string;
  updatedAt: string;

  category: TGoodsCategory;
  totalIssue: number;
  totalDamage: number;
  totalLost: number;
};

export type TGoodsIssue = {
  id: string;
  name: string;
  location: string;
  quantity: number;
  date: string;
  good: TGoodsStock;
  image: string;
};

// HISTORY
export type TGoodsIssueHistory = {
  id: string;
  type: "ISSUE" | "RETURN" | "LOST" | "DEMAGE";
  quantity: number;
  receiveBy: string;
  returnBy: string;
  damage: number;
  lost: number;
  okay: number;
  image: string;
  date: string;
  createdAt: string;
  good: TGoodsStock;
  description: string;
};

//SINGLE
export type TSingleGoodStock = {
  goodsIssues: TGoodsIssue[];

  goodsLosses: {
    quantity: number;
    good: TGoodsStock;
    lostAmount: number;
  }[];

  goodHistoryLogs: TGoodsIssueHistory[];

  currentStock: number;
} & TGoodsStock;
