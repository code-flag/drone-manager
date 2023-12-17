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
    imageUrl: string,
    type: string
}

interface ICategory {
    name: string,
    desc: string,
    imageUrl: string,
    type: string
}