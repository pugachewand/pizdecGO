import { StyleSheet } from 'react-native'

import { globalContext } from '../../../DependencyInjection/AppContext'
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors'

const commonTheme = globalContext.theme.value

export const TimerStyles = StyleSheet.create({
    timerTextStyle: {
        marginLeft: 5,
        marginRight: 5,
        fontSize: 25,
        color: commonTheme.colors.darkBackground
    },

    inActiveTimerContainer: {
        position: 'absolute',
        top: 0,
        opacity: .7,
        width: '100%',
        backgroundColor: commonTheme.colors.darkBackground,
        height: '100%',
        flexDirection: 'row'
    },

    inActiveTimerTextStyle: {
        marginLeft: 5,
        marginRight: 5,
        fontSize: 25,
        color: commonTheme.colors.default,
    },
})