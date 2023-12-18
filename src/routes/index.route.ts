import { Router } from "express";
import User from "./user.route";
import Authentication from "./auth.route";
import Staff from "./staff.route";
import Transaction from "./transaction.route";
import Contact from "./contact.route";
import Dispute from "./dispute.route";
import Category from "./category.route";
import Review from "./review.route";
import Product from "./product.route";
import Cart from "./cart.route";
import Order from "./order.route";
import Favorite from "./favorite.route";
import Statistic from "./statistic.route";
import MFAuth from "./2FAuth.routes";

const router: any = Router();

router.use("/auth", Authentication);
router.use("/mfa", MFAuth);
router.use("/cart", Cart);
router.use("/category", Category);
router.use("/review", Review);
router.use("/order", Order);
router.use("/user", User);
router.use("/register", User);
router.use("/staff", Staff);
router.use("/transaction", Transaction);
router.use("/contact", Contact);
router.use("/favorite", Favorite);
router.use("/statistic", Statistic);
router.use("/product", Product);
router.use("/dispute", Dispute);

export default router;
