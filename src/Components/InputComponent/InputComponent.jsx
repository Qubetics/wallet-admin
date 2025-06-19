import { Input } from 'antd'
import React from 'react'
import './InputComponent.scss'

function InputComponent({selectAfter,selectBefore,defaultValue,placeholder,name,type,onChange}) {
  return (
    <div>
        <Input className='inputSyle' type={type} placeholder={placeholder} name={name} addonBefore={selectBefore} addonAfter={selectAfter} defaultValue={defaultValue} onChange={onChange} />
    </div>
  )
}

export default InputComponent
