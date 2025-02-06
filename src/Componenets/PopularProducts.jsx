import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from '../Context/AuthContext';
import ProductComponent from './ProductComponent';
import DataService from '../services/requestApi'
const PopularProducts = () => {
  const { hasMore, products, DataByCatogory, setProducts, setHasMore ,page,setPage} = useAuth();
  const selectedStore = localStorage.getItem('selectedStore');
  const parsedStore = selectedStore ? JSON.parse(selectedStore) : {};
  const { saasId,storeId  } = parsedStore;
  const [Uom , setUom] = useState([])
  // Function to fetch more data
  const fetchMoreData = async () => {
    try {
      await DataByCatogory(page);
    //   setPage((prevPage) => prevPage + 1); // Increment page after a successful fetch
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUom= async()=>{
    try {
      const res = await DataService.GetUomData(saasId,storeId)
      console.log(res)
      setUom(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }
 
  useEffect(() => {
  getUom()
  }, [])

  return (
    <>
      <InfiniteScroll
        dataLength={products.length} // Length of the current product list
        next={fetchMoreData} // Pass the fetchMoreData function
        hasMore={hasMore} // Whether to fetch more data
        loader={<h4>Loading...</h4>} // Loader while fetching
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        refreshFunction={async () => {
          // Reset the state for a full refresh
          setProducts([]);
          setPage(1);
          setHasMore(true);
          await DataByCatogory(1); // Fetch initial page
        }}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
      >
        <div className="w-full mx-auto my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  {products.map((item, index) => (
    <div key={index} className="inline-block">
      <ProductComponent Uom={Uom} data={item} />
    </div>
  ))}
</div>
      </InfiniteScroll>
    </>
  );
};

export default PopularProducts;
