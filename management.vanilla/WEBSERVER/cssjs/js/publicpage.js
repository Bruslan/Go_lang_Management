'use strict';

/// navbar selection:
$('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
  if (typeof e.relatedTarget == 'undefined') {
    if (e.target.getAttribute('id').split("-")[3] == "2") {
      var innerlist = document.querySelectorAll('#pills-tab a')
      $.each(innerlist, function(i, v) {
        v.setAttribute('class', 'nav-link')
        v.setAttribute('aria-selected', false)
      })
    } else {
      var innerlist = document.querySelectorAll('#pills-tab-2 a')
      $.each(innerlist, function(i, v) {
        v.setAttribute('class', 'nav-link')
        v.setAttribute('aria-selected', false)
      })
    }
  }
  // console.log(e.relatedTarget.getAttributeNames())
  // console.log(e.relatedTarget)
  // console.log(e.target)
})


//////////////////////////////////////////////////
/*Sign up functionality check*/
var verifyCallback = function(response) {
  alert(response);
};

var onloadCallback = function() {
  grecaptcha.render('captcha_element', {
    'sitekey' : 'your_site_key'
  });
};

// verify sign up:
$('#sign-up').on('submit', function( event ) {

  // prevent reload
  event.preventDefault();

  // clears appended msg
  clearMsg();

  // data parsing:
  var params = {};
  params['email'] = document.getElementsByName('email2')[0].value;
  params['passw1'] = document.getElementsByName('passw1')[0].value;
  params['passw2'] = document.getElementsByName('passw2')[0].value;

  // check pw:
  if (params['passw1'].length < 8 || params['passw1'].length > 20) {
    addMsg("Your password must be 8-20 characters long.");
    return;
  } 
  if (!validPW(params['passw1'])) {
    addMsg("Check password specification.");
    return;
  }
  if (params['passw1'] != params['passw2']) {
    addMsg("Your passwords must match.");
    return;
  }
  // verify age:
  /*var user_date = new Date(parseInt(params['age_year']), parseInt(params['age_month']), parseInt(params['age_day']));
  var ageDif = new Date(Date.now() - user_date.getTime());
  if (Math.abs(ageDif.getUTCFullYear() - 1970) < 16) {
    addMsg("You must be at least 16 years old.");
    return;
  }*/

  // insert parameters into database:
  var r = new XMLHttpRequest();
  r.open("POST", "/signup_account", true);
  /*r.responseType = 'text';*/
  r.setRequestHeader("Content-Type", "application/json");
  r.onreadystatechange = function() {
      if (r.readyState === 4 && r.status === 200) {
        var json_resp = JSON.parse(r.responseText);
        if (json_resp["Success"] == true) {
          clearMsg();
          location.reload();
          /*addMsg(json_resp["msg"] + " You can now login.");
          addMsg("Page reload in 5 seconds.")
          setTimeout(function(){
            location.reload();
          }, 5000);*/
        } else {
          clearMsg();
          addMsg(json_resp["Message"])
        }
        return false;
      }
  };
  r.send(JSON.stringify(params));
});

function validPW(str_in) {
  if (/[0-9]/.test(str_in) && /[a-z]/.test(str_in) && /[A-Z]/.test(str_in) && /^[a-zA-Z0-9]+$/.test(str_in)) {
    return true
  } else {
    return false
  }
}

// function to append div text to sign up:
function addMsg(str_in) {
  var div = document.createElement('div');
  div.className = 'container text-center';
  div.innerHTML = str_in;
  document.getElementById('responsemsg').appendChild(div);
  document.getElementById('captcha_element').classList.remove("pt-4");
}

// clears all appended info in lowest div:
function clearMsg() {
  var div = document.getElementById("responsemsg");
  while (div.firstChild) {
      div.removeChild(div.firstChild);
  }
}


