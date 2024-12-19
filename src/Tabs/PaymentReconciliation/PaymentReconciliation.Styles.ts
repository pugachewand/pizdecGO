import { StyleSheet } from 'react-native'

import { globalContext } from '../../DependencyInjection/AppContext'

const commonTheme = globalContext.theme.value
export const PaymentReconciliationStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: commonTheme.bottomArea.height,
        justifyContent: 'space-between'
    },
    status: {
        color: commonTheme.colors.default,
        fontSize: 18,
    },
    scrollableView: {
        marginLeft: 20,
        flex: 1,
        height: 400,
    },
})
