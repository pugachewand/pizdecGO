import { StyleSheet } from 'react-native'

import { globalContext } from '../../../DependencyInjection/AppContext'

const commonTheme = globalContext.theme.value

export const ItemsTableStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paddingTop: {
    paddingTop: 40,
  },
  head: {
    height: 40,
    color: '#000',
    position: 'absolute',
    fontSize: 26,
    bottom: 150,
    marginLeft: 20,
  },
  text: {
    color: commonTheme.colors.backgroundColor,
    fontSize: 24,

  },
  textCount: {
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 23,
    paddingRight: 21,
    borderWidth: 2,
    borderRadius: 8,
    marginRight: 15,
    marginLeft: 15,
  },
  iconHeader:{
    width: 10
  },
  rowHeader: {
    flexDirection: 'row',
    width: '65%',
    justifyContent: 'space-between',
    alignSelf:'center',
    marginBottom: 10,
  },
  rowItemHeader: {
  },
  textHeader: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 26,
    fontWeight: '600',
    color: commonTheme.colors.backgroundColor
  },
  row: {
    flexDirection: 'row',
    marginRight: 20,
    marginLeft: 20,
    width: '90%',
    alignSelf: 'center',
  },
  rowItem: {
    flex: 1,
    borderRightWidth: 1,
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 30,
  },
  rowItemPrice: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    paddingTop: 25,
  },
  rowItemIcon: {
    flex: 0.25,
    borderRightWidth: 1,
    padding: 10,
    height: 'auto',

  },
  rowItemCount: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 30,
    flex: 0.5,
  },
  rowItemDelete: {
    flex: 0.5,
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 30,
  },

  priceStrikethrough: {
    color: commonTheme.colors.backgroundColor,
    fontSize: 24,
    textDecorationLine: 'line-through',
    marginRight: 20,
  },

  itemIcon: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 65,
		height: 65,
		borderRadius: 100,
    alignSelf: 'flex-end',
    marginRight: 20,
    borderWidth: 2,
    borderColor: commonTheme.colors.darkBackground,
    overflow: 'hidden',
		backgroundColor: commonTheme.colors.darkBackground,
	},

	itemIconImage: {
		width: 65,
		height: 65,
	},

  defaultAddProduct: {
    marginHorizontal: "auto",
    textAlign: 'center',
    marginTop: -10,
    fontSize: 32,
  },

  emptyListContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
},
  dotLoaderBlock: {
    width: '100%',
    height: '90%',
    marginBottom: 0,
  },
  loaderText: {
    fontSize: 24,
    marginTop: 0,
    color: commonTheme.colors.secondary,
    textAlign: 'center',
  },
  loaderAddItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    height: 85,
    display: 'flex',
    alignItems: 'center',
  },
  loaderAddItems: {
    position: 'absolute',
    bottom: 0,
    left: 50,
  },
  loaderDeleteItem: {
    width: 65,
    height: 65,
    borderRadius: 100,
    backgroundColor: commonTheme.colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
  },
})
