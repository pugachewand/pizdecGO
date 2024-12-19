import { StyleSheet } from 'react-native'

import { globalContext } from '../../DependencyInjection/AppContext';

const commonTheme = globalContext.theme.value

export const cartStyles = StyleSheet.create({
    wrap: {
        flex: 1,
    },
    container: {
        marginBottom: commonTheme.bottomArea.height,
        backgroundColor: '#F6F6F6',
        color: '#000',
        flex: 1,
    },
    headerContainer: {
        height: 'auto',
    },
    headerInner: {
        marginTop: 10,
        alignItems: 'center'
    },
})