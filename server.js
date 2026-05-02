import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { createObjectCsvWriter } from 'csv-writer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const CSV_PATH = join(__dirname, 'bookings.csv');

const csvWriter = createObjectCsvWriter({
  path: CSV_PATH,
  header: [
    { id: 'date_submitted', title: 'Date Submitted' },
    { id: 'name', title: 'Full Name' },
    { id: 'phone', title: 'Phone Number' },
    { id: 'service', title: 'Service' },
    { id: 'service_date', title: 'Service Date' },
    { id: 'details', title: 'Additional Details' },
  ],
  append: fs.existsSync(CSV_PATH),
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/book', async (req, res) => {
  const { name, phone, service, date, details } = req.body;

  if (!name || !phone || !service || !date) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const serviceLabels = {
    birthday: 'Birthday Transportation',
    airport: 'Airport Transfers',
    datenight: 'Date Night Luxury Rides',
    event: 'Event Transportation',
    wedding: 'Wedding & Nikkah Transport',
    citynight: 'City Nights & Special Occasions',
  };

  const record = {
    date_submitted: new Date().toLocaleString(),
    name,
    phone,
    service: serviceLabels[service] || service,
    service_date: date,
    details: details || '',
  };

  try {
    await csvWriter.writeRecords([record]);
  } catch (err) {
    console.error('CSV write error:', err);
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_TO) {
    const mailOptions = {
      from: `"CQ Rentals" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Booking Request — ${record.service}`,
      html: `
        <h2 style="font-family:sans-serif;">New Booking Request</h2>
        <table style="font-family:sans-serif;border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${phone}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Service</td><td style="padding:8px;border:1px solid #ddd;">${record.service}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Date</td><td style="padding:8px;border:1px solid #ddd;">${date}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Details</td><td style="padding:8px;border:1px solid #ddd;">${details || 'None'}</td></tr>
        </table>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent for booking from ${name}`);
    } catch (err) {
      console.error('Email send error:', err.message);
    }
  } else {
    console.log('Email not configured — skipping email. Booking saved to CSV.');
  }

  res.json({ success: true, message: 'Booking received!' });
});

app.listen(PORT, 'localhost', () => {
  console.log(`CQ Rentals backend running on port ${PORT}`);
});
