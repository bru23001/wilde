/*!
 * Webflow Currency Configuration
 * Sets up currency display settings for the commerce system
 */
window.__WEBFLOW_CURRENCY_SETTINGS = {
  currencyCode: "USD",
  symbol: "$",
  decimal: ".",
  fractionDigits: 2,
  group: ",",
  template:
    '{{wf {"path":"symbol","type":"PlainText"} }} {{wf {"path":"amount","type":"CommercePrice"} }} {{wf {"path":"currencyCode","type":"PlainText"} }}',
  hideDecimalForWholeNumbers: false,
};
