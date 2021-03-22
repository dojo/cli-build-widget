var registerCustomElement = require('@dojo/framework/core/registerCustomElement').default;

var entryName = __ENTRY__;
var namespace = null;
var entry = document.querySelector('script[src*="' + entryName + '"]');
if (entry) {
	__webpack_public_path__ = entry.src.replace(new RegExp(entryName + '.*'), '');
	namespace = entry.getAttribute('namespace');
}

function useDefault(p) {
	return p.then(function (r) {
		return r.default;
	});
}

function useNamespace(tagName) {
	if (namespace) {
		return namespace + '-' + tagName;
	}
	return tagName;
}


