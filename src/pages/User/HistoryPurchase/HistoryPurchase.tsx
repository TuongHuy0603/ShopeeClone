import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import React from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import path from 'src/constant/path'
import { purchaseStatus } from 'src/constant/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

const purchaseTabs = [
  { status: purchaseStatus.all, name: "Tất cả" },
  { status: purchaseStatus.waitForConfirmation, name: "Chờ xác nhận" },
  { status: purchaseStatus.waitForGetting, name: "Chờ lấy hàng" },
  { status: purchaseStatus.inProgress, name: "Đang giao" },
  { status: purchaseStatus.delivered, name: "Đã giao" },
  { status: purchaseStatus.cancelled, name: "Đã hủy" }
]
export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchaseStatus.all
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus }),
  })
  const purchasesInCart = purchasesInCartData?.data.data
  const purchaseTabLink = purchaseTabs.map((tab) => (
    <Link key={tab.status} to={{
      pathname: path.historyPurchase,
      search: createSearchParams({
        status: String(tab.status)
      }).toString()
    }} className={classNames('flex flex-1 irtems-center justify-center border-b-2 bg-white py-4 text-center', { 'border-b-orange text-orange': status === tab.status, 'border-b-black/10 text-gray-900': status !== tab.status })}>{tab.name}</Link>
  ))
  return (
    <div>
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="sticky top-0 flex rounded-t-sm shadow-sm">
            {purchaseTabLink}
          </div>
          <div>
            {purchasesInCart?.map(purchase => (
              <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white text-gray-800 p-6 shadow-sm'>
                <Link to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`} className='flex'>
                  <div className="flex-shrink-0">
                    <img className='h-20 w-20 object-cover' src={purchase.product.image} alt={purchase.product.name} />
                  </div>
                  <div className="ml-3 flex-grow overflow-hidden">
                    <div className="truncate">
                      {purchase.product.name}
                    </div>
                    <div className="mt-3">
                      {purchase.buy_count}
                    </div>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <span className="truncate text-gray-500 line-through">
                      đ{formatCurrency(purchase.product.price_before_discount)}
                    </span>
                    <span className="truncate ml-2 text-orange">
                      đ{formatCurrency(purchase.product.price)}
                    </span>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <div>
                    <span>
                      Tổng giá tiền
                    </span>
                    <span className='ml-4 text-xl text-orange'>
                      đ{formatCurrency(purchase.product.price * purchase.buy_count)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
