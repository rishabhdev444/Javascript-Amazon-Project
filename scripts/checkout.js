import {cart,removeFromCart,calculateCartQuantity,updateQuantity} from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { hello } from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

// hello();

// const today=dayjs();
// const deliveryDate=today.add(7,'days');
// console.log(deliveryDate.format('dddd, MMMM D'));

let cartSummaryHtml='';

cart.forEach((cartItem)=>{
    const productId=cartItem.productId;

    let matchingProduct;

    products.forEach((product)=>{
        if(product.id===productId){
            matchingProduct=product;
        }
    });

    const deliveryOptionId=cartItem.deliveryOptionId;
    let deliveryOption;

    deliveryOptions.forEach((option)=>{
      if(option.id===deliveryOptionId){
        deliveryOption=option;
      }
    });

    const today=dayjs();
    const deliveryDate=today.add(deliveryOption.deliveyDays,'days');
    const dateString=deliveryDate.format('dddd, MMMM D');

    cartSummaryHtml+=`
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: ${dateString}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
          </span>

          <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
            Update
          </span>
          <input class="quantity-input js-quantity-input-${matchingProduct.id}">
          <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>

          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
          ${deliveryOptionHtml(matchingProduct,cartItem)}
      </div>
    </div>
  </div>
    `
});

function deliveryOptionHtml(matchingProduct,cartItem){
  let html='';

  deliveryOptions.forEach((deliveryOption)=>{
    const today=dayjs();
    const deliveryDate=today.add(deliveryOption.deliveyDays,'days');
    const dateString=deliveryDate.format('dddd, MMMM D');
    const priceString=deliveryOption.priceCents===0?'FREE':`$${formatCurrency(deliveryOption.priceCents)} - `;
    const isChecked=deliveryOption.id===cartItem.deliveryOptionId;

      html+=`
      <div class="delivery-option">
        <input type="radio" ${isChecked?'checked':''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>`
  });
  return html;
}

function updateCartQuantity(){
    const cartQuantity=calculateCartQuantity();
   
    document.querySelector('.js-return-to-home-link').innerHTML=`${cartQuantity} items`;
}

updateCartQuantity();

document.querySelector('.js-order-summary').innerHTML=cartSummaryHtml;

document.querySelectorAll('.js-delete-link').forEach((link)=>{
    link.addEventListener('click',()=>{
        const productId=link.dataset.productId;
        removeFromCart(productId);

        const container=document.querySelector(`.js-cart-item-container-${productId}`);
        
        container.remove();
        updateCartQuantity();
    });

});

document.querySelectorAll('.js-update-link').forEach((link)=>{
    link.addEventListener('click',()=>{
        const productId=link.dataset.productId;
        const container=document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');
    });
});

document.querySelectorAll('.js-save-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove('is-editing-quantity');

      const quantityInput=document.querySelector(`.js-quantity-input-${productId}`);
      const newQuanity=Number(quantityInput.value);
      updateQuantity(productId,newQuanity);

      const quantityLabel=document.querySelector(`.js-quantity-label-${productId}`);
      quantityLabel.innerHTML=newQuanity;
      updateCartQuantity();
    });
  });