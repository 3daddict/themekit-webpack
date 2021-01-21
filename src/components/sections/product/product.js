import {post} from '../../helpers/cart-fetch-api/cart-fetch-api';

document.getElementById('AddToCartForm').onsubmit = async function (event) {
    const btn = document.getElementById('AddToCartBtn');
    const id = document.getElementById('AddToCartBtn').value;
    const option1 = document.getElementById('option1').value;
    const option2 = document.getElementById('option2').value;
    const qty = document.getElementById('counterQty').value;

    event.preventDefault();
    const response = await post('add.js', {id, option1, option2, qty});
    
    if(response) {
        btn.textContent = 'ITEM ADDED';
    }
    return false;
};