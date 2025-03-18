const Visitor = require("../../models/visitor");

const getVisitorList = async () =>{
  return Visitor.find().sort({lastVisit: -1}).select("visitorId visitCount lastVisit ipHistory device browser");
}

const recordVisitorInfo = async ({ visitorId, ip, country, device, browser }) => {
  const existingVisitor = await Visitor.findOne({ visitorId });

  if (existingVisitor) {
    existingVisitor.visitCount += 1;
    existingVisitor.lastVisit = new Date();

    const lastIpEntry = existingVisitor.ipHistory[existingVisitor.ipHistory.length - 1];
    if (!lastIpEntry || lastIpEntry.ip !== ip) {
      existingVisitor.ipHistory.push({ ip, changedAt: new Date() });
    }

    await existingVisitor.save();
    return null;
  }

  const visitor = new Visitor({
    visitorId,
    ipHistory: [{ ip, changedAt: new Date() }],
    country,
    device,
    browser,
    visitCount: 1,
    lastVisit: new Date(),
  });

  await visitor.save();
  return null;
};

module.exports = { getVisitorList ,recordVisitorInfo };