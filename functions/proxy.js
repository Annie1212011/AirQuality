const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  // Get parameters from query string
  const { gsid, payload } = event.queryStringParameters || {};
  
  if (!gsid || !payload) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing required parameters" })
    };
  }
  
  try {
    // Decode the payload
    const decodedPayload = decodeURIComponent(payload);
    console.log("GSID:", gsid);
    console.log("Payload:", decodedPayload);
    
    // Forward the request to Google Scripts
    const response = await fetch(`https://script.google.com/macros/s/${gsid}/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: decodedPayload
    });
    
    const data = await response.text();
    console.log("Response from Google:", data);
    
    return {
      statusCode: 200,
      headers,
      body: data
    };
  } catch (error) {
    console.error("Error:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
