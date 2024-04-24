import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PageTitle from './Components/PageTitle.js'; // Adjust the import path as needed

import Main from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Login/Register";
import Dashboard from "./Pages/Dashboard/dashboard/dashboard.js";
import User from "./Pages/Dashboard/user.js";
import Invoicing from "./Pages/Dashboard/invoicing/invoicing.js";
import Campaigns from "./Pages/Dashboard/Campaigns/campaigns";
import Search from "./Pages/Dashboard/Search/search";
import Trackers from "./Pages/Dashboard/Trackers/trackers.js";
import CreatorSignup from "./Pages/Home/auxLinks/creatorSignup.js";
import BlitzPay from "./Pages/BlitzPay/blitzpay.js";
import AddCreators from "./Pages/Dashboard/Campaigns/addCreators.js"; // Adjust the path as necessary
import routes from "./Config/routes.js";
import PrivateRoute from "./Lib/private-route.js";
import CompanyList from "./Pages/Dashboard/Company/index.js";
import CampaignDetailsPage from './Pages/Dashboard/Campaigns/individualcampaigns/campaignDetailsPage.js'; // Adjust the path as needed
import CreatorDetailsPage from "./Pages/Dashboard/Creators/creatorDetailsPage.js";
import AgencyCreatorRoster from './Pages/Dashboard/Creators/agency/agencypage.js';
import CreatorConnect from './CreatorUser/CreatorPages/creatorConnect.js';
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

const Home = React.lazy(() => import("./Pages/Home/Home"));

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path={routes.base} element={<Navigate to={routes.home} />} />
          <Route path={routes.home} element={<><PageTitle title="Home - Blitz" /><Main><Home /></Main></>} />
          <Route path={routes.login} element={<><PageTitle title="Login - Blitz" /><Login /></>} />
          <Route path={routes.register} element={<><PageTitle title="Register - Blitz" /><Register /></>} />
          <Route path={routes.creatorSignup} element={<><PageTitle title="Creator Signup - Blitz" /><CreatorSignup /></>} />
          <Route path={routes.creatorConnect} element={<><PageTitle title="Creator Connect - Blitz" /><CreatorConnect /></>} />
          <Route path={routes.campaignReport} element={<><PageTitle title="Campaign Details - Blitz" /><CampaignDetailsPage /></>} />
          <Route path={routes.creatorMediaKit} element={<><PageTitle title="Creator Media Kit - Blitz" /><CreatorDetailsPage /></>} />
          <Route path={routes.roster} element={<AgencyCreatorRoster />} />  {/* New Route */}

          <Route path="*" element={<><PageTitle title="404 Not Found - Blitz" /><Navigate to={routes.home} /></>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
