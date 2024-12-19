import { StyleSheet } from 'react-native'
import { globalContext } from '../../DependencyInjection/AppContext';

const commonTheme = globalContext.theme.value

export const PurchaseInitStyles = StyleSheet.create({
    container: {
        backgroundColor: commonTheme.colors.default,
        flex: 1,
        color: '#000',
        marginBottom: commonTheme.bottomArea.height
    }
})