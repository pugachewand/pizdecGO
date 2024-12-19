import { StyleSheet } from 'react-native'

import { globalContext } from '../../DependencyInjection/AppContext'

const commonTheme = globalContext.theme.value

export const NotReadyStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        color: '#000',
        marginBottom: commonTheme.bottomArea.height
    },
    descriptionContainer: {
        flex: 1,
        marginTop: 0,
        alignItems: 'center',
    },
    errorIcon: {
        marginTop: 10,
    },
    timer: {
        paddingRight: 10,
        marginBottom: 10,
        alignSelf: 'flex-end',
        alignContent: 'flex-end',
        flexDirection: 'row',
        alignItems:'center',
    },
    textStyle:{
        color: commonTheme.colors.darkBackground,
        fontSize: 24,
    },
    timerTextStyle: {
        marginLeft: 5,
        marginRight: 5,
        fontSize: 36,
        color: commonTheme.colors.darkBackground
    },
    textAlignCenter: {
        textAlign: 'center',
    }
})
