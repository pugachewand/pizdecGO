import { ActivityIndicator } from 'react-native'
import React from 'react'
import { globalContext } from '../../../DependencyInjection/AppContext'
import { loaderStyles as s } from './Loader.Styles'

type props = {
	size?: number | 'large' | 'small'
}

/* eslint-disable no-shadow */
export const Loader = (props?: props) => <ActivityIndicator size={props?.size || 'large'} style={s.circularProgress} color={globalContext.theme.value.colors.main} />
export const PaymentLoader = (props?: props) => <ActivityIndicator size={props?.size || 'large'} style={s.circularProgress1} color={globalContext.theme.value.colors.darkBackground} />
