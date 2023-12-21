"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const favorite_controller_1 = require("../controller/favorite.controller");
const router = (0, express_1.Router)();
router.post("/create", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(favorite_controller_1.addFavorite));
router.get("/user/:userId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(favorite_controller_1.getUserFavoriteProduct));
router.get("/user", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(favorite_controller_1.getUserFavoriteProductsPaginated));
router.delete("/delete/:favoriteId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(favorite_controller_1.deleteFavorite));
exports.default = router;