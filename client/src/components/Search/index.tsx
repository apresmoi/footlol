import React, { useState } from 'react'
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { GeojsonFeatureProperties } from '../../store/types';
import { api } from '../../settings'
import axios from 'axios';
const { Option } = Select;

interface SearchProps {
  onChange?: (feature: GeojsonFeatureProperties) => void
  value: GeojsonFeatureProperties
}

const Search = ({ onChange, value }: SearchProps) => {

  const [{
    fetching,
    data
  }, setState] = useState<{ fetching: boolean, data: GeojsonFeatureProperties[] }>({
    fetching: false,
    data: []
  })

  const fetchFeatures = debounce((text: string) => {
    setState({ data: [], fetching: true })
    axios.get(api.features + `?name[contains]=${text}`).then(response => {
      setState({ data: response.data.data, fetching: false })
    })
  })

  const handleChange = (value: any) => {
    console.log(value)
  }

  return (
    <Select
      labelInValue
      value={value && value.id}
      placeholder="Search feature"
      filterOption={false}
      onSearch={fetchFeatures}
      onChange={handleChange}
      showSearch 
      style={{ width: '100%' }}
    >
      {data.map(d => (
        <Option key={d.id} value={d.id}>{d.name}</Option>
      ))}
    </Select>
  )
}

export default Search