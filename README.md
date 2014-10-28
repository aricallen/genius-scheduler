#GeniusScheduler

A bookmarklet that grabs your weekly shift from mypage and creates an .ics file for your calendar

##How To

- Create a blank or dummy bookmark
- Copy the code below and paste it into the URL portion of the bookmark

```javascript
javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://www.curiousrhythms.com/genius-scheduler/script.js';})();
```

- Navigate to where you can see your schedule for the week on mypage and click the bookmarklet.

- An .ics file will be created with your shifts for the week that you can add to your calendar of choice (just double click it in downloads).

##Used On Page

![Example MyPage](https://raw.githubusercontent.com/aricallen/genius-scheduler/master/example-mypage.png)

##Background

Inspired by previous similar projects [Kronical](http://byronthegreat.com/kronical/) and [Roster Genius](https://github.com/joshhunt/rostergenius). These used to provide a solution for this need but were taken down for whatever reason. So I decided to build my own version. We work in a place where we shouldn't have to keep manually put our schedules into our devices!

Hopefully you will find this an easy and useful tool that will save everyone time and energy :)

##Tested In

OS X:

10.10
- Safari
- Chrome

10.9:
- Safari
- Chrome

Notes: 
Chrome - by default blocks the script from performing
- you may have to click "allow unsafe script" for it to work... (click the shield in the address bar)
When I updated to Yosemite, the .ics file was being opened by "CalendarHelper" and needed to be changed to "Open With Calendar"
- get info on file and change all to "Calendar"

iOS:

8.0 +
- Mobile Safari

##To Do

- Make compatible with 10.8

##Contributing

Comment here if you find any bugs, have any suggestions or feature requests. Pull requests and forks always welcome!

