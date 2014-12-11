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
	// include jsTimeZoneDetect
	var done = false;
	var jsTZDScript = document.createElement("script");
	jsTZDScript.src = "//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js";
	jsTZDScript.onload = jsTZDScript.onreadystatechange = function(){
		if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
			done = true;
			tz = jstz.determine(); // Determines the time zone of the browser client
		 	// console.log(tz.name());
		 	var minV = "1.3.2";
			var preferredV = "2.1.1";
			// //ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js

			// include jQuery now that jsTZD is loaded
			if (window.jQuery === undefined || window.jQuery.fn.jquery < minV) {
				var done = false;		
				var jQueryScript = document.createElement("script");
				jQueryScript.src = "//ajax.googleapis.com/ajax/libs/jquery/" + preferredV + "/jquery.min.js";
				jQueryScript.onload = jQueryScript.onreadystatechange = function(){
					if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
						done = true;
						// both libraries loaded, mine data
						mineScheduleData(tz);
					}
				};
				document.getElementsByTagName("head")[0].appendChild(jQueryScript);
			} else {
				$(document).ready(function() {
					mineScheduleData(tz);
				});
			} // jQuery ready
		} // jsTZD ready
	};
	document.getElementsByTagName("head")[0].appendChild(jsTZDScript);

	// including jQuery
	// the minimum version of jQuery we want
	
	
	function mineScheduleData(tz) {
		var currentURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
		// actual page:
		// https://mypage.apple.com/myPage/myTime.action?method=forwardSchedule&activeMenu=forwardSchedule
		
		if (currentURL.indexOf('mypage.apple.com') == -1 && currentURL.indexOf('localhost') < 0) {
			alert("Open the bookmark when viewing schedule on mypage to save the selected calendar week.");
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
			var pathToICSCreater = "http://www.curiousrhythms.com/genius-scheduler/receiver.php";
			// var pathToICSCreater = "http://localhost/production/genius-scheduler/receiver.php";
			createICS(scheduleData, pathToICSCreater, tz);
		}

	} // gatherData();

	function getBeginningDate(scheduleHeader) {
		var month;
		var monthNum;
		var date;
		var year;
		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		scheduleHeader = scheduleHeader.split(" ");
		for (var i = 0; i < scheduleHeader.length; i++) {
			scheduleHeader[i] = scheduleHeader[i].replace(/\W/g, '');
		}

		for (var i = 0; i < scheduleHeader.length; i++) {
			var textPiece = scheduleHeader[i];
			if (months.indexOf(textPiece) !== -1) {
				monthNum = months.indexOf(textPiece);
				month = textPiece;
			}
			if (monthsLong.indexOf(textPiece) !== -1) {
				monthNum = monthsLong.indexOf(textPiece);
				month = textPiece
			}
			if ( month == textPiece && scheduleHeader[i+1].length < 3 && scheduleHeader[i+2].length == 4 ) {
				date = scheduleHeader[i+1];
				year = scheduleHeader[i+2];
			}
		}

		aDate = {
			"month" : parseInt(monthNum),
			"date" : parseInt(date),
			"year" : parseInt(year),
		}

		// pp(aDate, 'a date');

		GSDate = new Date();
		GSDate.setMonth(aDate.month);
		GSDate.setDate(aDate.date);
		GSDate.setFullYear(aDate.year);
		// pp(GSDate, 'gs date');
		return GSDate;
	}

	function getDays() {
		var dayNames = getDayNames();
		var days = [];
		$('.day').each(function() {
			var $this = $(this);
			var $text = $this.text();
			if ($text === '') {
				$text = 'splitShift';
			}
			days.push($text.replace(/\W/g, ''));
		});
		for (var i = 0; i < days.length; i++) {
			if(dayNames.indexOf(days[i]) < 0 && days[i] !== 'splitShift') {
				// other text that is not a day i.e. RTO
				days[i] = '';
			}
		}
		days = cleanArray(days); // removes empty strings
		days = handleSplitShift(days);
		return days;
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

	function getDayNames() {
		return ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
	}

	/*
	shifts = [ { day:..., startTime: ..., endTime:... } ];
	 */

	function formatScheduleData(shifts, beginningDate) {
		var dayNames = getDayNames();
		var scheduleDataArray = []; // array of schedule data objects
		for(i=0; i < shifts.length; i++) {
			var incrDate = dayNames.indexOf(shifts[i].day);
			var variableDate = new Date();
			variableDate.setMonth(beginningDate.getMonth());
			variableDate.setFullYear(beginningDate.getFullYear());
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

	function createICS(dataArray, pathToICSCreater, tz) {
		var schedule_data_json = JSON.stringify(dataArray);
		document.location = pathToICSCreater + "?schedule_data_json=" + schedule_data_json + "&client_tz=" + tz.name();
	}

	function pp(data, text) {
		if(text == undefined) {
			console.log(data);
		} else {
			console.log(data, text);			
		}
	}
})(); // main{} siaf















