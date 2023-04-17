import twilio from "twilio";

// Set up Twilio Client
const accountSid = process.env.TWILIO_ACC_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const client = twilio(accountSid, authToken);

export default client;
