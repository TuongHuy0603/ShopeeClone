import React, { useState } from 'react'
import AsideFilter from './AsideFilter'
import SortProductList from './SortProductList'
import Product from './Product'
import useQueryParams from 'src/hooks/useQueryParams'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import Paginate from 'src/components/Paginate'
import { ProductListConfig } from 'src/types/product.type'
import { omitBy, isUndefined } from 'lodash'
import categoryApi from 'src/apis/category.api'
export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export default function ProductList() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy({
    page: queryParams.page || '1',
    limit: queryParams.limit || '20',
    sort_by: queryParams.sort_by,
    exclude: queryParams.exclude,
    name: queryParams.name,
    order: queryParams.order,
    price_max: queryParams.price_max,
    price_min: queryParams.price_min,
    rating_filter: queryParams.rating_filter,
    category: queryParams.category
  }, isUndefined)

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      console.log(queryConfig)
      return productApi.getProducts(queryConfig as ProductListConfig)

    }, keepPreviousData: true

  })
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', queryConfig],
    queryFn: () => {
      return categoryApi.getCategory()
    }
  })
  return (
    <div className='bg-gray-200 py-6'>
      <div className="container">
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
