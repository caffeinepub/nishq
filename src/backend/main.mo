import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  let sellers = Map.empty<Text, Seller>();
  let products = Map.empty<Text, Product>();
  let reviews = Map.empty<Text, Review>();

  let accessControlState = AccessControl.initState();

  include MixinStorage();
  include MixinAuthorization(accessControlState);

  module Review {
    public func compare(review1 : Review, review2 : Review) : Order.Order {
      if (review1.rating < review2.rating) { #less } else if (review1.rating > review2.rating) {
        #greater;
      } else { Text.compare(review1.reviewId, review2.reviewId) };
    };

    public func compareByUsageDays(review1 : Review, review2 : Review) : Order.Order {
      if (review1.usageDays < review2.usageDays) { #less } else if (review1.usageDays > review2.usageDays) {
        #greater;
      } else { compare(review1, review2) };
    };
  };

  type Seller = {
    sellerId : Text;
    name : Text;
    trustScore : Nat;
    accountAgeDays : Nat;
    totalOrders : Nat;
    disputesWon : Nat;
    disputesLost : Nat;
    policyViolations : Nat;
    penalties : Nat;
    historyTimeline : [Text];
  };

  type Product = {
    productId : Text;
    name : Text;
    price : Nat;
    sellerId : Text;
    description : Text;
    images : [Storage.ExternalBlob];
    returnReasons : [Text];
    tradeOffs : [Text];
  };

  type Review = {
    reviewId : Text;
    productId : Text;
    userId : Text;
    verified : Bool;
    usageDays : Nat;
    rating : Nat;
    content : Text;
  };

  public type UserProfile = {
    name : Text;
    purchaseHistory : [Text];
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addSeller(seller : Seller) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add sellers");
    };
    sellers.add(seller.sellerId, seller);
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.productId, product);
  };

  public shared ({ caller }) func addReview(review : Review) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add reviews");
    };
    reviews.add(review.reviewId, review);
  };

  public query ({ caller }) func getProduct(productId : Text) : async ?Product {
    products.get(productId);
  };

  public query ({ caller }) func getSeller(sellerId : Text) : async ?Seller {
    sellers.get(sellerId);
  };

  public query ({ caller }) func getProductReviews(productId : Text) : async [Review] {
    let productReviews = List.empty<Review>();
    for (review in reviews.values()) {
      if (review.productId == productId) {
        productReviews.add(review);
      };
    };
    productReviews.toArray();
  };

  public query ({ caller }) func getSellerProducts(sellerId : Text) : async [Product] {
    let sellerProducts = List.empty<Product>();
    for (product in products.values()) {
      if (product.sellerId == sellerId) {
        sellerProducts.add(product);
      };
    };
    sellerProducts.toArray();
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getAllSellers() : async [Seller] {
    sellers.values().toArray();
  };

  public query ({ caller }) func getAllReviews() : async [Review] {
    reviews.values().toArray();
  };
};
