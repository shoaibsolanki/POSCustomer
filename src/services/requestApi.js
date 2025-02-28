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
    return https.get(`price-check/getcart/${saasId}/${storeId}/${id}`);
  }
  AddItemsToCart(item, saasId, storeId, id) {
    return https.post(
      `/price-check/addvegetableproduct/${saasId}/${storeId}/${id}`,
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
      `price-check/deleteproduct/${saasId}/${storeId}/${id}/${itemid}`
    );
  }
  DeleteAllItemsFromCart(saasId, storeId, id) {
    return https.delete(
      `price-check/delete-all-products/${saasId}/${storeId}/${id}`
    );
  }
  UpdateCartitem(qty, saasId, storeId, userid, itemid ){
    return https.put(`price-check/updatevegetableproduct/${qty}/${saasId}/${storeId}/${userid}/${itemid}`)
  }
  OrderHistory(storeId, saasId, id) {
    return https.get(
      `order/view-order-detail-app/${storeId}/${saasId}/${id}`
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
  GetMasterCategoryWithPincode(saasId,storeId,pincode){
    return https.get(`Master-category/get-list-master/${saasId}/${storeId}/${pincode}`)
  }
  GetMasterCategory(saasId,storeId){
    return https.get(`Master-category/get-list-master/${saasId}/${storeId}`)
  }
  
  GetMasterCategoryBySaasId(saasId){
    return https.get(`Master-category/get-list-master/${saasId}`)
  }
  
  GetSubCatrgory(saasId, storeId, MCID){
    return https.get(`Master-category/get-list/${saasId}/${storeId}/${MCID}`)
  }
  GetSubCatrgoryBySaasId(saasId, MCID){
    return https.get(`Master-category/get-list/${saasId}/${MCID}`)
  }

  GetItemByCatogory(saasid, storeId , category_name, page){
    return https.get(`/item/get-category-list/${saasid}/${storeId}/${category_name}/${page}`)
  }
  GetItemByCatogoryBysaasid(saasid, category_name, page){
    return https.get(`/item/get-category-list/${saasid}/${category_name}/${page}`)
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
  GetDowloaPdf(saasid,storeId,orderId){
    return https.get(`order/get-order-details-list/${saasid}/${storeId}/${orderId}`)
  }
  GetStoreByPinCode(pincode){
    return https.get(`/auth/getstoreBypincode/${pincode}`)
  }
  GetOrderDetail(storeId, saasId, orderId){
    return https.get(`/order/view-order-detail-web/${storeId}/${saasId}/${orderId}`)
  }
  GetUomData(saasId, storeId){
    return https.get(`/omni/get-uom/${saasId}/${storeId}`)
  }
  SearchData(storeId, saasId, key){
    return https.get(`/search/get-result/${storeId}/${saasId}/${key}`)
  }
  SearchDataBysaasId( saasId, key){
    return https.get(`/search/get-result/${saasId}/${key}`)
  }
  GetproductData(productId){
    return https.get(`/search/market-place-get-itemByItemId/${productId}`)
  }
}
export default new DataService();
