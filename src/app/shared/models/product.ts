export interface IProduct {
  id: number,
  productId: string,
  productName: string,
  price: string,
  userEmail: string,
  userName: string,
}

export interface IProductEditOrCreate {
  id: number,
  productId: string,
  productName: string,
  price: number,
}
