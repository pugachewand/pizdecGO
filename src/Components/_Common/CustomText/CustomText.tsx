import { Text } from "react-native";

export const CustomText = (props:any) => <Text {...props} style={[{fontFamily: 'Montserrat-Regular'}, props.style]}>{props.children}</Text>
