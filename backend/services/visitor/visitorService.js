const Visitor = require("../../models/visitor");

const recordVisitor = async ({ visitorId, ip, country, device, browser }) => {
  const existingVisitor = await Visitor.findOne({ visitorId });

  if (existingVisitor) {
    existingVisitor.visitCount += 1;
    existingVisitor.lastVisit = new Date();
    await existingVisitor.save();
    return {};
  }

  const visitor = new Visitor({
    visitorId,
    ip,
    country,
    device,
    browser,
    visitCount: 1,
    lastVisit: new Date(),
  });
  await visitor.save();

  return {};
};

module.exports = { recordVisitor };