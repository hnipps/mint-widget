// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract Test is ERC721Enumerable, Ownable, PaymentSplitter {
    using Strings for uint256;

    uint256 private _price = 0.026 ether;

    string public _baseTokenURI = "";

    string public APE_PROVENANCE = "";

    uint256 public MAX_TOKENS_PER_TRANSACTION = 20;

    uint256 public MAX_SUPPLY = 8888;

    string public LICENSE_TEXT = ""; // IT IS WHAT IT SAYS

    bool licenseLocked = false; // TEAM CAN'T EDIT THE LICENSE AFTER THIS GETS TRUE

    mapping(uint256 => string) private _owners;

    event licenseisLocked(string _licenseText);

    // Withdrawal addresses
    address t1 = 0xda73C4DFa2F04B189A7f8EafB586501b4D0B73dC; // Team
    address t2 = 0xA6e091846f2a8bb6a56f43a0aDce07Ccd7eb4E24; // Charity

    address[] addressList = [t1, t2];
    uint256[] shareList = [90, 10];

    bool isFreesaleActive = true;
    uint256 totalClaimed = 0;
    uint256 MAX_CLAIM = 5;
    mapping(address => uint256) _claimed;
    bool isVerified = true;

    constructor()
        ERC721("Test", "TEST")
        PaymentSplitter(addressList, shareList)
    {}

    function verifySignature(string memory quantity, bytes calldata signature) pure internal returns(bool) {
return true;
    }

    function claim( uint quantity, bytes calldata signature ) external {
    require( isFreesaleActive, "Claim is not active" );
    require( totalClaimed < MAX_CLAIM, "No claim supply available" );
    require( _claimed[ msg.sender ] < quantity, "No claims available" );

    if( isVerified )
      verifySignature( quantity.toString(), signature );

    quantity -= _claimed[ msg.sender ];
    totalClaimed += quantity;
    require( totalClaimed < MAX_CLAIM, "No claim supply available" );

    uint supply = totalSupply();
    require( quantity + supply < MAX_SUPPLY );
    _claimed[ msg.sender ] += quantity;

    for(uint i; i < quantity; i++){
      _mint( msg.sender, supply++ );
    }
  }


    function presale(uint256 _count, bytes calldata signature) public payable {
        uint256 supply = totalSupply();
        require(
            _count <= MAX_TOKENS_PER_TRANSACTION,
            "You can mint a maximum of 20 Apes per transaction"
        );
        require(
            supply + _count <= MAX_SUPPLY,
            "Exceeds current Ape supply limit"
        );
        require(msg.value >= _price * _count, "Ether sent is not correct");

        for (uint256 i; i < _count; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }

    function mint(uint256 _count) public payable {
        uint256 supply = totalSupply();
        require(
            _count <= MAX_TOKENS_PER_TRANSACTION,
            "You can mint a maximum of 20 Apes per transaction"
        );
        require(
            supply + _count <= MAX_SUPPLY,
            "Exceeds current Ape supply limit"
        );
        require(msg.value >= _price * _count, "Ether sent is not correct");

        for (uint256 i; i < _count; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }

    function airdrop(address _wallet, uint256 _count) public onlyOwner {
        uint256 supply = totalSupply();
        require(supply + _count <= MAX_SUPPLY, "Exceeds maximum Ape supply");

        for (uint256 i; i < _count; i++) {
            _safeMint(_wallet, supply + i);
        }
    }

    // Just in case Eth does some crazy stuff
    function setPrice(uint256 _newPrice) public onlyOwner {
        _price = _newPrice;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        _baseTokenURI = _newBaseURI;
    }

    function getPrice() public view returns (uint256) {
        return _price;
    }

    function setProvenanceHash(string memory _provenanceHash) public onlyOwner {
        APE_PROVENANCE = _provenanceHash;
    }

    // Returns the license for tokens
    function tokenLicense(uint256 _id) public view returns (string memory) {
        require(_id < totalSupply(), "Invalid ID");
        return LICENSE_TEXT;
    }

    // Locks the license to prevent further changes
    function lockLicense() public onlyOwner {
        licenseLocked = true;
        emit licenseisLocked(LICENSE_TEXT);
    }

    // Change the license
    function changeLicense(string memory _license) public onlyOwner {
        require(licenseLocked == false, "License already locked");
        LICENSE_TEXT = _license;
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(_owner);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for (uint256 i; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }
}
