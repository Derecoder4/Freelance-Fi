// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FreelanceFiV2
 * @dev Freelance Escrow with Arbitration and Service Fees (SaaS Model)
 */
contract FreelanceFiV2 {
    
    // --- State Variables ---
    
    address public arbiter; // The platform admin/mediator
    uint256 public serviceFeePercent = 1; // 1% fee
    uint256 public gigCounter;

    struct Gig {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;
        string description;
        bool isAccepted;   // Freelancer has accepted the gig
        bool isDisputed;   // Dispute has been raised
        bool isComplete;   // Funds released
        bool isRefunded;   // Funds returned to client
    }

    mapping(uint256 => Gig) public gigs;

    // --- Events ---
    
    event GigCreated(uint256 indexed gigId, address indexed client, address indexed freelancer, uint256 amount);
    event GigAccepted(uint256 indexed gigId, address indexed freelancer);
    event GigDisputed(uint256 indexed gigId, address indexed initiator);
    event GigResolved(uint256 indexed gigId, address indexed winner, uint256 amount);
    event FundsReleased(uint256 indexed gigId, address indexed freelancer, uint256 amount, uint256 fee);
    event Refunded(uint256 indexed gigId, address indexed client, uint256 amount);

    // --- Modifiers ---

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Only arbiter can perform this action");
        _;
    }

    modifier onlyClient(uint256 _gigId) {
        require(msg.sender == gigs[_gigId].client, "Only client can perform this action");
        _;
    }

    modifier onlyFreelancer(uint256 _gigId) {
        require(msg.sender == gigs[_gigId].freelancer, "Only freelancer can perform this action");
        _;
    }

    modifier onlyParty(uint256 _gigId) {
        require(
            msg.sender == gigs[_gigId].client || msg.sender == gigs[_gigId].freelancer,
            "Only involved parties can perform this action"
        );
        _;
    }

    // --- Constructor ---

    constructor() {
        arbiter = msg.sender; // Deployer is the default arbiter
    }

    // --- Core Functions ---

    /**
     * @dev Client creates a gig and deposits funds
     */
    function createGig(address _freelancer, string memory _description) external payable {
        require(msg.value > 0, "Deposit must be greater than 0");
        require(_freelancer != address(0), "Invalid freelancer address");

        gigCounter++;
        
        gigs[gigCounter] = Gig({
            id: gigCounter,
            client: msg.sender,
            freelancer: _freelancer,
            amount: msg.value,
            description: _description,
            isAccepted: false,
            isDisputed: false,
            isComplete: false,
            isRefunded: false
        });

        emit GigCreated(gigCounter, msg.sender, _freelancer, msg.value);
    }

    /**
     * @dev Freelancer accepts the gig. Locks the ability for client to instant-refund.
     */
    function acceptGig(uint256 _gigId) external onlyFreelancer(_gigId) {
        Gig storage gig = gigs[_gigId];
        require(!gig.isAccepted, "Gig already accepted");
        require(!gig.isComplete && !gig.isRefunded, "Gig is closed");

        gig.isAccepted = true;
        emit GigAccepted(_gigId, msg.sender);
    }

    /**
     * @dev Client releases funds to freelancer. Deducts service fee.
     */
    function releaseFunds(uint256 _gigId) external onlyClient(_gigId) {
        Gig storage gig = gigs[_gigId];
        require(!gig.isComplete && !gig.isRefunded, "Gig is closed");
        require(!gig.isDisputed, "Gig is disputed, wait for arbiter");

        gig.isComplete = true;

        uint256 fee = (gig.amount * serviceFeePercent) / 100;
        uint256 payout = gig.amount - fee;

        // Transfer fee to arbiter
        payable(arbiter).transfer(fee);
        
        // Transfer payout to freelancer
        payable(gig.freelancer).transfer(payout);

        emit FundsReleased(_gigId, gig.freelancer, payout, fee);
    }

    /**
     * @dev Client requests refund. 
     * Allowed ONLY if freelancer hasn't accepted yet OR if arbiter resolves it.
     * (This function is for the instant refund before acceptance)
     */
    function refund(uint256 _gigId) external onlyClient(_gigId) {
        Gig storage gig = gigs[_gigId];
        require(!gig.isComplete && !gig.isRefunded, "Gig is closed");
        require(!gig.isDisputed, "Gig is disputed");
        require(!gig.isAccepted, "Gig accepted, must dispute to cancel");

        gig.isRefunded = true;
        payable(gig.client).transfer(gig.amount);

        emit Refunded(_gigId, gig.client, gig.amount);
    }

    /**
     * @dev Either party can raise a dispute
     */
    function disputeGig(uint256 _gigId) external onlyParty(_gigId) {
        Gig storage gig = gigs[_gigId];
        require(!gig.isComplete && !gig.isRefunded, "Gig is closed");
        require(!gig.isDisputed, "Already disputed");

        gig.isDisputed = true;
        emit GigDisputed(_gigId, msg.sender);
    }

    /**
     * @dev Arbiter resolves dispute by sending funds to winner (minus fee?)
     * For simplicity, we'll take the fee even on dispute resolution to pay for mediation.
     */
    function resolveDispute(uint256 _gigId, address _winner) external onlyArbiter {
        Gig storage gig = gigs[_gigId];
        require(gig.isDisputed, "Gig is not disputed");
        require(!gig.isComplete && !gig.isRefunded, "Gig is closed");
        require(_winner == gig.client || _winner == gig.freelancer, "Winner must be a party");

        gig.isDisputed = false; // Resolved
        
        uint256 fee = (gig.amount * serviceFeePercent) / 100;
        uint256 payout = gig.amount - fee;

        // Transfer fee to arbiter
        payable(arbiter).transfer(fee);

        if (_winner == gig.client) {
            gig.isRefunded = true;
            payable(gig.client).transfer(payout);
            emit Refunded(_gigId, gig.client, payout);
        } else {
            gig.isComplete = true;
            payable(gig.freelancer).transfer(payout);
            emit FundsReleased(_gigId, gig.freelancer, payout, fee);
        }

        emit GigResolved(_gigId, _winner, payout);
    }

    // --- Admin Functions ---

    function setServiceFee(uint256 _percent) external onlyArbiter {
        require(_percent <= 10, "Fee too high"); // Max 10%
        serviceFeePercent = _percent;
    }

    function setArbiter(address _newArbiter) external onlyArbiter {
        arbiter = _newArbiter;
    }
}
