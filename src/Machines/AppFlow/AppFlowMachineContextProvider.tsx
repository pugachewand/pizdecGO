import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useMachine} from '@xstate/react';
import {AppFlowMachine, AppFlowMachineContext} from './AppFlowMachine';

function AppFlowMachineContextProvider({children}: {children: React.ReactNode}): JSX.Element {
  const navigation = useNavigation();
  const [state, send, service] = useMachine(AppFlowMachine);

  useEffect(() => {
    const subscription = service.subscribe(state => {
      navigation.navigate(state.value);
    });

    return subscription.unsubscribe;
  }, [service, navigation]);

  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, [service, navigation]);

  return (
    <AppFlowMachineContext.Provider value={[state, send, service]}>
      {children}
    </AppFlowMachineContext.Provider>
  );
}

export default AppFlowMachineContextProvider;