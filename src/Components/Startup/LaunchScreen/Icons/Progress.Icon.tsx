import { SvgProps, SvgXml } from 'react-native-svg'

import React from 'react'

const xml = `<svg width="40" height="128" viewBox="0 0 40 128" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M31.6764 0.0252108C33.2552 -0.508018 25.8876 7.49041 23.2563 17.0885C21.1512 22.4208 22.73 38.9509 31.6764 55.481C36.9391 66.1455 43.7805 80.5427 37.4653 94.4066C34.3078 107.204 12.2047 126.934 4.83706 128C6.41585 125.334 11.1522 116.269 14.836 103.471C21.6775 81.0759 1.67948 59.7468 0.100691 42.6835C-2.00436 19.7547 29.5714 0.558439 31.6764 0.0252108Z" fill="#DEDEDE"/>
</svg>`

export const ProgressIcon = (props: SvgProps) => <SvgXml xml={xml} {...props} />
