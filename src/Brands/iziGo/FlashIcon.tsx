import { SvgProps, SvgXml } from 'react-native-svg'

import React from 'react'

const xml =
`<svg width="206" height="205" viewBox="0 0 206 205" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle opacity="0.02" cx="103" cy="102.5" r="102.5" fill="#F1F45B"/>
<circle opacity="0.04" cx="103" cy="102.5" r="87.621" fill="#F1F45B"/>
<circle opacity="0.08" cx="103" cy="102.5" r="61.1694" fill="#F1F45B"/>
<path d="M102.173 146.31C113.354 146.31 124.077 141.869 131.983 133.963C139.889 126.057 144.331 115.334 144.331 104.153C144.331 92.9724 139.889 82.2496 131.983 74.3436C124.077 66.4375 113.354 61.996 102.173 61.996L102.173 104.153V146.31Z" fill="#F1F45B"/>
<circle cx="68.2134" cy="104.544" r="8.19724" fill="#F1F45B"/>
<circle cx="80.7046" cy="77.2194" r="8.19724" fill="#F1F45B"/>
<circle cx="80.7046" cy="131.087" r="8.19724" fill="#F1F45B"/>
<path d="M121.636 84.572L130.252 93.188L102.111 121.328L93.4954 112.712L121.636 84.572Z" fill="#6D6E59"/>
<path d="M85.8853 105.038L94.5012 96.4218L102.151 104.07L102.176 121.328L85.8853 105.038Z" fill="#F1F45B"/>
</svg>
`

export const FlashIcon = (props: SvgProps) => <SvgXml xml={xml} {...props} />
