import { SvgProps, SvgXml } from 'react-native-svg'

import React from 'react'

const xml = `<svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32.5" cy="32.5" r="32.5" fill="#4A4A4A"/>
<path d="M45.9691 25.9933V19.2639C45.9691 18.9188 45.6826 18.6387 45.3287 18.6387H33.3266V15.6251C33.3266 15.2801 33.0402 15 32.6863 15C32.3324 15 32.0459 15.2801 32.0459 15.6251V18.6387H19.6745C19.3206 18.6387 19.0342 18.9188 19.0342 19.2639V25.9799C19.0081 26.0562 18.9958 26.1375 19.0013 26.2191L20.5142 48.4165C20.5364 48.7449 20.816 49 21.1533 49H43.847C44.1842 49 44.4634 48.7449 44.4861 48.4165L45.999 26.2191C46.0037 26.142 45.9921 26.0658 45.9691 25.9933ZM44.6884 19.889V25.5527H20.3149V19.889H44.6884ZM43.2476 47.7501H21.7522L20.3247 26.803H44.6756L43.2476 47.7501Z" fill="#EEF33E" stroke="#EEF33E"/>
<path d="M32.5 43C32.7763 43 33 42.739 33 42.4174V32.5826C33 32.261 32.7763 32 32.5 32C32.2237 32 32 32.261 32 32.5826V42.4174C32 42.739 32.224 43 32.5 43Z" fill="#EEF33E" stroke="#EEF33E"/>
<path d="M38.5 43C38.7763 43 39 42.739 39 42.4174V32.5826C39 32.261 38.7763 32 38.5 32C38.2237 32 38 32.261 38 32.5826V42.4174C38 42.739 38.2237 43 38.5 43Z" fill="#EEF33E" stroke="#EEF33E"/>
<path d="M26.6124 43C26.6171 43 26.6215 43 26.6261 42.9996C26.8399 42.9887 27.0072 42.7188 26.9998 42.3972L26.7743 32.5629C26.7671 32.2413 26.5848 31.9823 26.3739 32.0009C26.1601 32.0118 25.9928 32.2817 26.0002 32.6033L26.2257 42.4376C26.2329 42.7526 26.4049 43 26.6124 43Z" fill="#EEF33E" stroke="#EEF33E"/>
</svg>
`

export const TrashBin = (props: SvgProps) => <SvgXml xml={xml} {...props} />