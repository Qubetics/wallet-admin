import Web3 from "web3";
let web3 = '';


if (window.ethereum) {
   console.log('window.web3', window.ethereum);

   // web3 = new Web3(window.ethereum);
   // try {
   //    window.ethereum.enable().then(function () {
   //       // User has allowed account access to DApp...
   //    });
   // } catch (e) {
   //    // User has denied account access to DApp...
   // }
}
// Legacy DApp Browsers
else if (window && window.web3) {
   // console.log('window.web3.currentProvider', window.web3);
   // web3 = new Web3(window.web3.currentProvider);
}
// Non-DApp Browsers
//  else {
//      alert('You have to install MetaMask !');
//  }
export default web3;