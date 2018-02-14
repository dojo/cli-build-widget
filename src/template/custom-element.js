var registerCustomElement = require('@dojo/widget-core/registerCustomElement').default;

var defaultExport = widgetFactory.default;
defaultExport && registerCustomElement(defaultExport);
