import {StyleSheet} from 'react-native'

import {globalContext} from '../../DependencyInjection/AppContext'

const commonTheme = globalContext.theme.value

export const InitialPurchaseStyles = StyleSheet.create({
  wrap: {flex: 1},
  container: {
    backgroundColor: commonTheme.colors.default,
    width: '100%',
    flex: 1,
    color: '#000',
    marginBottom: commonTheme.bottomArea.height,
  },
  greetingsContainer: {
    flex: 0.4,
    color: '#000',
    alignItems: 'center',
  },
  greetingsTitle: {
    fontSize: 36,
    color: '#000',
  },
  greetingsDescription: {
    color: '#000',
    fontSize: 24,
  },
  usageGuide: {
    flex: 1,
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usageGuideInner: {
    alignItems: 'center',
    width: 250,
  },
  usageGuideInnerTop: {
    marginTop: 30,
  },
  usageGuideInnerText: {
    textAlign: 'center',
    fontSize: 24,
    width: '95%',
    color: '#000',
    marginTop: 18,
  },
  ArrowIcon: {
    marginBottom: 80,
    borderWidth: 5,
    borderColor: 'red',
  },
  QrCodeForAppContainer: {
    flex: 0.5,
    flexDirection: 'row',
    marginLeft: 30,
    marginTop: 60,
    marginBottom: 10,
    alignItems: 'center',
  },
  QrCode: {
    width: 100,
    height: 100,
  },
  QrCodeDescription: {
    color: '#000',
    width: 240,
    fontSize: 20,
    marginLeft: 30,
  },
})
