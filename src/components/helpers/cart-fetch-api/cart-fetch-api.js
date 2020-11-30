// ref: https://shopify.dev/docs/themes/ajax-api/reference/cart
const base = '/cart';

function send({method, path, data}) {

	const fetch = require('node-fetch').default;

	const opts = {method, headers: {}};

	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	return fetch(`${base}/${path}`, opts)
		.then(res => res.text())
		.then(json => {
			try {
				return JSON.parse(json);
			} catch (err) {
				return json;
			}
		});
}

export function get(path) {
	return send({method: 'GET', path});
}

export function del(path) {
	return send({method: 'DELETE', path});
}

export function post(path, data) {
	return send({method: 'POST', path, data});
}

export function put(path, data) {
	return send({method: 'PUT', path, data});
}

// const fetch = require('node-fetch');

// // Add items to cart
// const addToCart = async (formData) => {
//   await fetch('/cart/add.js', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(formData)
//     })
//     .then(response => {
//       return response.json();
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
// };

// // export to global variables
// global.addToCart = addToCart;