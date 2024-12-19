import {StyleSheet} from 'react-native'
import { globalContext } from '../../DependencyInjection/AppContext'

const commonTheme = globalContext.theme.value

export const SupportStyles = StyleSheet.create({
    container: {
                    flex: 1,
                    backgroundColor: '#F6F6F6',
                    color: '#000',
                    alignItems: 'center'
                },

                supportIntroContainer: {
                    color: '#000',
                    width: '50%',

                    alignItems: 'center',
            },
            headerDescription: {
                    fontSize: 24,
                    color: '#000',
                    // width: '50%',
                    alignSelf: 'center',
                    textAlign: 'center'
            },
            messengersContainer: {
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 360,
                alignItems: 'center',
                marginTop: 50,

            },
            messenger: {
                alignItems: 'center',
            },
            messengerTitle: {
                color: '#4A4A4A',
                fontSize: 32,
                marginLeft: 10,
            },
            messengerDescription: {
                marginTop: 15,
                alignItems: 'center',
                flexDirection: 'row',
            },
            messengerQrCode: {
                width: 280,
                height: 280,
            },
            timer: {
                position: 'absolute',
                alignSelf: 'flex-end',
                flexDirection: 'row',
                alignItems:'center',
                marginBottom: commonTheme.bottomArea.height,
                bottom: 0,
                padding: 25,
            },
})
