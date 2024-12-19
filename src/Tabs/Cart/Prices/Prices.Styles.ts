import { Dimensions, StyleSheet } from 'react-native'

import { globalContext } from '../../../DependencyInjection/AppContext';

const commonTheme = globalContext.theme.value

export const PricesStyles = StyleSheet.create({
    container: {
        flex: .45,
        width: '30%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginLeft: 'auto',
        paddingLeft: 30,
        marginVertical: 20,
    },
    textWrap: {
        flexDirection: 'row',
        marginBottom: -5,
    },
    discountText: {
        fontFamily: 'Montserrat-Bold',
        color: commonTheme.colors.backgroundColor,
        fontSize: 24,
        fontWeight: '600',
    },
    totalText: {
        fontFamily: 'Montserrat-SemiBold',
        color: commonTheme.colors.backgroundColor,
        fontSize: 26,
        fontWeight: '700'
    },
    text: {
        color: commonTheme.colors.backgroundColor,
        fontSize: 24,
        fontWeight: '400',
      },
})