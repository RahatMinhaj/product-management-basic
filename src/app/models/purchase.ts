export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface Purchase {
  purchaseId: number;
  itemId: number;
  storeId: number;
  quantity: number;
  purchasePrice: number;
}

export interface Sale {
  saleId: number;
  itemId: number;
  storeId: number;
  quantity: number;
  salePrice: number;
}
