var registerCustomElement = require('@dojo/framework/core/registerCustomElement').default;

function useDefault(p) {
	return p.then(function (r) {
		return r.default;
	});
}


