import { API_ENDPOINTS } from "./endpoints";
import { HttpClient } from "./http-client";

class Client {
  users = {
    login: (input) => HttpClient.post(API_ENDPOINTS.USERS_LOGIN, input),
    register: (input) => HttpClient.post(API_ENDPOINTS.USERS_REGISTER, input),
    fetchUser: () => HttpClient.get(API_ENDPOINTS.FETCH_USER),
  };

  campaigns = {
    launch: (input) => HttpClient.post(API_ENDPOINTS.LAUNCH_CAMPAIGN, input),
    sendPostingInstructions: (input) =>
      HttpClient.post(API_ENDPOINTS.SEND_POSTING_INSTRUCTIONS, input),
    list: () => HttpClient.get(API_ENDPOINTS.CAMPAIGNS),
    listAdmin: () => HttpClient.get(API_ENDPOINTS.CAMPAIGNS_ADMIN),
    create: (input) => HttpClient.post(API_ENDPOINTS.CAMPAIGNS, input),
    fetch: (input) => HttpClient.get(`${API_ENDPOINTS.CAMPAIGNS}${input}`),
    update: (input) => HttpClient.post(API_ENDPOINTS.UPDATE_CAMPAIGN, input),
    updateCreatorList: (input) =>
      HttpClient.post(API_ENDPOINTS.UPDATE_CREATOR_LIST, input),
    updateCreatorDetails: (input) =>
      HttpClient.post(API_ENDPOINTS.UPDATE_CREATOR_DETAILS, input),
    removeCreators: (input) =>
      HttpClient.post(API_ENDPOINTS.REMOVE_CREATORS, input),
    updateCreatorPrices: (input) =>
      HttpClient.post(API_ENDPOINTS.UPDATE_CREATOR_PRICES, input),
    updateCampaignSum: (input) =>
      HttpClient.post(API_ENDPOINTS.UPDATE_CAMPAIGN_SUM, input),
    updateLinksCodes: (input) =>
      HttpClient.post(API_ENDPOINTS.UPDATE_LINKS_CODES, input),
    complete: (input) =>
      HttpClient.post(
        `${API_ENDPOINTS.COMPLETE_CAMPAIGN}/${input.index}`,
        input.params
      ),
    delete: (input) => HttpClient.post(API_ENDPOINTS.DELETE_CAMPAIGN, input),
    generateReport: (input) =>
      HttpClient.post(API_ENDPOINTS.GENERATE_REPORT, input),
    editAdmin: (input) =>
      HttpClient.post(API_ENDPOINTS.EDIT_CAMPAIGN_ADMIN, input),
    deleteCampaignAdmin: (input) =>
      HttpClient.post(API_ENDPOINTS.DELETE_CAMPAIGN_ADMIN, input),
    fetchAdmin: (input) => HttpClient.get(`${API_ENDPOINTS.CAMPAIGNS}${input}`),
  };

  payouts = {
    list: () => HttpClient.get(API_ENDPOINTS.PAYOUTS),
    create: (input) => HttpClient.post(API_ENDPOINTS.PAYOUTS, input),
    delete: (input) => HttpClient.post(API_ENDPOINTS.PAYOUT_DELETE, input),
    listAdmin: () => HttpClient.get(API_ENDPOINTS.PAYOUTS_ADMIN),
    deleteAdmin: (input) => HttpClient.post(API_ENDPOINTS.DELETE_PAYOUTS_ADMIN, input),
  };

  creators = {
    list: () => HttpClient.get(API_ENDPOINTS.CREATORS),
    add: (input) => HttpClient.post(API_ENDPOINTS.CREATOR_ADD, input),
    payout: (input) =>
      HttpClient.get(API_ENDPOINTS.CREATOR_PAYOUT_READ, { sheetId: input }),
    data: () => HttpClient.get(API_ENDPOINTS.CREATOR_DATA_READ),
    fetchDetails: (creatorId) => {
      const url = `${API_ENDPOINTS.CREATORS_SPEC}${creatorId}`;
      console.log(`Fetching creator details from: ${url}`);
      return HttpClient.get(url);
    },
      };

  invoices = {
    list: () => HttpClient.get(API_ENDPOINTS.INVOICES),
    delete: (input) => HttpClient.post(API_ENDPOINTS.DELETE_INVOICE, input),
    listAdmin: () => HttpClient.get(API_ENDPOINTS.INVOICES_ADMIN),
    editAdmin: (input) =>
      HttpClient.post(API_ENDPOINTS.EDIT_INVOICES_ADMIN, input),
    create: (input) => HttpClient.post(API_ENDPOINTS.CREATE_INVOICE, input),

  };
  
  companies = {
    list: () => HttpClient.get(API_ENDPOINTS.COMPANY),
    create: (input) => HttpClient.post(API_ENDPOINTS.COMPANY, input),
    delete: (input) => HttpClient.post(API_ENDPOINTS.DELETE_COMPANY, input),
    edit: (input) =>
      HttpClient.post(
        `${API_ENDPOINTS.COMPANY}/${input.companyId}`,
        input.params
      ),
    listFetch: () => HttpClient.get(API_ENDPOINTS.FETCH_COMPANY_DATA),
  };
}

export default new Client();
