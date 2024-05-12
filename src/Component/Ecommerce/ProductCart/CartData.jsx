import React, { Fragment, useContext } from 'react';
import { Table, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { XCircle } from 'react-feather';
import CartContext from '../../../_helper/ecommerce/cart';
import ProductContext from '../../../_helper/ecommerce/product';
import { getCartTotal } from '../../../Services/Ecommerce.Service';
import { Btn, H6, Image } from '../../../AbstractElements';
import { Apply, CartTableHeader, CheckOut, ContinueShopping, TotalPrice } from '../../../Constant';
import EmptyCart from './EmptyCart';

const CartData = () => {
  const { symbol } = useContext(ProductContext);
  const { addToCart, cart, decrementQty, removeFromCart } = useContext(CartContext);
  const incrementQty = (product, quantity) => {
    addToCart(product, quantity);
  };
  const decrementQuantity = (id) => {
    decrementQty(id);
  };
  const removefromcart = (item) => {
    removeFromCart(item.id);
  };
  var images = require.context('../../../assets/images', true);
  const dynamicImage = (image) => {
    return images(`./${image}`);
  };
  return (
    <Fragment>
      {cart && cart.length > 0 ? (
        <div className="order-history table-responsive wishlist">
          <Table className="table-bordered">
            <thead>
              <tr>
                {CartTableHeader.map((items, i) =>
                  <th key={i}>{items}</th>
                )}
              </tr>
            </thead>
            <tbody style={{ borderTop: 'none' }}>
              {
                cart.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <Image attrImage={{ className: 'img-fluid img-40', src: `${dynamicImage(item.img)}`, alt: '#' }} />
                      </td>
                      <td><div className="product-name">
                        <a href="#javascript">{item.name}</a></div></td>
                      <td>{item.price}</td>
                      <td>
                        <div className="input-group qty-box">
                          <span className="input-group-prepend">
                            <Btn attrBtn={{
                              color: 'primary', className: 'bootstrap-touchspin-down',
                              onClick: () => decrementQuantity(item.id)
                            }}>
                              <i className="fa fa-minus"></i></Btn>
                          </span>
                          <Input type="text" name="quantity" value={item.qty}
                            readOnly={true} style={{ textAlign: 'center' }}
                            className="form-control input-number" />
                          <span className="input-group-append">
                            <Btn attrBtn={{ color: 'primary', className: '', onClick: () => incrementQty(item, 1) }}>
                              <i className="fa fa-plus"></i></Btn> </span>
                        </div>
                      </td>
                      <td>
                        <a href='#javascript' onClick={() => removefromcart(item)}><XCircle /></a></td>
                      <td>{symbol}{item.price * item.qty}</td>
                    </tr>
                  );
                })
              }
              <tr>
                <td colSpan="4">
                  <div className="input-group">
                    <Input className="form-control me-2" type="text" placeholder="Enter coupan code" />
                    <a className="btn btn-primary" href="#javascript">{Apply}</a>
                  </div>
                </td>
                <td className="total-amount">
                  <H6 attrH6={{ className: 'm-0 text-end' }}>
                    <span className="f-w-600">{TotalPrice} :</span></H6>
                </td>
                <td><span>{getCartTotal(cart)}</span></td>
              </tr>
              <tr>
                <td className="text-end" colSpan="5">
                  <Link to={`${process.env.PUBLIC_URL}/ecommerce/product`} className="btn btn-secondary cart-btn-transform">{ContinueShopping}</Link></td>
                <td>
                  <Link className="btn btn-success cart-btn-transform" to={`${process.env.PUBLIC_URL}/ecommerce/checkout`}>{CheckOut}</Link></td>
              </tr>
            </tbody>
          </Table>
        </div>
      ) : <EmptyCart />}
    </Fragment>
  );
};
export default CartData;