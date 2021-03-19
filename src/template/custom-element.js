var registerCustomElement = require('@dojo/framework/core/registerCustomElement').default;

var bootstrap = document.querySelector('script[src*="bootstrap"]');
if (bootstrap) {
	__webpack_public_path__ = bootstrap.src.replace(/bootstrap.*/, '');
	console.log(__webpack_public_path__, bootstrap)
}

function useDefault(p) {
	return p.then(function (r) {
		return r.default;
	});
}


