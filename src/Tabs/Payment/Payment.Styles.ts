import { StyleSheet } from 'react-native'

import { globalContext } from '../../DependencyInjection/AppContext'

const commonTheme = globalContext.theme.value
export const PaymentStyles = StyleSheet.create({
    wrap: {
        flex: 1,
    },
    container: {
        backgroundColor: '#F6F6F6',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center', 
        paddingTop: 20,
        paddingBottom: commonTheme.bottomArea.height,

    },
    content: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        display: 'flex',
        // flexDirection: 'row',
        justifyContent: 'center'
    },
    textStyle: {
        fontSize: 24,
        color: commonTheme.colors.darkBackground,
    },
    textDesc: {
        flexGrow: 2
    },
    buttonsRow: {
      height: commonTheme.bottomArea.height,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginTop: 'auto',
      backgroundColor: commonTheme.colors.darkBackground
          //   marginBottom: 15
    },

    headerTop: {
        width: '50%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    errorContainer: {
        flex: 1,
        marginTop: 0,
        alignItems: 'center',
    },
    paymentTextHeader: {
        fontSize: 36,
        fontWeight: '400',
        color: commonTheme.colors.darkBackground,
    },
    paymentTextDescription: {
        fontSize: 24,
        color: commonTheme.colors.darkBackground,
        textAlign: 'center',
    },
    errorIconStyle: {
        flex: .8,
        alignContent: 'center',
        justifyContent: 'center',
    },
    
    //loading check card to terminal
    checkCardContainer: {
        height: '100%',
        width: '100%',
        paddingBottom: 10,
    },
    checkCardTextWrap: {
        alignItems: 'center',
    },
    checkCardIcon: {
        flex: 1,
        alignContent: 'space-between',
        justifyContent: 'center',
        alignItems: 'center'
    },
})