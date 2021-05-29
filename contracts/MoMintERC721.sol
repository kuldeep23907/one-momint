// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

contract MoMint is ERC721URIStorage {
    string baseURI;
    uint256 tokenId;
    
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        tokenId = 0;
    }
    
    function mint(
        string memory tokenURI
    ) external {
        uint256  newId = tokenId + 1;
        tokenId++;
        _mint(msg.sender, newId);
        
        _setTokenURI(tokenId, tokenURI);
    }
    
    function setBaseURI(string memory baseURI_) external {
        baseURI = baseURI_;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}