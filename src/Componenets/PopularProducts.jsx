import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from '../Context/AuthContext';
import ProductComponent from './ProductComponent';

const PopularProducts = () => {
    const {hasMore,products,DataByCatogory,setProducts,setHasMore} = useAuth()
    const [page, setPage] =  useState(1)
  return (
    <>
    <InfiniteScroll
      dataLength={products.length} // Length of the current product list
      next={DataByCatogory} // Function to fetch more data
      hasMore={hasMore} // Whether to fetch more data
      loader={<h4>Loading...</h4>} // Loader while fetching
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
      refreshFunction={() => {
        // Optional: Reset the state for a full refresh
        setProducts([]);
        setPage(1);
        setHasMore(true);
        DataByCatogory();
      }}
      pullDownToRefreshContent={
        <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
      }
    >
      <div className="w-full mx-auto my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products
          .map((item, index) => (
            <div key={index} className="inline-block">
              <ProductComponent data={item}  />
            </div>
            
          ))}
      </div>
    </InfiniteScroll>
    </>
  )
}

export default PopularProducts