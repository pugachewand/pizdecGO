import { SvgProps, SvgXml } from 'react-native-svg'

import React from 'react'

const xml = `<svg width="73" height="73" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_7983_3769)">
<path d="M27.3938 0V6.08959H33.4834V9.13431C35.6147 8.8299 37.4414 8.8299 39.573 9.13431V6.08959H45.6627V0H27.3938Z" fill="#4A4A4A"/>
<path d="M57.2324 20.0954L59.3636 17.9641L61.7996 20.4L66.0625 16.1373L56.928 7.00293L52.6655 11.2657L55.1011 13.7014L52.3607 16.4417C37.7461 7.61182 18.8684 12.179 10.3431 26.7938C1.81775 41.4089 6.38475 59.6775 20.6952 68.5072C35.0057 77.3373 53.8831 72.77 62.4088 58.1551C70.0205 45.6713 67.8893 29.8387 57.2324 20.0954ZM36.5281 63.6355C24.6534 63.6355 15.2146 54.197 15.2146 42.3224C15.2146 30.4477 24.6534 21.0089 36.5281 21.0089V42.3221H57.8412C57.8416 54.1966 48.4027 63.6355 36.5281 63.6355Z" fill="#4A4A4A"/>
</g>
<defs>
<clipPath id="clip0_7983_3769">
<rect width="73" height="73" fill="white"/>
</clipPath>
</defs>
</svg>
`

export const StopWatch = (props: SvgProps) => <SvgXml xml={xml} {...props} />
