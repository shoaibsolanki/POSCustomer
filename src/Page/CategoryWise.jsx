import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import DataService from '../services/requestApi'
import { BASEURL } from '../services/http-Pos';
import PopularProducts from '../Componenets/PopularProducts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchComponent from '../Componenets/MicroComponenets/SearchComponent';
const CategoryWise = () => {
    const { categoryId } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const navigate = useNavigate();
     const [subCatgory, setSubCatgory] = useState([]);
     const selectedStore = localStorage.getItem("selectedStore");
     const parsedStore = selectedStore ? JSON.parse(selectedStore) : null;
     const { saasId, storeId } = parsedStore || {};
     const {DataByCatogory,selectedsubcat,setSelectedsubCat , setPage ,setProducts} =useAuth()
    const GetSubCatgory = async () => {
        try {
          if (!categoryId) {
            return;
          }
          const response = await DataService.GetSubCatrgory(
            saasId,
            storeId,
            categoryId
          );
          if (response.data.status) {
            setSubCatgory(response.data.data);
            setSelectedsubCat(response.data.data[0].category);
          }
        } catch (error) {
          console.log(error);
        }
      };
    useEffect(() => {
        // Fetch category data based on categoryId
        GetSubCatgory()
    }, [categoryId]);

     useEffect(() => {
        if(selectedsubcat){
            DataByCatogory(1)
        }
      }, [selectedsubcat])

    // if (!subCatgory) {
    //     return <div>Loading...</div>;
    // }

    const searchItems = async (searchText) => {
        try {
            if (!searchText) {
                DataByCatogory();
                return;
            }
            const response = await DataService.SearchData(storeId, saasId, searchText);
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
            <div className='flex m-5'>
                <ArrowBackIcon style={{ fontSize: "40px" }} className='text-green-600 cursor-pointer' onClick={() => navigate(-1)} />
                   
            </div>
            {subCatgory.length > 0 ? (
                <div className="w-full mx-auto my-8 overflow-x-auto whitespace-nowrap">
                    <div className="inline-flex space-x-4">
                        {subCatgory.map((category, index) => (
                            <div onClick={() => { setSelectedsubCat(category.category); setPage(1) }} key={index} className="inline-block text-center w-fit">
                                <img
                                    className="w-24 h-24 object-cover rounded-full mx-auto cursor-pointer"
                                    src={`${BASEURL.ENDPOINT_URL}category/get-category-image/${category.id}`}
                                />
                                <p
                                    className="mt-2 text-lg font-semibold cursor-pointer p-3 rounded"
                                    style={{
                                        background: selectedsubcat === category.category ? "#003f62" : "",
                                        color: selectedsubcat === category.category ? "#fff" : "black",
                                    }}
                                    onClick={() => { setSelectedsubCat(category.category); setPage(1) }}
                                >
                                    {category.category}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center text-red-500">No subcategories found.</div>
            )}
             <SearchComponent placeholder="Search Item By Name" onSearch={searchItems} />
            <PopularProducts />
        </>
    );
};

export default CategoryWise;