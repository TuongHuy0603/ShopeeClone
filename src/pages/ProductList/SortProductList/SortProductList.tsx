
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { ProductListConfig } from 'src/types/product.type'
import path from 'src/constant/path'
import classNames from 'classnames'
import { sortBy, order as orderConstant } from 'src/constant/sortBy'
import { omit } from 'lodash'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
  pageSize: number

}
export default function SortProductList({ queryConfig, pageSize }: Props) {
  const { sort_by = sortBy.createdAt } = queryConfig
  const page = Number(queryConfig.page)
  const { t } = useTranslation('home')
  const navigate = useNavigate()
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit({
        ...queryConfig,
        sort_by: sortByValue
      }, ['order'])).toString()
    })
  }
  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }
  return (
    <div className=' bg-gray-300/40 py-4 px-3'>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center flex-wrap gap-2">
          <div>{t('aside filter.sort by')}</div>
          <button className={classNames('h-8 px-4 text-sm capitalize text-canter', {
            ' bg-orange text-white  hover:bg-orange/80': isActiveSortBy(sortBy.view), 'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
          })} onClick={() => handleSort(sortBy.view)}>{t('aside filter.popular')}</button>

          <button className={classNames('h-8 px-4 text-sm capitalize text-canter', {
            ' bg-orange text-white  hover:bg-orange/80': isActiveSortBy(sortBy.createdAt), 'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
          })} onClick={() => handleSort(sortBy.createdAt)}>{t('aside filter.latest')}</button>

          <button className={classNames('h-8 px-4 text-sm capitalize text-canter', {
            ' bg-orange text-white  hover:bg-orange/80': isActiveSortBy(sortBy.sold), 'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
          })} onClick={() => handleSort(sortBy.sold)}>{t('aside filter.top')}</button>
          <select className={classNames("h-8 px-4 py-0 capitalize outline-none border-none", {
            ' bg-orange text-white  hover:bg-orange/80': isActiveSortBy(sortBy.price), 'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
          })}
            onChange={(e) => {
              handlePriceOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>)

            }}>
            <option className='bg-white text-black' disabled>{t('aside filter.price')}</option>
            <option className='bg-white text-black' value={orderConstant.asc}>{t('aside filter.price lth')}</option>
            <option className='bg-white text-black' value={orderConstant.desc}>{t('aside filter.price htl')}</option>
          </select>
        </div>
        <div className="flex items-center">
          <div>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='flex w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 justify-center items-center cursor-not-allowed shadow'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </span>
            ) : <Link to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: (page - 1).toString()
              }).toString()
            }} onClick={() => {
            }} className="flex w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 justify-center items-center cursor-pointer shadow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>}
            {page === pageSize ? (
              <span className='flex w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 justify-center items-center cursor-not-allowed shadow'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </span>
            ) : <Link to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: (page + 1).toString()
              }).toString()
            }} onClick={() => {
            }} className="flex w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 justify-center items-center cursor-pointer shadow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>}

          </div>
        </div>
      </div>

    </div >
  )
}
