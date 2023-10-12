import { useForm } from "react-hook-form"
import useQueryConfig from "./useQueryConfig"
import { yupResolver } from "@hookform/resolvers/yup"
import { omit } from "lodash"
import { Schema, schema } from "src/utils/rule"
import { createSearchParams, useNavigate } from "react-router-dom"
import path from "src/constant/path"

export default function useSearchProducts() {
  const queryConfig = useQueryConfig()
  const nameSchema = schema.pick(['name'])
  type FormData = Pick<Schema, 'name'>
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    }, resolver: yupResolver(nameSchema)
  })
  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order ? omit({
      ...queryConfig,
      name: data.name
    }, ['order', 'sort_by']) : {
      ...queryConfig, name: data.name
    }
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })
  return {
    onSubmitSearch, register
  }
}
