import { Dimensions, StyleSheet } from 'react-native'

import { globalContext } from '../../DependencyInjection/AppContext'

const commonTheme = globalContext.theme.value

export const PurchaseCancelStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: commonTheme.bottomArea.height
    },
    textStyle: {
        fontSize: 24,
        color: commonTheme.colors.default,
    },
    buttonsRow: {
            width: '100%',
            position: 'absolute',
            height: commonTheme.bottomArea.height,
            bottom: 0,
            backgroundColor: commonTheme.navigation.navigationColor,
            alignSelf: 'center',
            alignItems: 'center',
            alignContent: 'center',
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between'
    }
})