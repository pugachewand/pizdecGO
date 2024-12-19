import { Dimensions, StyleSheet } from 'react-native'

import { globalContext } from '../../DependencyInjection/AppContext'

const commonTheme = globalContext.theme.value

export const PurchaseSuccessStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        color: '#000',
        marginBottom: commonTheme.bottomArea.height,
    },
    descriptionContainer: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
    },
    textStyle:{
        color: commonTheme.colors.darkBackground,
        fontSize: 24,
    },
    icon: {
        marginTop: 30,
    },
    bottom: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 28,
        paddingLeft: 35,
        paddingRight: 10,
        alignItems: 'center',
    },
    qrCodeContainer: {
        flexDirection: 'column',
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrText: {
        width: 260,
        fontSize: 22,
        alignSelf: 'center',
    },
    fiscalQrCode: {
        width: 140,
        height: 140,
        marginTop: 10,
    },
    timer: {
        position: 'absolute',
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems:'center',
        bottom: 0,
        padding: 25,
    },
    timerTextStyle: {
        marginLeft: 5,
        marginRight: 5,
        fontSize: 36,
        color: commonTheme.colors.darkBackground
    }
})