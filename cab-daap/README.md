### Modified Components and Workflow

#### 1. Smart Contracts

**1.1. UserInfoContract:**
- **User Data:** 
  - Stores basic user information such as name, contact details, and user type (driver or customer).
- **Driver Data:** 
  - For drivers, includes additional data such as vehicle information (e.g., vehicle number, type), vehicle status, insurance details, and driving license verification.

**1.2. RideRequestContract:**
- **Ride Data:** 
  - Contains ride details like pickup location, destination, timestamp, ride status, and preferred ride type.
  - Ensures that only users (customers) can request a ride, while drivers cannot.
- **Bid Data:** 
  - Allows drivers to place bids on available rides by submitting their price and ICE (Incentive for Clean Energy).
  - The contract enforces that only drivers can bid on rides.
- **Ride Acceptance:** 
  - Once a customer accepts a ride, the ICE is updated, and the contract records the driver and customer details.
  - Only customers can accept bids, and only drivers can start and complete the ride.

#### 2. WebRTC P2P Connection
- **Chat:** 
  - Enables real-time communication between the driver and the customer.
- **Live Location Tracking:** 
  - Provides continuous tracking of the driver's location during the ride.

#### 3. Payment System
- **On-Chain Payment:** 
  - If the payment is made via digital currency, it is processed directly through the smart contract.
- **Cash Payment:** 
  - If paid in cash, the driver confirms payment through the RideRequestContract.

### Workflow

**1. User Registration:**
- Users (both customers and drivers) register on the platform, and their details are stored in the UserInfoContract.
- Drivers provide additional vehicle and verification information, which is also stored in the same contract.

**2. Ride Request:**
- A customer requests a ride by specifying the pickup location, destination, preferred ride type, and location range.
- This information is stored in the RideRequestContract.
- Drivers subscribe to ride requests within their specified location range.

**3. Bidding Process:**
- Drivers can view available ride requests within their subscribed location range and place bids by submitting their price and ICE.
- The RideRequestContract records all bids.
- Drivers can only place bids on ride requests and cannot request rides themselves.

**4. Ride Acceptance:**
- The customer reviews the bids and accepts one, updating the ICE on the RideRequestContract.
- The smart contract finalizes the agreement, linking the driver with the customer.
- The driver can then start the ride after the customer's acceptance.

**5. P2P Communication:**
- WebRTC establishes a P2P connection for real-time chat and live location sharing between the customer and driver.

**6. Ride Completion:**
- After the ride, the customer updates the ride status in the RideRequestContract.
- If the payment was made in cash, the driver confirms the payment on-chain.

**7. Payment Confirmation:**
- The smart contract processes the payment if done digitally or records the cash payment confirmation.

### Key Modifications
- **Role-Based Access Control:** The RideRequestContract strictly enforces that only customers can request rides and accept bids, while only drivers can place bids, start, and complete rides.
- **Location-Based Bidding:** Drivers subscribe to a location range and only see bids within that range, allowing them to bid on relevant ride requests.
- **Subscription Model:** Both customers and drivers subscribe to their respective activities (requesting rides and bidding on them), enhancing the efficiency of the system.