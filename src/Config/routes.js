const routes = {
  base: "/",
  home: "/home",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  user: "/user",
  zapFeed: "/zap-feed",
  invoicing: "/invoicing",
  campaigns: "/campaigns",
  search: "/search",
  trackers: "/search/trackers",
  blitzpay: "/blitzpay",
  addCreators: "/add-creators/:campaignId",
  resources: "/resources",
  about: "/about",
  creatorSignup: "/creatorsignup",
  company: "/company",
  campaignReport: "/campaigns/:campaignId",
  creatorMediaKit: "/creators/:creatorId",
  roster: "/roster/:manager", // New route for the AgencyCreatorRoster component
  creatorConnect: "/creatorconnect/:creator",

};

export default routes;
