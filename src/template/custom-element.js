var registerCustomElement = require('@dojo/framework/core/registerCustomElement').default;

var defaultExport = widgetFactory.default;
defaultExport && registerCustomElement(defaultExport);
