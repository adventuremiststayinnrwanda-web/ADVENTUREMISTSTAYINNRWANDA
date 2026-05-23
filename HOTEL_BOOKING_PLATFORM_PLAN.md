# Hotel Booking & Management Platform Plan

## 1. Product Scope

This project is a complete hotel room booking and management platform for customers, hotel owners, reception staff, and administrators.

Core product areas:

- Customer hotel booking website
- Guest-first customer booking flow
- Optional customer account and dashboard
- Hotel owner/admin dashboard
- Room and availability management
- Booking and payment workflow
- Email confirmation and invoice delivery
- QR code check-in verification
- Reviews, favorites, reports, and analytics

## 2. User Roles

### Customer

Customers can search hotels, view rooms, book without registering, pay online, receive booking confirmation emails, and check in using a QR code.

Main permissions:

- Search hotels and rooms
- Create bookings as guests
- Pay online
- View booking by email and booking reference
- Optionally create an account later for booking history, saved hotels, reviews, and profile settings

### Hotel Owner / Hotel Admin

Hotel owners manage their hotel profile, rooms, availability, bookings, payments, reports, and check-ins.

Main permissions:

- Add and edit hotel details
- Manage rooms and room availability
- View bookings
- Approve, cancel, or refund bookings
- Scan QR codes for check-in
- View revenue and occupancy reports

### Platform Admin

The platform admin manages the entire system.

Main permissions:

- Manage users
- Manage hotels
- View all bookings
- View all payments
- Monitor platform analytics
- Manage permissions and security settings

## 3. Customer Website

### Landing Page

Purpose:

- Attract customers
- Show featured hotels and rooms
- Allow quick hotel searching
- Drive users toward bookings

Main sections:

- Top navigation bar
- Hero section with luxury hotel image or video
- Search box
- Featured hotels
- Popular rooms
- Customer reviews
- Footer

Navigation items:

- Logo
- Home
- Hotels
- Rooms
- About Us
- Contact
- My Booking
- Admin Login
- Book Now button

Hero content:

- Large hotel background image
- Primary headline, for example: "Find Your Perfect Hotel Stay"
- Search form
- Primary booking button

Search fields:

- City
- Hotel name
- Price range
- Check-in date
- Check-out date
- Number of guests

Featured hotel card fields:

- Hotel image
- Hotel name
- Location
- Star rating
- Starting price
- View Rooms button

Popular room card fields:

- Room image
- Price per night
- Room features
- Book button

Footer content:

- Social links
- Contact information
- Email address
- Terms and Conditions
- Privacy Policy

## 4. Guest Booking And Optional Customer Account

The customer website should not force visitors to register before booking. The fastest path is:

1. Search hotel.
2. Choose room.
3. Enter checkout details.
4. Pay.
5. Receive email and QR code.

### Guest Checkout

Required checkout fields:

- Full name
- Email
- Phone

Optional fields:

- Special requests
- Estimated arrival time

### Booking Lookup

Customers can retrieve a booking without logging in.

Fields:

- Email
- Booking reference

Functions:

- Resend confirmation email
- Download invoice
- View QR code
- Cancel booking if hotel policy allows it

### Optional Account Creation

After payment, the system can invite the customer to create an account, but it must not be required.

Optional registration fields:

- Full name
- Email
- Phone
- Password

Optional login functions:

- Forgot password
- Remember me
- Secure session handling

### Optional Customer Dashboard

Dashboard sections:

- My bookings
- Payment history
- Saved hotels
- Saved rooms
- Notifications
- Profile settings

## 5. Hotel Listing Page

The hotel listing page shows available hotels and supports filtering.

Hotel card fields:

- Hotel image
- Hotel name
- Location
- Rating
- Price range
- View Rooms button

Filters:

- Price
- Star rating
- Location
- Facilities
- Room type

## 6. Hotel Details Page

The hotel details page presents complete information about a selected hotel.

Hotel information:

- Image slider
- Description
- Amenities
- Address
- Contact info
- Google Maps location

Map functions:

- Show exact hotel location
- Open in Google Maps
- Get directions

Amenity icons:

- WiFi
- Pool
- Parking
- Gym
- Restaurant
- Air conditioning

## 7. Room Listing System

Each hotel has a room listing page.

Room card fields:

- Room images
- Price per night
- Capacity
- Bed type
- Room size
- Room features
- Availability status

Room features:

- Balcony
- TV
- Hot shower
- Breakfast included

Availability states:

- Available
- Fully booked
- Maintenance mode

## 8. Room Details Page

The room details page is the main conversion page for bookings.

Image gallery:

- Swipe images
- Zoom images
- Fullscreen view

Room information:

- Room title
- Full description
- Price per night
- Included services
- Capacity
- Bed type
- Room size

Booking widget fields:

- Check-in date
- Check-out date
- Number of guests

Calculated values:

- Number of nights
- Taxes and fees
- Total amount

## 9. Booking System

### Booking Flow

1. Customer selects a room.
2. Customer chooses check-in and check-out dates.
3. Customer enters guest checkout details.
4. System displays booking summary.
5. Customer proceeds to payment.
6. Payment gateway verifies payment.
7. System confirms booking.
8. Customer receives confirmation email, invoice, and QR code.

### Booking Summary

Summary fields:

- Hotel
- Room
- Check-in date
- Check-out date
- Number of nights
- Guest count
- Customer name
- Customer email
- Customer phone
- Taxes
- Total amount

### Booking Statuses

Recommended statuses:

- Draft
- Pending payment
- Confirmed
- Checked in
- Completed
- Cancelled
- Refunded

## 10. Online Payment System

Recommended payment gateways:

- Flutterwave
- DPO Group

Supported payment methods:

- Visa
- Mastercard

Payment flow:

1. Customer submits payment.
2. Gateway verifies payment.
3. System receives webhook confirmation.
4. Booking is marked as confirmed.
5. Payment record is created.
6. Confirmation email is sent.
7. Hotel owner revenue is reflected in reports.

Security requirements:

- HTTPS / SSL
- PCI-compliant gateway handling
- Webhook signature verification
- Fraud protection
- No raw card storage in the app database

## 11. Automatic Email System

Emails are sent after successful payment and for important booking events.

Email types:

- Booking confirmation
- Invoice
- QR code check-in pass
- Thank you message
- Payment success
- Check-in reminder
- Booking cancellation

Confirmation email content:

- Hotel branding
- Customer name
- Booking ID
- Hotel name
- Room name
- Dates
- Total paid
- QR code
- Hotel contact info

## 12. QR Code Check-In System

After payment succeeds, the system generates a unique QR code for the booking.

QR code data:

- Booking ID
- Customer ID
- Payment status
- Secure verification token

Reception scanner functions:

- Open camera scanner
- Scan QR code
- Verify booking instantly
- Display booking result

Scanner result fields:

- Customer name
- Customer photo, when available
- Hotel
- Room number
- Check-in date
- Check-out date
- Amount paid
- Valid or invalid status

Security note:

The QR code should not contain sensitive full booking details directly. It should contain a secure token that the backend verifies.

## 13. Admin Dashboard

Dashboard overview metrics:

- Total bookings
- Total revenue
- Available rooms
- Occupancy rate
- Pending payments
- Upcoming check-ins
- Recent cancellations

## 14. Hotel Management Module

Admin functions:

- Add hotel
- Edit hotel
- Delete hotel
- Upload images
- Manage amenities
- Manage location details

Hotel form fields:

- Hotel name
- Address
- City
- Country
- Description
- Amenities
- Contact phone
- Contact email
- Latitude
- Longitude
- Images

## 15. Room Management Module

Admin functions:

- Add room
- Edit room
- Delete room
- Upload room images
- Set room availability
- Set maintenance mode

Room form fields:

- Hotel
- Room name
- Room number
- Price per night
- Images
- Capacity
- Bed type
- Room size
- Features
- Availability status

## 16. Booking Management Module

Booking table fields:

- Booking ID
- Customer name
- Hotel
- Room
- Dates
- Total amount
- Payment status
- Booking status

Admin actions:

- View booking
- Approve booking
- Cancel booking
- Refund booking
- Mark checked in
- Mark completed

## 17. Payment Management

Payment dashboard sections:

- Payments received
- Pending payments
- Failed transactions
- Refunds
- Gateway references

Daily reports:

- Revenue
- Occupancy
- Taxes
- New bookings

Monthly reports:

- Total earnings
- Most booked rooms
- Occupancy trends
- Cancellation rate

## 18. Customer Notifications

Notification triggers:

- Booking confirmed
- Payment successful
- Booking cancelled
- Refund processed
- Reminder before check-in

Channels:

- Email
- SMS
- WhatsApp in a future phase

## 19. Review And Rating System

Customers can review hotels after completed stays.

Review fields:

- Customer
- Hotel
- Booking
- Star rating from 1 to 5
- Comment
- Uploaded photos
- Review status

Moderation states:

- Pending
- Published
- Hidden

## 20. Favorites And Wishlist

Customers can:

- Save hotels
- Save rooms
- View saved items later
- Remove saved items

Note:

Favorites require an optional customer account. They should not block guest booking.

## 21. Multi-Language Support

Future supported languages:

- English
- French

Implementation recommendation:

- Store translation keys in the frontend.
- Keep user-generated content in the original language.
- Add locale-aware routing when the feature is needed.

## 22. Responsive Design

The website must work well on:

- Mobile phones
- Tablets
- Desktop screens

Responsive requirements:

- Mobile-first layouts
- Touch-friendly controls
- Fast-loading images
- Accessible forms
- Clear booking flow on small screens

## 23. Security System

Security requirements:

- Guest-safe booking lookup using email and booking reference
- JWT authentication through Supabase Auth for admins and optional customer accounts
- Password hashing handled by Supabase
- Role-based access control
- Admin permissions
- Row Level Security policies
- Rate limiting
- Anti-spam protections
- Webhook signature checks
- Secure file upload rules

## 24. Recommended Technology Stack

Frontend:

- Next.js
- React
- Tailwind CSS

Backend:

- Next.js API routes or Node.js service
- Supabase client and admin SDK where appropriate

Database:

- Supabase PostgreSQL

Authentication:

- Supabase Auth for admins and optional customer accounts
- Guest checkout for customers who do not want to register

Storage:

- Supabase Storage for hotel, room, review, and user images

Hosting:

- Vercel for frontend and API routes
- DigitalOcean for optional dedicated backend services

Payments:

- Flutterwave or DPO Group

Email:

- Resend, SendGrid, Mailgun, or Supabase Edge Functions with an email provider

## 25. Database Structure

### users

Stores public profile data linked to Supabase Auth users. This table is required for admins and optional for customers.

Fields:

- id
- auth_user_id
- full_name
- email
- phone
- avatar_url
- role
- created_at
- updated_at

### hotels

Stores hotel information.

Fields:

- id
- owner_id
- name
- slug
- description
- address
- city
- country
- latitude
- longitude
- contact_email
- contact_phone
- star_rating
- status
- created_at
- updated_at

### hotel_images

Stores hotel gallery images.

Fields:

- id
- hotel_id
- image_url
- alt_text
- sort_order
- created_at

### amenities

Stores reusable amenity definitions.

Fields:

- id
- name
- icon
- created_at

### hotel_amenities

Connects hotels to amenities.

Fields:

- hotel_id
- amenity_id

### rooms

Stores room information.

Fields:

- id
- hotel_id
- name
- room_number
- description
- price_per_night
- capacity
- bed_type
- room_size
- status
- created_at
- updated_at

### room_images

Stores room gallery images.

Fields:

- id
- room_id
- image_url
- alt_text
- sort_order
- created_at

### room_features

Stores reusable room feature definitions.

Fields:

- id
- name
- icon
- created_at

### room_feature_links

Connects rooms to features.

Fields:

- room_id
- feature_id

### bookings

Stores reservations.

Fields:

- id
- customer_id
- guest_full_name
- guest_email
- guest_phone
- hotel_id
- room_id
- check_in_date
- check_out_date
- guest_count
- nights
- subtotal
- taxes
- total_amount
- status
- qr_token_hash
- created_at
- updated_at

Notes:

- `customer_id` is nullable for guest bookings.
- Guest bookings store enough contact information to send confirmation emails and support booking lookup.
- If a guest creates an account later using the same email, the system can link previous bookings after email verification.

### payments

Stores payment transaction records.

Fields:

- id
- booking_id
- customer_id
- guest_email
- gateway
- gateway_reference
- amount
- currency
- status
- paid_at
- created_at

### reviews

Stores customer reviews and ratings.

Fields:

- id
- customer_id
- hotel_id
- booking_id
- rating
- comment
- status
- created_at
- updated_at

### favorites

Stores saved hotels and rooms.

Fields:

- id
- customer_id
- hotel_id
- room_id
- created_at

### notifications

Stores in-app notifications.

Fields:

- id
- user_id
- type
- title
- message
- read_at
- created_at

## 26. API Areas

Recommended API modules:

- Auth and profile
- Guest checkout
- Booking lookup
- Hotels
- Rooms
- Search
- Bookings
- Payments
- Payment webhooks
- QR verification
- Reviews
- Favorites
- Notifications
- Reports
- Admin management

## 27. Final Customer Journey

1. Customer opens the website.
2. Customer searches by city, hotel, dates, price, and guests.
3. Customer views hotel details.
4. Customer selects a room.
5. Customer enters name, email, phone, and booking details.
6. Customer reviews the booking summary.
7. Customer pays online.
8. Customer receives confirmation email, invoice, and QR code.
9. Customer can optionally create an account after booking.
10. Customer arrives at the hotel.
11. Reception scans QR code.
12. Booking is verified.
13. Check-in is completed.

## 28. Build Roadmap

### Phase 1: Foundation

- Create Next.js project
- Configure Tailwind CSS
- Configure Supabase
- Add admin authentication
- Add optional customer authentication
- Add guest checkout support
- Create database schema
- Add role-based access control
- Build shared layout and navigation

### Phase 2: Customer Booking Website

- Build homepage
- Build hotel listing page
- Build hotel details page
- Build room listing page
- Build room details page
- Add search and filters
- Add responsive layouts

### Phase 3: Booking Flow

- Add date selection
- Add availability checks
- Add booking summary
- Create pending bookings
- Add guest booking lookup
- Add optional customer dashboard bookings

### Phase 4: Payments

- Integrate payment gateway
- Add payment initiation
- Add payment webhook verification
- Confirm booking after payment
- Store payment records

### Phase 5: Email And QR Codes

- Add transactional email provider
- Create booking confirmation email
- Generate invoices
- Generate QR code tokens
- Build reception QR scanner

### Phase 6: Admin Dashboard

- Build dashboard metrics
- Add hotel management
- Add room management
- Add booking management
- Add payment management
- Add reports

### Phase 7: Engagement Features

- Add reviews and ratings
- Add favorites and wishlist
- Add notifications
- Add check-in reminders

### Phase 8: Production Hardening

- Add Row Level Security policies
- Add validation and error handling
- Add audit logging for admin actions
- Add automated tests
- Optimize images and performance
- Configure production hosting
- Configure domain, SSL, and environment variables

## 29. Suggested MVP

The first shippable version should include:

- Homepage
- Hotel listing
- Hotel details
- Room listing
- Room details
- Booking creation
- Guest checkout
- Booking lookup by email and reference
- Manual or test-mode payment confirmation
- Confirmation email
- QR code generation
- Admin hotel and room management
- Booking management dashboard

Features to delay until after MVP:

- WhatsApp notifications
- Multi-language support
- Super admin subscriptions
- Advanced analytics
- Review photo uploads
- Automated refunds
