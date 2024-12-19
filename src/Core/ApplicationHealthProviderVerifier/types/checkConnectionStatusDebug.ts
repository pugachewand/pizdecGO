import Config from 'react-native-config';

export const checkConnectionStatusDebug = (!Config.DEBUG_MODE || Config.DEBUG_MODE === 'false') && (!Config.CHECK_DEVICES_ON_INITIALIZATION || Config.CHECK_DEVICES_ON_INITIALIZATION === 'true')
