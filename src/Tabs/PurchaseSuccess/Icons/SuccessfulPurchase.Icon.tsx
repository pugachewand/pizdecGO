import { SvgProps, SvgXml } from 'react-native-svg'

import React from 'react'

const xml = `<svg width="285" height="285" viewBox="0 0 285 285" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle opacity="0.02" cx="142.5" cy="142.5" r="142.5" fill="#4A4A4A"/>
<circle opacity="0.04" cx="142.5" cy="142.5" r="121.815" fill="#4A4A4A"/>
<circle opacity="0.08" cx="142.5" cy="142.5" r="85.0403" fill="#4A4A4A"/>
<path d="M141.351 203.407C156.895 203.407 171.802 197.232 182.794 186.241C193.785 175.25 199.96 160.342 199.96 144.798C199.96 129.254 193.785 114.347 182.794 103.356C171.802 92.3643 156.895 86.1895 141.351 86.1895L141.351 144.798L141.351 203.407Z" fill="#4A4A4A"/>
<circle cx="94.1381" cy="145.341" r="11.3962" fill="#4A4A4A"/>
<circle cx="111.504" cy="107.354" r="11.3962" fill="#4A4A4A"/>
<circle cx="111.504" cy="182.243" r="11.3962" fill="#4A4A4A"/>
<path d="M168.408 117.576L180.386 129.554L141.264 168.676L129.286 156.698L168.408 117.576Z" fill="#F6F6F6"/>
<path d="M118.706 146.029L130.684 134.051L141.32 144.683L141.354 168.677L118.706 146.029Z" fill="#4A4A4A"/>
</svg>
`

export const SuccessfulPurchaseIcon = (props: SvgProps) => <SvgXml xml={xml} {...props} />
