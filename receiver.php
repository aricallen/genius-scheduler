<?php
	define("TESTING", false);

/**
 * receive json data mined from bookmarklet
 * parse data and create ics file 
 */
	if ( isset($_REQUEST['schedule_data_json']) && $_REQUEST['schedule_data_json'] ) {
		$schedule_data_json = $_REQUEST['schedule_data_json'];
		if(TESTING) {
			echo '<a href="https://www.curiousrhythms.com/genius-scheduler/raw-source.html">Reload</a>';
			echo '<br /><br /><br />';
			echo $schedule_data_json ? $schedule_data_json : "no data retrieved";
			echo "<br /><br />";
			echo print_r(json_decode($schedule_data_json));			
		}
	}


	if(!TESTING) {
		header('Content-type: text/calendar; charset=utf-8');
		header('Content-Disposition: attachment; filename=work_schedule.ics');   
	}

	$schedule_data = json_decode($schedule_data_json);
	$a_date = $schedule_data[0];

	date_default_timezone_set("America/New_York");

?>
BEGIN:VTIMEZONE
TZID:America/New_York
X-LIC-LOCATION:America/New_York
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
CALSCALE:GREGORIAN

<?php 

	$eol = "\r\n";
	$br = "<br />";

	$cal = $br . $br;
	$cal .= "BEGIN:VCALENDAR" . $br;
	$cal .= "VERSION:2.0" . $br;
	$cal .= "PRODID:-//hacksw/handcal//NONSGML v1.0//EN" . $br;
	$cal .= "CALSCALE:GREGORIAN" . $br . $br;

	foreach( $schedule_data as $a_date ) {

		/**
		 * Parse and format time from $a_date
		 * - $a_date = json object from js
		 * - format for ics
		 */

		$start_hour = parse_hour_from_string($a_date->startTime); // (int) 19
		// echo $start_hour . $br;
		
		if( !$start_hour ) { 
			if(TESTING) { echo "off"; }
			continue; 
		}
		
		$start_minutes = parse_minutes_from_string($a_date->startTime); // (int) 30
		$start_time = make_gs_timestamp($a_date, $start_hour, $start_minutes);
		$cal_start_time = date_for_cal($start_time);
		
		$end_hour = parse_hour_from_string($a_date->endTime);
		$end_minutes = parse_minutes_from_string($a_date->endTime);
		$end_time = make_gs_timestamp($a_date, $end_hour, $end_minutes);
		$cal_end_time = date_for_cal($end_time);

	/*/~~~~~~~~~~~~~////~~~~~~~~~~~~~~////~~~~~~~~~~~~~/*/

	/**
	 * Build Events
	 */

		$uid = uniqid();
		$stamp = date_for_cal(time());
		$description = escape_string( " " . str_replace(":00", "", $a_date->startTime) . "-" . str_replace(":00", "", $a_date->endTime) . " Work" );

		$cal .= "BEGIN:VEVENT" . $br;
		$cal .= "UID:$uid" . $br;
		$cal .= "DTSTART:$start_time" . $br;
		$cal .= "DTEND:$end_time" . $br;
		$cal .= "DTSTAMP:$stamp" . $br;
		$cal .= "DESCRIPTION:$description" . $br;
		$cal .= "SUMMARY:$description" . $br;
		$cal .= "END:VEVENT" . $br;
		$cal .= $br;

?>

BEGIN:VEVENT
UID:<?php echo $uid . $eol; ?>
DTSTART;TZID=America/New_York:<?php echo $cal_start_time . $eol; ?>
DTEND;TZID=America/New_York:<?php echo $cal_end_time . $eol; ?>
DTSTAMP:<?php echo $stamp . $eol; ?>
DESCRIPTION:<?php echo $description . $eol; ?>
SUMMARY:<?php echo $description . $eol; ?>
SEQUENCE:1
END:VEVENT
<?php
	} // end foreach VEVENT loop
?>

END:VCALENDAR
	<?php 

	$cal .= "END:VCALENDAR" . $br;

	if(TESTING) {
		echo $cal;
		echo $br;
	}

	/*/~~~~~~~~~~~~~////~~~~~~~~~~~~~~////~~~~~~~~~~~~~/*/

	/*
	// json[0] from js
		object(stdClass)[1]
		public 'dayName' => string 'Saturday' (length=8)
		public 'startTime' => string '10:00AM' (length=7)
		public 'endTime' => string '7:00PM' (length=6)
		public 'month' => int 8
		public 'date' => int 20
		public 'year' => int 2014
	*/

	/*/~~~~~~~~~~~~~////~~~~~~~~~~~~~~////~~~~~~~~~~~~~/*/

	/**
	* Formatting Functions
	*/

	function make_gs_timestamp( $a_date, $hour, $minutes ) {
		$month_string = strval($a_date->month + 1);
		$timestamp = strtotime($month_string . "/" . $a_date->date . "/" . $a_date->year);
		// pp($timestamp);
		$timestamp = strtotime("+" . $hour . " hours", $timestamp);
		$timestamp = strtotime("+" . $minutes . " minutes", $timestamp);
		return $timestamp;
	}

	function date_for_cal($timestamp) {
		// return date('Ymd\THis\Z', $timestamp);

		// if using TZID=America/New_York:
		return date('Ymd\THis', $timestamp);
	}

	// Escapes a string of characters
	function escape_string($string) {
		return preg_replace('/([\,;])/','\\\$1', $string);
	}

	// takes time string (7:00PM) and returns the hour amount needed (19)
	function parse_hour_from_string($time) {
		if ( "00:00AM" == $time ) {
			return false;
		}
		$pattern = '/pm/i';
		$not_noon = true;
		if ( $time === "12:00PM" ) {
			$not_noon = false;
		}
		$additional = stripos($time, "pm") && $not_noon ? 12 : 0;
		$hour = strlen($time) == 6 ? intval(substr($time, 0, 1)) : intval(substr($time, 0, 2));
		return $hour + $additional;
	}

	function parse_minutes_from_string($time) {
		$hour = parse_hour_from_string($time);
		if ( $hour < 10 ) {
			return intval(substr($time, 2, 2));
		} else {
			return intval(substr($time, 3, 2));			
		}
	}

?>