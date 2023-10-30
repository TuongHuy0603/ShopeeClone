import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constant/path'
import { purchaseStatus } from 'src/constant/purchase'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { produce } from 'immer'
import noproduct from '/src/assets/images/no-product.png'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { useTranslation } from 'react-i18next'

export default function Cart() {

  const { extendPurchases, setExtendPurchases } = useContext(AppContext)
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
      refetch()
    }
  })
  const { t } = useTranslation('product')
  const checkedPurchases = useMemo(() => extendPurchases.filter(purchase => purchase.checked), [extendPurchases])
  const checkedPurchasesCount = checkedPurchases.length
  const location = useLocation()
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId
  const isAllChecked = useMemo(() => extendPurchases.every((purchase) => purchase.checked), [extendPurchases])
  const totalCheckedPurchasePrice = useMemo(() => checkedPurchases.reduce((result, current) => {
    return result + current.product.price * current.buy_count
  }, 0), [checkedPurchases])
  const totalCheckedPurchaseSavingPrice = useMemo(() => checkedPurchases.reduce((result, current) => {
    return result + (current.product.price_before_discount - current.product.price) * current.buy_count
  }, 0), [checkedPurchases])
  const purchasesInCart = purchasesInCartData?.data.data

  useEffect(() => {
    setExtendPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    }
    )

  }, [purchasesInCart, choosenPurchaseIdFromLocation])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleChecked = (productIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendPurchases(
      produce(draft => {
        draft[productIndex].checked = event.target.checked
      }))
  }
  const handleCheckAll = () => {
    setExtendPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      })))
  }
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendPurchases(
      produce(draft => {
        draft[purchaseIndex].buy_count = value
      }))
  }
  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    const purchase = extendPurchases[purchaseIndex]
    if (enable) {
      setExtendPurchases(
        produce(draft => {

          draft[purchaseIndex].disabled = true
        }))
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }
  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendPurchases[purchaseIndex]._id

    deletePurchasesMutation.mutate([purchaseId])
  }
  const handleDeleteManyPurchase = () => {
    const purchasesIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchasesIds)
  }
  const handleBuyProduct = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) =>
      (
        {
          product_id: purchase.product._id,
          buy_count: purchase.buy_count
        }
      ))
      buyProductsMutation.mutate(body)
    }
  }
  return (
    <div className='bg-neutral-100 py-16'>
      <div className="container">
        {extendPurchases.length > 0 ? (
          <>
            <div className="overflow-auto">
              <div className="min-w-[1000px]">
                <div className="grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow">
                  <div className="col-span-6 bg-white">
                    <div className="flex items-center">
                      <div className="flex flex-shrink-0 items-center justify-center pr-3">
                        <input type='checkbox' className='h-5 w-5 accent-orange' checked={isAllChecked} onChange={handleCheckAll} />
                      </div>
                      <div className="flex-grow text-black">
                        {t('product detail.product')}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="grid-cols-5 grid text-center">
                      <div className="col-span-2"> {t('product detail.price')}</div>
                      <div className="col-span-1"> {t('product detail.quantity')}</div>
                      <div className="col-span-1"> {t('product detail.total')}</div>
                      <div className="col-span-1"> {t('product detail.action')}</div>
                    </div>
                  </div>
                </div>
                {extendPurchases.length > 0 && (
                  <div className="my-3 rounded-sm bg-white p-5 shadow">
                    {extendPurchases?.map((purchase, index) => (
                      <div key={purchase._id} className='mb-5 items-center first:mt-0 grid grid-cols-12 text-center rounded-sm border-gray-200 bg-white px-4 py-5 text-center text-gray-500'>
                        <div className="col-span-6">
                          <div className="flex">
                            <div className="flex flex-shrink-0 items-center justify-center pr-3">
                              <input type='checkbox' className='h-5 w-5 accent-orange' checked={purchase.checked} onChange={handleChecked(index)} />
                            </div>
                            <div className="flex-grow">
                              <div className="flex">
                                <Link to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`} className='h-20 w-20 flex-shrink-0 '>
                                  <img src={purchase.product.image} alt={purchase.product.name} />
                                </Link>
                                <div className="flex-grow px-2 pt-1 pb-2">
                                  <Link to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`} className='line-clamp-2 text-left' >{purchase.product.name} </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6">
                          <div className="grid grid-cols-5 items-center">
                            <div className="col-span-2">
                              <div className="flex items-center justify-center">
                                <span className="text-gray-300 line-through">
                                  đ{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className="ml-3">
                                  đ{formatCurrency(purchase.product.price)}
                                </span>
                              </div>
                            </div>
                            <div className="col-span-1">
                              <QuantityController max={purchase.product.quantity} value={purchase.buy_count} onIncrease={(value) => { handleQuantity(index, value, value <= purchase.product.quantity) }} onDecrease={(value) => { handleQuantity(index, value, value >= 1) }} disabled={purchase.disabled} classNameWrapper='flex items-center' onType={handleTypeQuantity(index)} onFocusOut={(value) => { handleQuantity(index, value, value >= 1 && value <= purchase.product.quantity && value !== (purchasesInCart as Purchase[])[index].buy_count) }} />
                            </div>
                            <div className="col-span-1">
                              <span className="text-orange">
                                đ{formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>
                            <div className="col-span-1">
                              <button className="bg-none text-black transition-colors hover:text-orange" onClick={handleDelete(index)}>
                                {t('product detail.delete')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="sticky border-gray-100 shadow bottom-0 mt-10 z-10 flex items-center rounded-sm flex-col md:flex-row  bg-white p-5">
              <div className="flex justify-center items-center">
                <div className="flex flex-shrink-0 justify-center items-center  px-4">
                  <input type='checkbox' className='h-5 w-5 accent-orange ' checked={isAllChecked} onChange={handleCheckAll} />
                  <button className="mx-3 border-none bg-none" onClick={handleCheckAll}> {t('product detail.select all')} ({extendPurchases.length})</button>
                  <button className="mx-3 border-none bg-none" onClick={handleDeleteManyPurchase}> {t('product detail.delete')}</button>
                </div>
              </div>

              <div className="mt-5 flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center flex items-center">
                <div>
                  <div className="flex  items-center justify-end">
                    <div> {t('product detail.total')} ({checkedPurchasesCount}):</div>
                    <div className="ml-2 text-2xl text-orange">
                      đ{formatCurrency(totalCheckedPurchasePrice)}
                    </div>
                  </div>
                  <div className="flex items-center justify-end text-sm">
                    <div className="text-gray-500">
                      {t('product detail.save')}
                    </div>
                    <div className="ml-6 text-orange">đ{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>
                <Button className='mt-5 sm:ml-4 sm:mt-0 w-52 h-10 text-center ml-4 uppercase bg-red-500 text-white text-sm hover:bg-red-600 justify-center items-center flex' onClick={handleBuyProduct} disabled={buyProductsMutation.isLoading}>
                  {t('product detail.buy')}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center'>
            <img src={noproduct} alt='no purchases' className='h-24 w-24 mx-auto' />
            <div className="font-bold mt-5 text-gray-400 mt-5"> {t('product detail.empty cart')}</div>
            <Link to={path.home} className='  bg-orange px-10 hover:bg-orange/80 transition-all py-3 uppercase text-white'>
              {t('product detail.buy')}
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
