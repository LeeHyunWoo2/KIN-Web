const Visitor = require("../../models/visitor");

const recordVisitor = async ({ visitorId, ip, country, device, browser }) => {
  const existingVisitor = await Visitor.findOne({ visitorId });
  if (existingVisitor) return {};

  const visitor = new Visitor({ visitorId, ip, country, device, browser });
  await visitor.save();

  return {};
};

module.exports = { recordVisitor };