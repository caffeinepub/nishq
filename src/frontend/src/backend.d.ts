import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    tradeOffs: Array<string>;
    name: string;
    description: string;
    productId: string;
    returnReasons: Array<string>;
    sellerId: string;
    price: bigint;
    images: Array<ExternalBlob>;
}
export interface Seller {
    totalOrders: bigint;
    policyViolations: bigint;
    name: string;
    trustScore: bigint;
    historyTimeline: Array<string>;
    accountAgeDays: bigint;
    sellerId: string;
    disputesWon: bigint;
    disputesLost: bigint;
    penalties: bigint;
}
export interface UserProfile {
    name: string;
    purchaseHistory: Array<string>;
}
export interface Review {
    verified: boolean;
    content: string;
    userId: string;
    usageDays: bigint;
    productId: string;
    rating: bigint;
    reviewId: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addReview(review: Review): Promise<void>;
    addSeller(seller: Seller): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getAllReviews(): Promise<Array<Review>>;
    getAllSellers(): Promise<Array<Seller>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(productId: string): Promise<Product | null>;
    getProductReviews(productId: string): Promise<Array<Review>>;
    getSeller(sellerId: string): Promise<Seller | null>;
    getSellerProducts(sellerId: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
