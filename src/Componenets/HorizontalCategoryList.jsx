import React, { useEffect, useState } from "react";
import DataService from "../services/requestApi";
// import { useAuth } from "../contexts/AuthConext";
import { useNavigate } from "react-router-dom";

const HorizontalCategoryList = () => {
  //   const {DataByCatogory,selectedCat} =useAuth()
  const [categories, setcategories] = useState([]);
  const [subCatgory, setSubCatgory] = useState([]);
  const [selectedsubcat, setSelectedsubCat] = useState("");
  const selectedStore = localStorage.getItem("selectedStore");
  const parsedStore = selectedStore ? JSON.parse(selectedStore) : null;
  const { saasId, storeId } = parsedStore || {};
  const [selectedmaster, setmasterSelected] = useState("");
  const naviagte = useNavigate();
  const GetCatogroy = async () => {
    try {
      if (!storeId && !saasId) {
        naviagte("/landing");
        return;
      }
      const response = await DataService.GetMasterCategory(saasId, storeId);
      console.log(response);
      setcategories(response.data.data);
      setmasterSelected(response.data.data[0].masterCategoryId);
      //   DataByCatogory(response?.data?.data[0]?.category_id)
    } catch (error) {
      console.log(error);
    }
  };

  const GetSubCatgory = async () => {
    try {
      if (!selectedmaster) {
        return;
      }
      const response = await DataService.GetSubCatrgory(
        saasId,
        storeId,
        selectedmaster
      );
      if (response.data.status) {
        setSubCatgory(response.data.data);
        setSelectedsubCat(response.data.data[0].id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  
//Use Effect Start
  useEffect(() => {
    GetCatogroy();
  }, []);

  useEffect(() => {
    if (selectedmaster) {
      GetSubCatgory();
    }
  }, [selectedmaster]);

  return (
    <>
      {/* <h2 className="text-primary text-3xl font-semibold">
        Popular categories
        </h2> */}
      <div className="w-full mx-auto my-8 overflow-x-auto whitespace-nowrap">
        <div className="inline-flex space-x-4">
          {categories.map((category, index) => (
            <div key={index} className="inline-block text-center w-fit">
              {/* <img
              className="w-24 h-24 object-cover rounded-full mx-auto"
              src={category.image}
              alt={category.name}
            /> */}
              <p
                className="mt-2 text-lg font-semibold cursor-pointer p-3 rounded"
                style={{
                  background:
                    selectedmaster == category.masterCategoryId
                      ? "#003f62"
                      : "",
                  color:
                    selectedmaster == category.masterCategoryId ? "#fff" : "",
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
      <div className="w-full mx-auto my-8 overflow-x-auto whitespace-nowrap">
        <div className="inline-flex space-x-4">
          {subCatgory.map((category, index) => (
            <div key={index} className="inline-block text-center w-fit">
              {/* <img
              className="w-24 h-24 object-cover rounded-full mx-auto"
              src={category.image}
              alt={category.name}
            /> */}
              <p
                className="mt-2 text-lg font-semibold cursor-pointer p-3 rounded"
                style={{
                  background: selectedsubcat == category.id ? "#003f62" : "",
                  color: selectedsubcat == category.id ? "#fff" : "",
                }}
                // onClick={()=>{DataByCatogory(category.category_id)}}
              >
                {category.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HorizontalCategoryList;
