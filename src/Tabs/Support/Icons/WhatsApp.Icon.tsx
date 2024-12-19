import { SvgProps, SvgXml } from 'react-native-svg'

import React from 'react'

const xml = `<svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="57.7143" height="57.7143" rx="5" fill="#67C15E"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M24.0183 19.3777C23.6827 18.553 23.4281 18.5217 22.9195 18.5006C22.7463 18.4903 22.5534 18.4801 22.3394 18.4801C21.6777 18.4801 20.9859 18.6784 20.5685 19.1168C20.0599 19.6493 18.7978 20.8916 18.7978 23.4388C18.7978 25.9862 20.6091 28.4499 20.8534 28.7948C21.1079 29.1388 24.3847 34.4425 29.4726 36.604C33.4515 38.2952 34.632 38.1385 35.5376 37.9403C36.8604 37.6481 38.519 36.6453 38.9365 35.4348C39.3537 34.2236 39.3537 33.19 39.2314 32.9708C39.1094 32.7515 38.7734 32.6267 38.2648 32.3653C37.7562 32.1042 35.2832 30.8514 34.8152 30.6845C34.3572 30.5071 33.9197 30.5698 33.574 31.071C33.0854 31.7704 32.6074 32.4805 32.2204 32.9084C31.9153 33.2425 31.4165 33.2843 30.9993 33.1067C30.4396 32.867 28.8726 32.3026 26.9391 30.5385C25.4431 29.1711 24.4255 27.4695 24.1306 26.9579C23.8355 26.4361 24.1 26.133 24.334 25.8514C24.5886 25.5276 24.8327 25.2981 25.087 24.9951C25.3416 24.6924 25.4839 24.5359 25.6468 24.1808C25.8199 23.8364 25.6975 23.4812 25.5756 23.2201C25.4533 22.9584 24.4358 20.411 24.0183 19.3777ZM28.852 10.3589C19.3069 10.3589 11.5428 18.3244 11.5428 28.1169C11.5428 32.0005 12.7641 35.6023 14.8399 38.5255L12.6823 45.1235L19.3375 42.942C22.0748 44.8003 25.3413 45.8754 28.8623 45.8754C38.4073 45.8754 46.1714 37.9095 46.1714 28.1175C46.1714 18.3249 38.4073 10.3595 28.8623 10.3595H28.8523V10.3589H28.852Z" fill="white"/>
</svg>
`

export const WhatsApp = (props: SvgProps) => <SvgXml xml={xml} {...props} />
