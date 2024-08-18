/*!
 * AB Study
 * http://github.com/euh/
 * http://alexisbrisset.com/
 *
 * Copyright 2014 Alexis Brisset
 * Released under the MIT license http://opensource.org/licenses/MIT
 *
 * Date: 2014-02-01
 */

// Cookie Function from MDN https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  }
};

// select option change, add session cookie
function updatevariable(data) { 
	var select = document.getElementById("choice");
	var selectedItem = select.options[select.selectedIndex].value;
	var checkboxState = $("#random").prop("checked");
	docCookies.setItem("jsonselected", selectedItem);
	docCookies.setItem("checkboxstatus", checkboxState);
	location.reload();	
} 

// read cookie
var selectedItem = docCookies.getItem("jsonselected");
if (!selectedItem) {
	$("#choice")[0].selectedIndex = 0;
} else {
	var select = document.getElementById("choice");
	select.value = selectedItem;	
}

var checkboxState = docCookies.getItem("checkboxstatus");
if (checkboxState == "true") {
	$("#random").prop("checked", true);
}

// json file, get selected json file in the select box
var jsonFile = $("#choice option:selected").val();
var data = (function () {
    var data = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': jsonFile,
        'dataType': "json",
        'success': function (data2) {
            data = data2;
        }
    });
    return data;
})(); 

// count number of nodes in the json file
number = data.questions.length;
number = number-1

// function for random questions without duplicate
var arrayNumbers = [];
for (var i=0;i<=number;i++) {
	arrayNumbers.push(i);
}
function getRandomNumber() {
   var fakeRandom = Math.floor(Math.random()*arrayNumbers.length);
   return arrayNumbers.splice(fakeRandom, 1)[0];
}
//function getNumber() {
//	return arrayNumbers.splice(0, 1)[0];
//}

// mobile or not
var isMobile = 0;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	isMobile = 1;
}
var numRand2 = -1;
var questionsCounter = 0;
var finished = 0;
// Question function
function showQuestion() {
	document.getElementsByTagName("textarea")[0].style.display = "block";
	$("#answer2").show();
	$("textarea").val('').blur();
	if($("#random").prop('checked')) {
		var numRand = getRandomNumber();
		questionsCounter++;
		document.querySelector(".questionsCounter").textContent = questionsCounter + "/" + (number+1);
		document.getElementById("reload").innerHTML = "New question <i>(F4)</i>";
		$("#prev").hide();
	} else {
		if($("#prev").data("clicked")) {
			numRand2 -= 1;
			var numRand = numRand2;
			console.log(numRand);
			$("#prev").data("clicked", false);
			finished = 0;
		} else {
//			var numRand = getNumber();
			numRand2 += 1;
			var numRand = numRand2;
			console.log(numRand);
		}
		document.querySelector(".questionsCounter").textContent = (numRand+1) + "/" + (number+1);
		document.getElementById("reload").innerHTML = "Next <i>(F4)</i>";
		$("#reload").removeClass("deactivated");
		$(".finished").hide();
		if (numRand == 0) {
			$("#prev").addClass("deactivated");
		} else {
			$("#prev").removeClass("deactivated");
		}
	}
	
	if ((numRand == undefined) || (data.questions[numRand] == undefined)) {
		$("#reload").addClass("deactivated");
		document.querySelector(".key").textContent = "You have finished";
		document.getElementsByTagName("textarea")[0].style.display = "none";
		document.querySelector(".questionsCounter").textContent = "-/-";
		$(".finished").show();
		$("#answer2").hide();
		finished = 1;
	} else {
		document.getElementById("cadrequestion").innerHTML="<div class='key'>" + data.questions[numRand].question + "</div>";
		actualquestion = data.questions[numRand].response;
		// replace all types of whitespaces
		actualquestion = actualquestion.replace(/\s/g, " ");

		if (document.getElementById("answer2") ){
			document.getElementById("answer2").textContent = actualquestion;
		}

	}		
	$("#answer, #answer2").trigger('autosize.resize');
	
	//focus at the end if not mobile
	if (isMobile == 0) {
		var textareaElement = $("#answer").get(0);
		var textareaElementLenght = textareaElement.value.length;
		textareaElement.selectionStart = textareaElementLenght;
		textareaElement.selectionEnd = textareaElementLenght;
		textareaElement.focus();
	}
	document.getElementById("resultwrong").style.display = "none";
	document.getElementById("resultcorrect").style.display = "none";
}

// submit function
function submit() {
    var userInput = $("textarea").val();
//	console.log(userInput.toLowerCase() + "  -  " + actualquestion.toLowerCase());
    if (userInput.toLowerCase() == actualquestion.toLowerCase()) {
        document.getElementById("resultcorrect").style.display = "block";
		document.getElementById("resultwrong").style.display = "none";
    } else {
		document.getElementById("resultwrong").style.display = "block";
		document.getElementById("resultcorrect").style.display = "none";
    }
	// diff	
	var dmp = new diff_match_patch();
	var d = dmp.diff_main(userInput, actualquestion);
	dmp.diff_cleanupSemantic(d);
	var ds = dmp.diff_prettyHtml(d);
	document.getElementById("correction").innerHTML = ds;
}

//ready
$( document ).ready(function() {
	// enter key
	$("#answer").keypress(function (e) {
		if (e.which == 13) {
			submit();
			return false;
		}
	});	
	// F4 key
	$("body").keydown(function(e) {
		if (e.which == 115) {
			if (finished !== 1) {
				showQuestion();
				return false;
			}
		}
		if (e.which == 114) {
			if (numRand2 > 0) {
				$("#prev").data("clicked", true);
				showQuestion();
				$("#prev").focus();
				return false;
			}
		}
	});
	
	
	$("#reload").click(function() {
		if (finished !== 1) {
			showQuestion();
		}
	});
	$("#prev").click(function(){
		if (numRand2 > 0) {
			$(this).data("clicked", true);
			showQuestion();
		}
	});
	showQuestion();

	$("#answer").autosize();
	
	$("#showhelp").click(function() {
			if($('#container').is(':visible')){
				$("#container").hide();
				$("#help").fadeIn(800);
				$("#showhelp").addClass("selected");
			} else {
				$("#help").hide();
				$("#container").fadeIn(800);
				$("#showhelp").removeClass("selected");
			}	
	});
	
	$(".close").click(function() {
		$("#help").hide();
		$("#container").fadeIn(800);
		$("#showhelp").removeClass("selected");
	});
	$(".finished").hide();
}); //end