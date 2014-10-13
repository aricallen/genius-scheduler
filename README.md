#GeniusScheduler

A bookmarklet that grabs your weekly shift from mypage and creates an .ics file for your calendar

Just add the bookmarklet below to your bookmarks bar.

Just drag the following link to your bookmark bar!
[GeniusScheduler](javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://www.curiousrhythms.com/genius-scheduler/script.js';})();)

Alternatively, create a new bookmark and add the following code as the source.

```javascript
javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://www.curiousrhythms.com/genius-scheduler/script.js';})();
```

Then...
Navigate to where you can see your schedule for the week on mypage and click the bookmarklet.

An .ics file will be created with your shifts for the week that you can add to your calendar of choice (just double click it in downloads).

The legend attached to the bottom of the page shows timings for the full page load and hovering over a coloured area on the heatmap will move the timeline indicator to show you when that image was fully loaded.

##Example

![Example Heatmap](http://zeman.github.io/perfmap/example.jpg)

##Background

Conceived as part of a set of [data visualization experiments](http://lab.speedcurve.com) which re-imagined the front-end performance waterfall chart by Mark Zeman from [SpeedCurve](http://speedcurve.com) presented at [Velocity New York 2014.](http://speedcurve.com/blog/velocity-a-better-waterfall-chart/)

##Works In

Chrome

##To Do

- Deal with fixed position elements (calling all front-end ninjas, send me your thoughts on how best to do this)
- Crawl iframe images
- Hover state with more detail on the timings of an individual resource
- User timing, pull out and highlight any elements with associated user timing events
- Expand top nav to show full waterfall chart of all resources. Combine with Andy's [waterfall bookmarklet?](https://github.com/andydavies/waterfall)

##Change Log

- 2014-10-06 First push of rough proof of concept
- 2014-10-07 Added background-image support
- 2014-10-08 Added interactive legend with page level timing and timeline head on overlay hover
- 2014-10-12 Ignore elements with visibility:hidden, check for viewport sized images and treat like a body image, design tweaks

##Thanks

Big thanks to Steve Souders who was inspired enough to whip up the intial code structure while simultaneously participating at WebPerfDays NY. Clever cookie!
