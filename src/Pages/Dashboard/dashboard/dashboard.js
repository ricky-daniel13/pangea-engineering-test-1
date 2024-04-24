/* Additional styling as before... */
import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../../../Components/Navbar/NavBar";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Typography, // For titles
  Grid,
} from "@mui/material";
import { useMutation } from "react-query";
import client from "../../../API";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useIsMounted } from "../../../Hooks/use-is-mounted";
import styled from 'styled-components';
import RecentUpdates from "./recentUpdates";
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
`;

const ContentContainer = styled.div`
  display: flex;
  margin-left: 16.5rem;
  max-width: 1650px;
`;

const LeftColumn = styled.div`
  flex: 0 0 70%;
  padding-right: 20px;
`;

const RightColumn = styled.div`
  flex: 0 0 30%;
  padding-left: 20px;
`;
const StyledTableHead = styled(TableHead)`
  background-color: #424242; // Darker background for headers
  & th {
    color: white; // White text for headers
  }
`;
const StyledGraphContainer = styled.div`
max-width: 600px; // Maximum width for graphs
margin: 20px;
overflow: hidden; // Prevent overflow
border-radius: 10px; // Rounded corners for graphs
`;

const RecentUpdatesBanner = styled.div`
  width: 100%; // Full width
  margin-bottom: 20px; // Space between updates and the rest of the content
  display: flex;
  margin-left: 16.5rem;
`;
const Dashboard = () => {
  const isMounted = useIsMounted();

  const [dataView, setDataView] = useState("campaigns");
  const [campaigns, setCampaigns] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [accountBalance, setAccountBalance] = useState("Loading...");
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    companyId: "",
  });
  const [companyname, setCompanyName] = useState("");
  const [creditline, setCreditline] = useState("Loading...");
  const [aggregateChartData, setAggregateChartData] = useState([]);

  // API call setup
  const fetchHandler = {
    campaigns: useMutation(client.campaigns.list, {
      onSuccess: (data) => setCampaigns(data),
      onError: (error) => console.error("Error fetching campaigns:", error),
    }),
    payouts: useMutation(client.payouts.list, {
      onSuccess: (data) => setPayouts(data.payouts || []),
      onError: (error) => console.error("Error fetching payouts:", error),
    }),
    invoices: useMutation(client.invoices.list, {
      onSuccess: (data) => setInvoices(data.invoices || []),
      onError: (error) => console.error("Error fetching invoices:", error),
    }),
  };

  // Load data based on the selected view
  useEffect(() => {
    if (isMounted) {
      fetchHandler[dataView].mutate();
    }
  }, [isMounted, dataView]);

  const handleDataViewChange = (event) => {
    setDataView(event.target.value);
  };

  const tableHeaders = {
    campaigns: ["Name", "Campaign Sum", "Creators", "Proposal Date", "Campaign Status"],
    payouts: ["Creator ID", "Amount", "Payout Date", "BlitzPay", "Status"],
    invoices: ["Campaign/Creator", "Amount Due", "Status"],  // Modified headers for invoices
  };

  const renderTableData = () => {
    const dataSets = { campaigns, payouts, invoices };
    const data = dataSets[dataView] || [];
    return data.map((item, index) => (
      <TableRow key={index}>
        {tableHeaders[dataView].map((header) => (
          <TableCell key={header}>{item[header.toLowerCase().replace(/\s/g, '_')]}</TableCell>
        ))}
      </TableRow>
    ));
  };
  

  const {
    mutate: fetchUserInfo,
    isError,
    error,
  } = useMutation(client.users.fetchUser, {
    onSuccess: (data) => {
      // Assuming the response structure is directly the data needed
      const { first_name, last_name, companyname } = data;
      setUserInfo({
        firstName: first_name,
        lastName: last_name,
      });
      setCompanyName(companyname);
    },
    onError: (error) => {
      console.error("Error fetching user or company info:", error);
    },
  });

  const { mutate: fetchCompanyData } = useMutation(client.companies.listFetch, {
    onSuccess: (data) => {
      // Assuming the response structure is directly the data needed
      if (data && data.balance != undefined && data.credit_line != undefined) {
        setAccountBalance(`$${parseFloat(data.balance).toFixed(2)}`);
        setCreditline(
          data.credit_line
            ? `$${parseFloat(data.credit_line).toFixed(2)}`
            : "No Credit Line Established"
        );
      } else {
        // Handle case where data is undefined or not as expected
        console.error("Received data is not in the expected format:", data);
        setAccountBalance("Data format error");
        setCreditline("Data format error");
      }
    },
    onError: (error) => {
      console.error("Error fetching company data:", error);
      setAccountBalance("Error loading balance");
      setCreditline("Error loading credit line");
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaignsData = await client.campaigns.list();
        const payoutsData = await client.payouts.list();
        const invoicesData = await client.invoices.list();

        setCampaigns(campaignsData);
        setPayouts(payoutsData.payouts || []);
        setInvoices(invoicesData.invoices || []);

        // Aggregate data for chart
        const combinedData = [...campaignsData, ...payoutsData.payouts, ...invoicesData.invoices]
          .map(data => ({
            date: new Date(data.proposal_date || data.payout_date || data.invoice_date).getTime(), // Normalize date
            value: data.campaign_sum || data.amount || data.amount_due // Assume similar data structure
          }))
          .sort((a, b) => a.date - b.date); // Sort by date

        setAggregateChartData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    isMounted && fetchUserInfo();
    fetchCompanyData();
  }, [isMounted]);
  useEffect(() => {
    if (isMounted) {
      client.users.fetchUser().then(setUserInfo).catch(console.error);
      client.companies.listFetch().then(data => {
        setAccountBalance(`$${parseFloat(data.balance).toFixed(2)}`);
      }).catch(console.error);
    }
  }, [isMounted]);

  const renderAggregateChart = () => (
    <StyledGraphContainer>
      <LineChart width={500} height={300} data={aggregateChartData}>
        <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
        <YAxis />
        <Tooltip labelFormatter={(label) => new Date(label).toLocaleDateString()} />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </StyledGraphContainer>
  );


  const renderYouTubeVideos = () => (
    <div>
      {/* Example embedding a YouTube video */}
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/watch?v=c71osU3gK64&ab_channel=TheCultureClub"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
  return (
    <DashboardContainer>
      <Navbar />
      <RecentUpdatesBanner>
          <RecentUpdates />
        </RecentUpdatesBanner>
      <ContentContainer>
      
      <LeftColumn>
          <Select value={dataView} onChange={handleDataViewChange}>
            <MenuItem value="campaigns">Campaigns</MenuItem>
            <MenuItem value="payouts">Payouts</MenuItem>
            <MenuItem value="invoices">Invoices</MenuItem>
          </Select>
          <Typography variant="h6">{userInfo.firstName} {userInfo.lastName}'s Dashboard - {companyname}</Typography>
          <Typography variant="h6">Account Balance: {accountBalance}</Typography>
          <Typography variant="h6">CreditLine Balance: {creditline}</Typography>

          <Table>
            <StyledTableHead>
              <TableRow>
                {tableHeaders[dataView].map(header => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>{renderTableData()}</TableBody>
          </Table>
        </LeftColumn>
        <RightColumn>
        <Typography variant="h6">Aggregate Usage</Typography>

          {renderAggregateChart()}
          <Typography variant="h6">Watch Tutorials</Typography>

          {renderYouTubeVideos()}
        </RightColumn>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
