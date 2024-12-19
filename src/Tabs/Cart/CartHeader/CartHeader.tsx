import { View } from 'react-native';

import { CustomText } from '../../../Components/_Common/CustomText/CustomText';
import { GlobalStyles } from '../../GlobalStyles';
import React from 'react';
import { cartStyles } from '../Carts.Styles';
import { observer } from 'mobx-react';
import { globalContext } from '../../../DependencyInjection/AppContext';

@observer
export class CartHeader extends React.Component {
	private i18n = globalContext.preferences.value.i18n.cart

  render() {
    return (
      <View style={cartStyles.headerContainer}>
        <View style={cartStyles.headerInner}>
            <CustomText style={GlobalStyles.headerTitle}>{this.i18n.value.cartHeader.title}</CustomText>
            <CustomText style={GlobalStyles.headerDescription}>{this.i18n.value.cartHeader.description}</CustomText>
        </View>
       </View>
    );
  }
}
