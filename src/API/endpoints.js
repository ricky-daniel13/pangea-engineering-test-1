export const API_ENDPOINTS = {
  USERS_LOGIN: "/login",
  FETCH_USER: "/userinfo",
  USERS_REGISTER: "/register",
  LAUNCH_CAMPAIGN: "/campaign_handler/launch_campaign",
  SEND_POSTING_INSTRUCTIONS: "/campaign_handler/sendPostingInstructions",
  CAMPAIGNS: "/campaigns/",
  CAMPAIGNS_ADMIN: "/admin/campaigns",
  UPDATE_CREATOR_LIST: "/campaigns/updateCreatorList",
  UPDATE_CREATOR_DETAILS: "/campaigns/updateCreatorDetails",
  REMOVE_CREATORS: "/campaigns/removeCreators",
  UPDATE_CREATOR_PRICES: "/campaigns/updateCreatorPrices",
  UPDATE_CAMPAIGN_SUM: "/campaigns/updateCampaignSum",
  UPDATE_LINKS_CODES: "/campaigns/updateLinksAndCodes",
  UPDATE_CAMPAIGN: "/campaigns/updateStatus",
  DELETE_CAMPAIGN: "/campaigns/delete",
  COMPLETE_CAMPAIGN: "/campaigns/completeCampaign",
  GENERATE_REPORT: "/campaigns/generate_report",
  PAYOUTS: "/payouts",
  PAYOUT_DELETE: "/payouts/delete",
  CREATOR_PAYOUT_READ: "/sheets/creatorPayoutInfo/read",
  CREATOR_DATA_READ: "/sheets/creatorData/read",
  CREATOR_ADD: "/creators/add",
  INVOICES: "/invoices",
  CREATORS: "/creators", // Make sure this ends with a slash if you are appending IDs
  CREATORS_SPEC: "/creators/", // Make sure this ends with a slash if you are appending IDs
  COMPANY: "/company",
  DELETE_COMPANY: "/company/delete",
  FETCH_COMPANY_DATA: "/company/companydata",
  EDIT_CAMPAIGN_ADMIN: "/admin/campaign/edit",
  DELETE_CAMPAIGN_ADMIN: "/admin/campaign/delete",
  INVOICES_ADMIN: "/admin/invoices",
  PAYOUTS_ADMIN: "/admin/payouts",
  DELETE_PAYOUTS_ADMIN: "/admin/payouts/delete",
  DELETE_INVOICE: "/invoices/delete",
  CREATE_INVOICE: "/invoices/create",
  EDIT_INVOICES_ADMIN: "/admin/invoice/edit", // Ensure this matches your Flask route
};
