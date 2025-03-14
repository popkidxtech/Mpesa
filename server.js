// server.js (Node.js with Express)
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // For making HTTP requests to M-Pesa API
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/mpesa_transaction', async (req, res) => {
  const { phoneNumber, amount } = req.body;

  try {
    // 1. Authenticate with M-Pesa API (Obtain access token)
    // Replace with your actual M-Pesa API credentials
    const accessToken = await getAccessToken();

    // 2. Initiate STK push (Sim Toolkit push)
    const mpesaResponse = await axios.post(
      'YOUR_MPESA_STK_PUSH_URL', // Replace with your actual M-Pesa API URL
      {
        BusinessShortCode: 'YOUR_BUSINESS_SHORTCODE',
        Password: 'YOUR_PASSWORD',
        Timestamp: getTimestamp(),
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: 'YOUR_BUSINESS_SHORTCODE',
        PhoneNumber: phoneNumber,
        CallBackURL: 'YOUR_CALLBACK_URL',
        AccountReference: 'YourAccountRef',
        TransactionDesc: 'Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 3. Handle M-Pesa response (check for success)
    if (mpesaResponse.data.ResponseCode === '0') {
      res.json({ success: true, message: "STK push initiated." });
    } else {
      res.json({ success: false, message: mpesaResponse.data.ResponseDescription });
    }
  } catch (error) {
    console.error("M-Pesa error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

async function getAccessToken(){
    //Replace with your actual authentication logic.
    //Use consumer key and secret to get the access token.
    return "YOUR_ACCESS_TOKEN";
}

function getTimestamp(){
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    const second = ("0" + date.getSeconds()).slice(-2);
    return year + month + day + hour + minute + second;
}

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

