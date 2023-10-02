import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import InputNumber from 'src/components/InputNumber'
import ProductRating from 'src/components/ProductRating'
import { Product } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, rateSale } from 'src/utils/utils'

export default function ProductDetail() {
  const { id } = useParams()
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const [curentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const product = productDetailData?.data.data
  const currentImages = useMemo(() => (product ? product?.images.slice(...curentIndexImages) : []), [product])
  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.image[0])
    }
  }, [product, curentIndexImages])

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }
  const next = () => {
    if (curentIndexImages[1] < (product as Product).images.length) {
      setCurrentIndexImages((prev) => (
        [prev[0] + 1, prev[1] + 1]
      ))
    }
  }
  const prev = () => {
    if (curentIndexImages[0] > 0)
      setCurrentIndexImages((prev) => (
        [prev[0] - 1, prev[1] - 1]
      ))
  }

  return (
    <div className='bg-gray-200 py-6'>
      <div className="container">
        <div className="bg-white p-4 shadow">
          <div className="grid grid-cols-12 gap-9">
            <div className="col-span-5">
              <div className="relative w-full pt-[100%] shadow">
                <img src={activeImage} alt={product?.name} className="absolute top-0 left-0 h-full w-full bg-white object-cover" />
              </div>
              <div className="relative mt-4 grid grid-cols-5 gap-1">
                <button onClick={prev} className="absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white" >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                {currentImages.map((img, index) => {
                  const isActive = img === activeImage
                  return (
                    <div className="relative w-full pt-[100%]" onMouseEnter={() => {
                      chooseActive(img)
                    }} key={img}>
                      <img src={img} alt={img} className="absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover" />
                      {isActive && <div className="absolute inset-0 border-2 border-orange"></div>}
                    </div>
                  )
                })}
                <button onClick={next} className="absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white" >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

              </div>
            </div>
            <div className="col-span-7">
              <h1 className="text-xl font-medium uppercase">
                {product?.name}
              </h1>
              <div className="mt-8 flex items-center">
                <div className="flex items-center">
                  <span className="mt-1 border-b border-b-orange text-orange">
                    {product?.rating}
                  </span>
                  <ProductRating rating={product?.rating || 0} activeClassName='fill-orange text-orange h-4 w-4' nonactiveClassName='fill-gray-300 text-gray-300 h-4 w-4' />
                </div>
                <div className="mx-4 h-4 bg-gray-300 w-[1px]">
                  <span className='ml-[15px]'>{formatNumberToSocialStyle(product?.sold || 0)}</span>
                  <span className="ml-1 text-gray-500 whitespace-nowrap">Đã bán</span>
                </div>
              </div>
              <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
                <div className="text-gray-500 line-through">
                  đ{formatCurrency(product?.price_before_discount || 0)}
                </div>
                <div className="ml-3 text-3xl font-medium text-orange">
                  đ{formatCurrency(product?.price || 0)}
                </div>
                <div className="ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white">
                  {rateSale(product?.price_before_discount || 0, product?.price || 0)} giảm
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <div className="capitalize text-gray-500">
                  Số lượng
                </div>
                <div className="ml-10 flex items-center">
                  <button className="flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  <InputNumber value={1} className='' classNameError='hidden' classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none' />
                  <button className="flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                  <div className="ml-6 text-sm text-gray-500">
                    {product?.quantity} sản phẩm có sẵn
                  </div>
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <button className="flex h-12 items-center justify-center border rounded-sm border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5" >
                  <svg enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x={0} y={0} className="mr-[10px] h-5 w-5 fill-current stroke-orange text-orange"><g><g><polyline fill="none" points=".5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} /><circle cx={6} cy="13.5" r={1} stroke="none" /><circle cx="11.5" cy="13.5" r={1} stroke="none" /></g><line fill="none" strokeLinecap="round" strokeMiterlimit={10} x1="7.5" x2="10.5" y1={7} y2={7} /><line fill="none" strokeLinecap="round" strokeMiterlimit={10} x1={9} x2={9} y1="8.5" y2="5.5" /></g></svg>
                  Thêm vào giỏ hàng
                </button>
                <button className="ml-4 flex h-12 items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90" >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="mt-8 bg-white p-4 shadow">
          <div className="rounded bg-gray-50 p-4 text-lg capitalize text-slate-700">
            Mô tả sản phẩm
          </div>
          <div className="mx-4 mt-12 mb-4 text-sm leading-loose">
            <div dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product?.description || '')
            }}>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
