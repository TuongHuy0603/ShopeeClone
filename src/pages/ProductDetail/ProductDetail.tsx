import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import ProductRating from 'src/components/ProductRating'
import { Product as ProductType, ProductListConfig } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils'
import Product from '../ProductList/Product'
import QuantityController from 'src/components/QuantityController'
import purchaseApi from 'src/apis/purchase.api'
import { purchaseStatus } from 'src/constant/purchase'
import { toast } from 'react-toastify'
import path from 'src/constant/path'


export default function ProductDetail() {
  const queryClient = useQueryClient()
  const { nameId } = useParams()
  const [buyCount, setBuyCount] = useState(1)
  const id = getIdFromNameId(nameId as string)
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const [curentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const product = productDetailData?.data.data
  const imageRef = useRef<HTMLImageElement>(null)
  const navigate = useNavigate()
  const currentImages = useMemo(() => (product ? product?.images.slice(...curentIndexImages) : []), [product, curentIndexImages])
  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product, curentIndexImages])

  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id }
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    }, keepPreviousData: true, enabled: Boolean(product), staleTime: 3 * 60 * 1000

  })
  const addToCartMutation = useMutation(purchaseApi.addToCard)
  const chooseActive = (img: string) => {
    setActiveImage(img)
  }
  const next = () => {
    if (curentIndexImages[1] < (product as ProductType).images.length) {
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
  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCard = () => {
    addToCartMutation.mutate({ buy_count: buyCount, product_id: product?._id as string }, {
      onSuccess: (data) => {
        toast.success(data.data.message)
        queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchaseStatus.inCart }] })
      }
    })
  }
  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    const { offsetY, offsetX } = event.nativeEvent
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }
  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  return (
    <div className='bg-gray-200 py-6'>
      <div className="container">
        <div className="bg-white p-4 shadow">
          <div className="grid grid-cols-12 gap-9">
            <div className="col-span-5">
              <div className="cursor-zoom-in relative w-full pt-[100%] shadow overflow-hidden" onMouseMove={(e) => {
                handleZoom(e)
              }} onMouseLeave={handleRemoveZoom}>
                <img src={activeImage} alt={product?.name} className="pointer-events-none absolute top-0 left-0 h-full w-full bg-white object-cover" ref={imageRef} />
              </div>
              <div className="relative mt-4 grid grid-cols-5 gap-1">
                <button onClick={prev} className="absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white" >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                {currentImages.map((img) => {
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
                <QuantityController onDecrease={handleBuyCount} onIncrease={handleBuyCount} onType={handleBuyCount} max={product?.quantity} value={buyCount} />
                <div className="ml-6 text-sm text-gray-500">
                  {product?.quantity} sản phẩm có sẵn
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <button className="flex h-12 items-center justify-center border rounded-sm border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5" onClick={addToCard} >
                  <svg enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x={0} y={0} className="mr-[10px] h-5 w-5 fill-current stroke-orange text-orange"><g><g><polyline fill="none" points=".5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} /><circle cx={6} cy="13.5" r={1} stroke="none" /><circle cx="11.5" cy="13.5" r={1} stroke="none" /></g><line fill="none" strokeLinecap="round" strokeMiterlimit={10} x1="7.5" x2="10.5" y1={7} y2={7} /><line fill="none" strokeLinecap="round" strokeMiterlimit={10} x1={9} x2={9} y1="8.5" y2="5.5" /></g></svg>
                  Thêm vào giỏ hàng
                </button>
                <button className="ml-4 flex h-12 items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90" onClick={buyNow} >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
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
      </div>
      <div className="mt-8">
        <div className="container">
          <div className="uppercase text-gray-400">
            Có thể bạn cũng thích
          </div>
          {productsData && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {productsData.data.data.products.map((product) => (
                <div className="col-span-1" key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div >
  )
}
