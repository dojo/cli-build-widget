var registerCustomElement = require('@dojo/framework/core/registerCustomElement').default;

var entryName = __ENTRY__;
var entry = document.querySelector(`script[src*="${entryName}"]`);
if (entry) {
	__webpack_public_path__ = entry.src.replace(new RegExp(`${entryName}.*`), '');
}

function useDefault(p) {
	return p.then(function (r) {
		return r.default;
	});
}


