import { SvgProps, SvgXml } from 'react-native-svg'

import React from 'react'

const xml = `<svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32.5" cy="32.5" r="32.5" fill="#4A4A4A"/>
<path d="M16 32H32.5H49" stroke="#EEF33E" stroke-width="3"/>
<path d="M33 49V32.5L33 16" stroke="#EEF33E" stroke-width="3"/>
</svg>
`

export const PlusIcon = (props: SvgProps) => <SvgXml xml={xml} {...props} />
