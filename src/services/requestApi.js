import https from "./http-Pos";

class DataService {
  //Api For Port 8089 / 8088
  Login(data) {
    return https.post("auth/user-login", data);
  }
  Signup(data) {
    return https.post(`customer/create`, data);
  }

  GetAllCateogary(saasId, storeId) {
    return https.get(`category/get-list/${saasId}/${storeId}`);
  }
  GetDataByCatorya(saasId, storeId, category_name, currentPage) {
    return https.get(
      `item/get-category-list/${saasId}/${storeId}/${category_name}/${currentPage}`
    );
  }

  FetchProductApi(storeId, saasId, page) {
    return https.get(`/search/recommended-item/${storeId}/${saasId}/${page}`);
  }
  FetchSingleProduct(id) {
    return https.get(`/item/view-item-detil/${id}`);
  }
  GetCartItems(saasId, storeId, id) {
    return https.get(`/price-check/getcart/${saasId}/${storeId}/${id}`);
  }
  AddItemsToCart(item, saasId, storeId, id) {
    return https.post(
      `/price-check/addproduct/${saasId}/${storeId}/${id}`,
      item
    );
  }

  AddItemsToList(item, saasId, storeId, id) {
    return https.post(
      `/price-check/addproductlist/${saasId}/${storeId}/${id}`,
      item
    );
  }
  DeleteItemsFromCart(saasId, storeId, id, itemid) {
    return https.delete(
      `/price-check/deleteproduct/${saasId}/${storeId}/${id}/${itemid}`
    );
  }
  DeleteAllItemsFromCart(saasId, storeId, id) {
    return https.delete(
      `price-check/delete-all-products/${saasId}/${storeId}/${id}`
    );
  }
  OrderHistory(storeId, saasId, id) {
    return https.get(
      `order/view-order-detail-fastside/${storeId}/${saasId}/${id}`
    );
  }
  CreateOrder(data) {
    return https.post(`/order/create/order/master`, data);
  }
  SaveAddress(data, id) {
    return https.post(`customer/create-address/${id}`, data);
  }
  GetSavedAddress(id, saasId, storeId) {
    return https.get(
      `customer/get-all-customer-address-app/${id}/${saasId}/${storeId}`
    );
  }
  GetCategoryList(saasId){
    return https.get(`/item/category-list/${saasId}`)
  }
  GetItemByCatogory(id, saasid){
    return https.get(`item/view-menu-by-category/${id}/${saasid}`)
  }

  getAddressofStores(){
    return https.get(`/storeMaster/get-store-address`)
  }
  GetStoreByAddress(address){
    return https.get(`/storeMaster/get-store-Bysaasid/${address}`)
  }
  GetCuisne(){
    return https.get(`/storeMaster/get-cuisines`)
  }
  GetStoreByCuisine(address,cuisine_id){
    return https.get(`/storeMaster/get-store-Byaddress/${address}/${cuisine_id}`)
  }
  GetDowloaPdf(orderId,saasid,storeId){
    return https.get(`/order/get-invoice-for-order/${orderId}/${saasid}/${storeId}`)
  }
  GetStoreByPinCode(pincode,type){
    return https.get(`/auth/getstoreBypincodeType/${pincode}/${type}`)
  }
}
export default new DataService();
