
import AsideFilter from './AsideFilter'
import SortProductList from './SortProductList'
import Product from './Product'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import Paginate from 'src/components/Paginate'
import { ProductListConfig } from 'src/types/product.type'
import banner from '/src/assets/images/banner.jpg'
import trend from '/src/assets/images/trend.jpg'
import sale from '/src/assets/images/sale.png'
import sale2 from '/src/assets/images/sale2.jpg'
import sale3 from '/src/assets/images/sale3.jpg'
import { Button, Carousel } from 'flowbite-react';
import categoryApi from 'src/apis/category.api'
import useQueryConfig from 'src/hooks/useQueryConfig'

export default function ProductList() {
  const queryConfig = useQueryConfig()

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    }, keepPreviousData: true, staleTime: 3 * 60 * 1000

  })
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategory()
    }
  })
  return (
    <div className='bg-gray-200 py-6'>

      <div className="container">
        <div className="grid grid-cols-12 gap-5 pb-5">
          <div className="col-span-8">
            <div className=" h-[100%] flex-grow-0 flex">
              <Carousel pauseOnHover >
                <img
                  alt=".."
                  src={banner}
                />
                <img
                  alt="..."
                  src={sale2}
                />
                <img
                  alt="..."
                  src={sale3}
                />
              </Carousel>
            </div>

          </div>
          <div className="col-span-4 flex items-center flex-col justify-center">
            <img className='mb-3'
              alt=".."
              src={trend}
            />
            <img
              alt="..."
              src={sale}
            />
          </div>
        </div>
        {productsData && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
            <div className="col-span-9">
              <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {productsData.data.data.products.map((product, index) => (
                  <div className="col-span-1" key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Paginate queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
