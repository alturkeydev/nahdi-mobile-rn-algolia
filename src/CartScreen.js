import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  FlatList,
  Button,
  TouchableHighlight,
} from 'react-native';
import { Icon, Overlay, Card } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import CartItem from './CartItem';
import ProductCard from './ProductCard';

class CartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: this.props.cart,
      products: this.props.cart.products,
      total: this.props.cart.total.toFixed(2),
      vat: (this.props.cart.total * 0.15).toFixed(2),
      grand: (this.props.cart.total + this.props.cart.total * 0.15).toFixed(2),
      numOfProducts: this.props.cart.products.length,
      qty: this.props.cart.qty,
    };
  }

  updateCart = (qty, name, price) => {
    if (this.state.cart.products.length === 1) {
      this.clearCart();
      return;
    }
    const temp = this.state.cart.qty - qty;
    temp < 0 ? (this.state.cart.qty = 0) : (this.state.cart.qty = temp);

    let newProducts = [];
    for (let i = 0; i < this.state.cart.products.length; i++) {
      if (this.state.cart.products[i].name !== name) {
        newProducts.push(this.state.cart.products[i]);
      }
    }
    const updatedTotal =
      this.state.cart.total -
      parseFloat(price.replace(/[^0-9, ., ]/g, '').trim()) * qty;
    this.state.cart.total = updatedTotal < 0 ? 0 : updatedTotal;
    this.state.cart.products = newProducts;
    this.setState({
      products: newProducts,
      total: updatedTotal.toFixed(2),
      vat: (updatedTotal * 0.15).toFixed(2),
      grand: (updatedTotal + updatedTotal * 0.15).toFixed(2),
    });
  };

  clearCart = () => {
    this.props.cart.qty = 0;
    this.props.cart.indices = 0;
    this.props.cart.total = 0;
    this.props.cart.products = [];
    this.setState({ products: [] });
    this.forceUpdate();
  };

  render() {
    // Get it from props
    const { navigation, cart } = this.props;

    if (this.state.cart.qty === 0)
      return (
        <View style={styles.imgContainer}>
          <Image
            style={{ width: 250, height: 250 }}
            resizeMode={'contain'}
            source={require('../assets/images/empty_cart.png')}
          />
        </View>
      );

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.products}
          extraData={this.state.products}
          keyExtractor={item => item.index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <CartItem
              navigation={navigation}
              cart={cart}
              product={item}
              updateCart={this.updateCart}
            />
          )}
          extraData={this.state.products}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
        <View style={{ padding: 20 }}>
          <Text style={{ color: '#278585', fontSize: 20 }}>Basket Summary</Text>
          <Text
            style={{
              paddingLeft: 5,
              fontSize: 14,
              fontStyle: 'italic',
              color: '#90A4AE',
            }}
          >
            Total Items {this.state.numOfProducts}
          </Text>
          <Text
            style={{
              paddingLeft: 5,
              fontSize: 14,
              fontStyle: 'italic',
              color: '#90A4AE',
            }}
          >
            Total Quantity {this.state.qty}
          </Text>
        </View>
        <TouchableHighlight
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#278585',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          underlayColor="#90A4AE"
          activeOpacity={0.6}
          onPress={() => {
            // Toast.show({
            //   text1: 'Success',
            //   text2: `We'll' deliver your order soon and with ❤️.`,
            //   visibilityTime: 2000,
            //   position: 'bottom',
            //   bottomOffset: 60,
            // });
            // this.clearCart();
            navigation.navigate('COutView', { cart: cart });
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Icon
              name="credit-card"
              type="font-awesome"
              color="#fff"
              size={30}
            />
            <Text
              style={{
                color: '#fff',
                fontSize: 22,
                fontWeight: 'bold',
                marginLeft: 20,
              }}
            >
              Checkout
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  imgContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 40,
    width: 270,
    borderRadius: 20,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    paddingRight: 20,
    backgroundColor: '#fff',
    color: '#278585',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#fff',
  },
});

// Wrap and export
export default function(props) {
  const navigation = useNavigation();

  return <CartScreen {...props} navigation={navigation} />;
}
