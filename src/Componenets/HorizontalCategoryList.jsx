import React, { useEffect, useState } from "react";
import DataService from "../services/requestApi";
// import { useAuth } from "../contexts/AuthConext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { BASEURL } from "../services/http-Pos";
import SearchComponent from "./MicroComponenets/SearchComponent";
import PopularProducts from "./PopularProducts";

const HorizontalCategoryList = () => {
    const {DataByCatogory,getLocation, setPage ,setProducts ,getaddress} =useAuth()
    const navigate = useNavigate()
  const [categories, setcategories] = useState([]);
  const selectedStore = localStorage.getItem("selectedStore");
  const parsedStore = selectedStore ? JSON.parse(selectedStore) : null;
  const { saasId, storeId ,pincodeWisecategory,storeType } = parsedStore || {};
  const [selectedmaster, setmasterSelected] = useState("");
  const [searchedtext, setSearchText] = useState("")
  const naviagte = useNavigate();
  
  const GetCatogroy = async () => {
    try {
      if (!storeId && !saasId) {
        naviagte("/landing");
        return;
      }
      if (pincodeWisecategory && !getaddress.postalCode) {
        await getLocation();
        return;
      }
      var response = []
      if(storeType == "multichanel"){
        response = await  DataService.GetMasterCategoryBySaasId(saasId)
        
      }else{
        if(pincodeWisecategory){
           response = await  DataService.GetMasterCategoryWithPincode(saasId, storeId , getaddress.postalCode)
        }else{
           response = await DataService.GetMasterCategory(saasId, storeId);
        }
      }
      console.log(response);
      setcategories(response.data.data);
      setmasterSelected(response.data.data[0]?.masterCategoryId);
      //   DataByCatogory(response?.data?.data[0]?.category_id)
    } catch (error) {
      console.log(error);
    }
  };
  
//Use Effect Start
  useEffect(() => {
    GetCatogroy();
  }, [getaddress.postalCode]);

   const searchItems = async (searchText) => {
          try {
              if (!searchText) {
                  // DataByCatogory();
                  setSearchText(searchText)
                  return;
              }
              setSearchText(searchText)
              const response =
              storeType == "multichanel"?
              await DataService.SearchDataBysaasId(saasId, searchText):
              await DataService.SearchData(storeId, saasId, searchText);
              if (response.data.status) {
                  // Handle the search results here
                  console.log(response.data.data);
                  setProducts(response.data.data);
                  if (response.data.data.length === 0) {
                      DataByCatogory();
                  }
              }
          } catch (error) {
              console.log(error);
          }
      };
  

  return (
    <>
      {/* <h2 className="text-primary text-3xl font-semibold">
        Popular categories
        </h2> */}
        <SearchComponent placeholder="Search Item By Name"  onSearch={searchItems}/>
      
      {searchedtext ?
      <PopularProducts/>:
      <>
      <div className="w-full mx-auto my-8 overflow-x-auto whitespace-nowrap">
        <div className="w-full mx-auto my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <div onClick={() => {
              setPage(1)
              navigate(`/category/${category.masterCategoryId}`);
              setmasterSelected(category.masterCategoryId);
            }} key={index} className="inline-block items-center text-center">
              <img
              className="w-24 h-24 object-cover rounded-full mx-auto cursor-pointer"
              src={`${BASEURL.ENDPOINT_URL}Master-category/get-master-image/${category.masterCategoryId}`}
              // alt={category.name}
            />
              <p
                className="mt-2 text-lg font-semibold cursor-pointer p-3 rounded text-wrap"
                style={{
                  // background:
                  //   selectedmaster == category.masterCategoryId
                  //     ? "#003f62"
                  //     : "",
                  // color:
                  //   selectedmaster == category.masterCategoryId ?  "#fff" : "black",
                  color:"black"
                }}
                onClick={() => {
                  setmasterSelected(category.masterCategoryId);
                }}
              >
                {category.masterCategoryName}
              </p>
            </div>
          ))}
        </div>
      </div>
      </>
      }
    </>
  );
};

export default HorizontalCategoryList;
