interface IProduct {
    name: string,
    desc: string,
    baseImage: string,
    categoryId: string,
    basePrice: number,
    discountPrice: number,
    tags: any[],
    salesRegion?: string,
    quantity: number,
}

interface IReviews {
    userId: string,
    productId: string,
    rating: number,
    comment: string
}

interface ITransaction {
    orderId: string,
    userId: string,
    amount: number,
    narration?: string
}

interface ICart {
    productId: string,
    userId: string
}
interface IFavorite {
    productId: string,
    userId: string
}


interface ICategory {
    name: string,
    desc: string,
    type: string,
    parentId?: string,
    parentName?: string
}

interface IOrder {
    userId: string,
    shippingId: string
    productId: string
}

interface IShipping {
    userId: string,
    email: string,
    phone: string,
    address: string
}

interface IContact {
    email: string;
    phone: string;
    subject: string;
    message: string;
    ticketId: string;
}