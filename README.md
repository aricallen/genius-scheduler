#GeniusScheduler

A bookmarklet that grabs your weekly shift from mypage and creates an .ics file for your calendar

Just add the bookmarklet below to your bookmarks bar.

Just drag the following link to your bookmark bar!

<a href="javascript:(function(){document.body.appendChild(document.createElement('script')).src='https://github.com/aricallen/genius-scheduler/script.js';})();">A Link</a>

Alternatively, create a new bookmark and add the following code as the source.

```javascript
javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://www.curiousrhythms.com/genius-scheduler/script.js';})();
```

Then...
Navigate to where you can see your schedule for the week on mypage and click the bookmarklet.

An .ics file will be created with your shifts for the week that you can add to your calendar of choice (just double click it in downloads).

##Example

![Example MyPage](https://raw.githubusercontent.com/aricallen/genius-scheduler/master/example-mypage.png)

##Background

Inspired by Kronical and Roster Genius. Two programs that used to provide a solution for this need but were taken down for whatever reason. So I decided to build my own version. We work in a place where we shouldn't have to keep manually put our schedules into our devices!

Hopefully you will find this an easy and useful tool that will save everyone time and energy :)

##Works In

- Chrome (you may have to "allow unsafe script" for it to work)

##To Do

- Test other browsers

##Contributing

Comment here if you find any bugs, have any suggestions or feature requests. Pull requests and forks always welcome!

