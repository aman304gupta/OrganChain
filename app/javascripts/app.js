// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// truffle stores the abi and deployed address in json file
//this is used to create instance of organfactory contract
import OrganFactory_artifacts from '../../build/contracts/OrganFactory.json'

//instance created of artifacts
var OrganFactory = contract(OrganFactory_artifacts);

//create hospital accepts name of hospital and hospitalId as input
window.createHospital = function(name) {

 let hospitalName = $("#name").val();
  $("#create-msg").html("Hospital Account Creation request has been submitted. Please wait!!");
  // .deployed() function returns contractInstance which is passed in promise
  OrganFactory.deployed().then(function(contractInstance) {
    $("#hospital-address").empty();
    $("#hospital-address").append("Hospital Id is : <br>");
    // msg.sender is passed in {from:} format
    //create hospital function is returning hospital id hence passed in function()
    contractIntsance.createHospital(hospitalName,{from:web3.eth.accounts[0]}).then(function(v) {
      $('#create-msg').html("");
      // i.e hospital id is displayed
      $("#hospital-address").append(v);
    })
  })
}

window.see_function = function() {
  $("#see-msg").html("Request in process");
  OrganFactory.deployed().then(function(contractInstance) {
// see_function returns v which is passed to function as parameter
// v is array
    contractInstance.see_function({from:web3.eth.accounts[0]}).then(function(v) {
      let waitingApproval = v;
      $("#see-msg").html("");
      $("#organs-waitingApproval").empty();
      $("#organs-waitingApproval").append("Organs waiting Approval:<br");
      for(let i=0; i < waitingApproval.length; i++) {
        // waiting approval is in keccak format??
        $("#organs-waitingApproval").append(i+1 + ":" + waitingApproval[i]);
      }
    })
  })
}
