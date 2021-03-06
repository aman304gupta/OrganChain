import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
import organ_artifacts from '../../build/contracts/OrganFactory.json';
import hospital_artifacts from '../../build/contracts/Hospitals.json';
import user_artifacts from '../../build/contracts/User.json';


  $(document).ready(function(){

     if (typeof web3 !== 'undefined') {
      console.warn("External")
      window.web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("No web3 detected");
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

  var Organ = contract(organ_artifacts);
  var Hospitals = contract(hospital_artifacts);
  var User = contract(user_artifacts);

  Organ.setProvider(web3.currentProvider);
  Hospitals.setProvider(web3.currentProvider);
  User.setProvider(web3.currentProvider);

  function donateOrgan() {
  
    console.log("donate organ function called")

    let organName = $('#organName').val();
    let hospitalId = $('#hospitalId').val();
    let donorId = web3.eth.accounts[0]; 

    console.log(organName,hospitalId,donorId) 
    
    try{
      
      Organ.deployed().then(function(contractInstance) {
      
        contractInstance.donateOrgan(organName,donorId,
                                     hospitalId,false,"0x0",false,
                                    {gas:10000,from:web3.eth.accounts[0]})
        .then(function(){
          $('#text1').append("<p style='color:green'>Organ Successfully donated!</p>")
          return true;
        })
      })

    } catch(err) {
      console.log(err);
    }
  }

  function acceptOrgan() {
  
    console.log("accept organ function called")

    let id = $('#id').val();
    
    try{
      
      Hospitals.deployed().then(function(contractInstance) {
      
        contractInstance.acceptOrgan(id,{gas:10000,from:web3.eth.accounts[0]})
        .then(function(){
          return true;
        })
      })

    } catch(err) {
      console.log(err);
    }
  }

  function rejectOrgan() {
  
    console.log("reject organ function called")

    let id = $('#id').val();
    
    try{
      
      Hospitals.deployed().then(function(contractInstance) {
      
        contractInstance.rejectOrgan(id,{gas:10000,from:web3.eth.accounts[0]})
        .then(function(){
          return true;
        })
      })

    } catch(err) {
      console.log(err);
    }
  }

  function set_priority() {
  
    console.log("accept organ function called")

    let id = $('#receiverId').val();
    let porder = $('#proder').val();
    
    try{
      
      Hospitals.deployed().then(function(contractInstance) {
      
        contractInstance.set_priority(id,porder,{gas:10000,from:web3.eth.accounts[0]})
        .then(function(){
          return true;
        })
      })

    } catch(err) {
      console.log(err);
    }
  }

  function applyForOrgan() {
  
    console.log("apply organ function called")

    let organName = $('#applyOrgan').val();
    
    try{
      
      User.deployed().then(function(contractInstance) {
      
        contractInstance.applyForOrgan(organName,{gas:10000,from:web3.eth.accounts[0]})
        .then(function(){
          return true;
        })
      })

    } catch(err) {
      console.log(err);
    }
  }

  function createReceiver() {
    console.log("create organ function called")

    let receiverId = web3.eth.accounts[0];  
    
    try{
      
      User.deployed().then(function(contractInstance) {
      
        contractInstance.createReceiver(receiverId)
        .then(function(){
          return true;
        })
      })

    } catch(err) {
      console.log(err);
    }

  }
  


  function getOrgan() {

    console.log("get organ function called")

    try {
      Organ.deployed().then(function(contractInstance) {
          contractInstance.getCount.call().then(function(v) {
            console.log(v.toString());
            $('#organs').html('')
            for(let i=1;i<=v;i++)    
            contractInstance.getOrgan.call(i-1).then(function(v){

              var stat = "";

              if(v[5] == false) {
                console.log("available");
                stat = `<button id="getOrgan" class="waves-effect waves-light btn">Approve</button>
              `;
              } else {
                stat = `<button id="status" class="waves-effect waves-light btn">Approve</button>`;
              }

              $('#requests').append(
    `<div class="row">
        <div class="col s12">
          <div class="card " style="background-color: #fb576a">
            <div class="card-content white-text" >
              <span class="card-title">` + web3.toAscii(v[0]) +`</span>
              <p>donorID : ` + v[1] + `</p>
              <p>Organ Id: <span id="organId">` +(i-1) + `</span></p>
            </div>
            <div class="card-action ">
            `+stat+`
              
              </div>            
          </div>
        </div>
    </div>`
                )
              console.log(v.toString())
            })
        
          });
        })
    } catch(err) {
      console.log(err);
    }
  }

   function getReceiver() {

    console.log("get organ function called")

    try {
      User.deployed().then(function(contractInstance) {
          contractInstance.getCount.call().then(function(v) {
            console.log(v.toString());
            $('#rrr').html('') // 
            for(let i=1;i<=v;i++)    
            contractInstance.getReceivers.call(i-1).then(function(v){
                stat = `<button id="Approve" class="waves-effect waves-light btn">Approve</button>
              `;
              

              $('#rrr').append( //
    `<div class="row">
        <div class="col s12">
          <div class="card " style="background-color: #fb576a">
            <div class="card-content white-text" >
              <span class="card-title">` + v[0] +`</span>
              <p>Priority : ` + v[1] + `</p>
              </div>
            <div class="card-action ">
            `+stat+`
              
              </div>            
          </div>
        </div>
    </div>`
                )
              console.log(v.toString())
            })
        
          });
        })
    } catch(err) {
      console.log(err);
    }
  }

  function getMyOrgans() {
    console.log("get user organs");
    try {
      Organ.deployed().then(function(contractInstance) {
          contractInstance.getUserOrgans.call(web3.eth.accounts).then(function(v) {
            
            console.log(v.toString())
            if (v.toString()=="") { 
              console.log("No organs"); 
              $('#myorgans').html('')
              $('#myorgans').append(`
                <h3 style="left:33%;position:relative">No Organs</h3>
              `) }
            else {
              contractInstance.getOrgan.call(v.toString()).then(function(v){
              console.log(v.toString())
              $('#myorgans').html('')
              $('#myorgans').append(
                `<div class="row">
                    <div class="col s12">
                      <div class="card " style="background-color: #fb576a">
                        <div class="card-content white-text" >
                          <span class="card-title">` + v[0] +`</span>
                          <p>ReferenceID : ` + v[2] + `</p>
                        </div>
                    </div>
                </div>`
                            )

            })
            }
            
          });
        })
    } catch(err) {
      console.log(err);
    }
  }

  $("#donate").click(donateOrgan);
  $('#get').click(getOrgan);
  $('#my').click(getMyOrgans);
  $('#createReceive').click(createReceiver);
  $('#organDonate').hide();
  $('#hospital').hide();
  $('#receiver').hide();
  $('#see').click(getOrgan);
  $('#rr').click(getReceiver);
  $(document).on("click", '#getOrgan',function(){
    
    var organId = $('#organId').text();
    console.log("purchase function called for: " + organId )

    try {
      Organ.deployed().then(function(contractInstance) {
      
        contractInstance.purchaseOrgan(organId,web3.eth.accounts,
                                    {gas:10000,from:web3.eth.accounts[0]})
        .then(function(){
          return true;
        })
      })
    } catch(err) {
      console.log(err)
    }


  })

  $('#ao').hide();

    $("#cancel").click(function(){
        $("#organDonate").hide();
    });

    $('#showHospital').click(function() {
      $('#main').hide();
      $('#hospital').show();
      $('#receiver').hide();
    })

    $('#showDonor').click(function() {
      $('#hospital').hide();
      $('#main').show();
      $('#receiver').hide();
    })

    $('#showReceiver').click(function() {
      $('#hospital').hide();
      $('#main').hide();
      $('#receiver').show();
    })

    $("#showDonate").click(function(){
        $("#organDonate").show();
    });

    $('#apply').click(function(){
      $('#ao').show();
    });

    $('#applied').click(applyForOrgan);

  });