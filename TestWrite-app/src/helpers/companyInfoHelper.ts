const companyName = "TestWrite-app";
const domainName = "testwrite-app.nl";
const emailAdresses = {
  standard: "info",
  support: "info",
  customerSupport: "info"
};

export const companyInfoHelper = {
  companyName: companyName,
  standardEmail: `${emailAdresses.standard}@${domainName}`,
  supportEmail: `${emailAdresses.support}@${domainName}`,
  customerSupportEmail: `${emailAdresses.customerSupport}@${domainName}`
};
