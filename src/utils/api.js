// utils/api.js
import axios from "axios";
import CryptoJS from "crypto-js";
import { jwtDecode } from 'jwt-decode'

const API_URL = import.meta.env.VITE_API_URL;
const CONSUMER_KEY = import.meta.env.VITE_CONSUMER_KEY;
const CONSUMER_SECRET = import.meta.env.VITE_CONSUMER_SECRET;

const generateOAuthSignature = (url, method = "GET", params = {}) => {
  const nonce = Math.random().toString(36).substring(2);
  const timestamp = Math.floor(Date.now() / 1000);

  const oauthParams = {
    oauth_consumer_key: CONSUMER_KEY,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_version: "1.0",
  };

  const allParams = { ...params, ...oauthParams };

  const paramString = Object.keys(allParams)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
    .join("&");

  const baseUrl = url.split("?")[0];
  const baseString = `${method.toUpperCase()}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(CONSUMER_SECRET)}&`;

  const signature = CryptoJS.HmacSHA1(baseString, signingKey).toString(CryptoJS.enc.Base64);

  return { ...oauthParams, oauth_signature: encodeURIComponent(signature) };
};

const api = axios.create({
  baseURL: API_URL,
});

export const getAllProducts = async (queryParams = {}) => {
  try {
    const url = `${API_URL}/products`;
    const oauthParams = generateOAuthSignature(url, "GET", queryParams);

    const response = await api.get("/products", {
      params: { ...queryParams, ...oauthParams },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products: " + error.message);
  }
};

export const getCategories = async () => {
  try {
    const url = `${API_URL}/products/categories`;
    const oauthParams = generateOAuthSignature(url, "GET", {});

    const response = await api.get("/products/categories", {
      params: oauthParams,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    throw new Error("Failed to fetch categories");
  }
};


export const getProductById = async (productId) => {
  try {
    const url = `${API_URL}/products/${productId}`;
    const oauthParams = generateOAuthSignature(url, "GET", {}); // No query params needed for single product

    // console.log("Request URL:", url);
    // console.log("OAuth Params:", oauthParams);

    const response = await api.get(`/products/${productId}`, {
      params: oauthParams,
    });

    // console.log("API Response:", response);
    
    if (!response.data || typeof response.data !== "object" || !response.data.id) {
      throw new Error("Invalid product data returned from API");
    }

    return response.data;
  } catch (error) {
    console.error("API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error("Failed to fetch product: " + (error.response?.data?.message || error.message));
  }
};



export const registerUser = async (userInfo) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/customers`,
    {
      email: userInfo.email,
      username: userInfo.userName,
      password: userInfo.password,
      first_name: userInfo.name,
    },
    {
      headers: {
        Authorization: `Basic ${btoa(
          `${import.meta.env.VITE_CONSUMER_KEY}:${import.meta.env.VITE_CONSUMER_SECRET}`
        )}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_JWT_URL,
      { username, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    // Log response details for debugging
    // console.log('Full JWT response (raw):', response);
    // console.log('Response.data type:', typeof response.data);
    // console.log('Response.data keys:', Object.keys(response.data));
    // console.log('Full JWT response (stringified):', JSON.stringify(response.data, null, 2));

    // Extract token
    const token = response.data.token;
    if (!token) {
      console.warn('No token found in response:', JSON.stringify(response.data, null, 2));
      throw new Error('No token received. Please check JWT plugin configuration.');
    }

    // Decode JWT token
    let userId;
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded JWT payload:', JSON.stringify(decoded, null, 2));
      userId = decoded.data?.user?.id;
      if (!userId) {
        console.warn('User ID not found in decoded JWT. Decoded structure:', JSON.stringify(decoded, null, 2));
        throw new Error('User ID not found in JWT payload.');
      }
      // console.log('Extracted user_id from decoded JWT:', userId);
    } catch (decodeError) {
      console.error('JWT decoding failed:', {
        message: decodeError.message,
        stack: decodeError.stack,
      });
      throw new Error('Failed to decode JWT token.');
    }

    // Fallback to response.data.data if needed
    if (!userId && response.data.data?.user?.id) {
      userId = response.data.data.user.id;
      console.log('Extracted user_id from response.data.data.user.id:', userId);
    }

    // Try parsing response.data.data as JSON if it's a string
    if (!userId && typeof response.data.data === 'string') {
      try {
        const parsedData = JSON.parse(response.data.data);
        userId = parsedData.user?.id;
        console.log('Extracted user_id from parsed response.data.data:', userId);
      } catch (parseError) {
        console.warn('Failed to parse response.data.data:', parseError);
      }
    }

    if (!userId) {
      console.warn('User ID extraction failed. Response structure:', JSON.stringify(response.data, null, 2));
      throw new Error('User ID not found in response or JWT payload. Please check JWT plugin configuration.');
    }

    return {
      token,
      user_id: userId.toString(), // Ensure string for localStorage
    };
  } catch (error) {
    console.error('Error logging in:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user_id');
};

export const getUserEmail = async (userId) => {
  try {
    const consumerKey = import.meta.env.VITE_CONSUMER_KEY;
    const consumerSecret = import.meta.env.VITE_CONSUMER_SECRET;
    const base64Credentials = btoa(`${consumerKey}:${consumerSecret}`);

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/customers/${userId}`,
      {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      }
    );
    return response.data.email;
  } catch (error) {
    console.error('Error fetching user email:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};


export const getDownloads = async (userId) => {
  const token = localStorage.getItem('jwt');
  const url = `${import.meta.env.VITE_API_URL}/customers/${userId}/downloads`;
  console.log('Requesting:', url, 'with token:', token);
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Downloads response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching downloads:', error.message, 'Response:', error.response ? error.response.data : 'No response');
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  const token = localStorage.getItem('jwt');
  const url = `${import.meta.env.VITE_API_URL}/customers/${userId}`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('User profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    throw error;
  }
};

export const getOrders = async (userId) => {
  const token = localStorage.getItem('jwt');
  const url = `${import.meta.env.VITE_API_URL}/orders?customer=${userId}`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Orders response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    throw error;
  }
};
