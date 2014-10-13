/**
 * 	*** Genius Scheduler ***
 * What is it?
 * - bookmarklet that creates an .ics file for the Mac Calendar app
 * 
 * What does it do?
 *  - gathers the times you are working for the displayed week 
 *  - and outputs an .ics file to import into your calendar
 *  
 * Who is it for?
 * - any apple employee that views their schedule via mypage.apple.com
 */

(function(){
	// the minimum version of jQuery we want
	var minV = "1.3.2";
	var preferredV = "2.1.1";
	// //ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js

	// check prior inclusion and version
	if (window.jQuery === undefined || window.jQuery.fn.jquery < minV) {
		var done = false;
		var script = document.createElement("script");
		script.src = "//ajax.googleapis.com/ajax/libs/jquery/" + preferredV + "/jquery.min.js";
		script.onload = script.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				mineScheduleData();
			}
		};
		console.log("appending");
		document.getElementsByTagName("head")[0].appendChild(script);
	} else {
		$(document).ready(function() {
			mineScheduleData();
		});
	}
	
	function mineScheduleData() {
		var currentURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
		// actual page:
		// https://mypage.apple.com/myPage/myTime.action?method=forwardSchedule&activeMenu=forwardSchedule
		
		if (currentURL.indexOf('mypage.apple.com') == -1 && currentURL.indexOf('localhost') < 0 && currentURL.indexOf('curious') < 0) {
			alert("Use this bookmarklet to grab shifts mypage.apple.com and save them to a .ics file to be used in a 'Calendar' app.");
		} else {
			/**
			 * Gather data to send to php
			 * - get the working week
			 * - starting and ending dates
			 */
			var scheduleHeader;
			$('.cellHeader3').each(function() {
				if( $(this).html().indexOf("Schedule") !== -1 ) {
					scheduleHeader = $(this).html();
				} 
			}); // >> Schedule begins Sep 20, 2014 
			var beginningDate = getBeginningDate(scheduleHeader); // >> Sat Sep 26 2014 00:25:51 GMT-0400 (EDT) 
			var days = getDays(); 
			var times = getTimes();
			var shifts = createShifts(days, times);
			var scheduleData = formatScheduleData(shifts, beginningDate);
			
			/**
			 * sending to php to create ics
			 */
			var pathToICSCreater = "https://github.com/aricallen/genius-scheduler/receiver.php";
			createICS(scheduleData, pathToICSCreater);

		}

	} // mineScheduleData();

	function getBeginningDate(phraseArray) {
		var months = new Array();
		months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		phraseArray = phraseArray.split(" ");
		aDate = {
			month : parseInt(months.indexOf(phraseArray[2])),
			date : parseInt(phraseArray[3]),
			year : parseInt(phraseArray[4]),
		}
		GSDate = new Date();
		GSDate.setMonth(aDate.month);
		GSDate.setDate(aDate.date);
		GSDate.setFullYear(aDate.year);

		return GSDate;
	}

	function getDays() {
		var days = [];
		var dayNames = getDayNames();
		$('.day').each(function() {
			var $this = $(this);
			var $text = $this.text();
			$text = $text.replace(/\W/g, '');
			if ($text === '') {
				$text = 'splitShift';
			}
			if (dayNames.indexOf($text) == -1) {
				$text = '';
			}
			days.push($text);
		});
		days = cleanArray(days);
		days = handleSplitShift(days);
		
		return days;
	}

	function getDayNames() {
		return ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
	}

	function handleSplitShift(days) {
		for (var i = 0; i < days.length; i++) {
			if(days[i] === 'splitShift') {
				days[i] = days[i-1];
			}
		}
		return days;
	}

	function getTimes() {
		var times = [];
		$('.time').each(function() {
			times.push($(this).text()); // .replace(/\W/g, ''));
		})
		return cleanArray(times);
	}

	function createShifts(days, times) {
		shifts = [];
		for( i=0, j=0; i < days.length; i++, j+=2 ) {
			var shift = {
				'day': days[i],
				'startTime': times[j],
				'endTime': times[j+1],
			}
			shifts.push(shift);
		}
		return shifts;
	}

	function cleanArray(arr) {
		var better = [];
		for (var i = 0; i < arr.length; i++ ) {
			if(arr[i] !== "" && arr[i].match(/\w/g)) {
				better.push(arr[i]);
			}
		};
		return better;
	}

	/*
		shifts = [ { day:..., startTime: ..., endTime:... } ];
	 */

	function formatScheduleData(shifts, beginningDate) {
		var dayNames = getDayNames();
		var scheduleDataArray = []; // array of schedule data objects
		for( i=0, j=0; i < shifts.length; i++, j+=2 ) {
			var incrDate = dayNames.indexOf(shifts[i].day);
			var variableDate = new Date();
			variableDate.setDate(beginningDate.getDate() + incrDate);
			var formattedScheduleDataObj = {
				dayName : shifts[i].day,
				startTime : shifts[i].startTime,
				endTime : shifts[i].endTime,
				month : variableDate.getMonth(),
				date : variableDate.getDate(),
				year : variableDate.getFullYear(),
			}
			// pp(formattedScheduleDataObj);
			scheduleDataArray.push(formattedScheduleDataObj);
		}
		return scheduleDataArray;
	}

	function createICS(dataArray, pathToICSCreater) {
		var schedule_data_json = JSON.stringify(dataArray);
		document.location = pathToICSCreater + "?schedule_data_json=" + schedule_data_json;
	}

})(); // main{} siaf