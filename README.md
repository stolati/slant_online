# slant_online

Next features: 
- Hints based on a rule system (loops -1, 1 - 1, 3 -3)
- Group linked by color, maybe change the color of done colors by grey/black
- Show free cell more and more, so the last ones are very visible. Maybe increment by the filling percentage.
- Possibilies of big map, of map not rectangle.
- Figure out the findloop.c and see if it's needed for javascript, and see if we can use it incrementally.
- Otherwise figure out looping incrementally
- Tutorial based on the pattern
- Separate the zone.js into multiples sub elements :
  - Have a props : onFinishedNoError => trigger the ok/ko resolution
  - Have a props : content
  - Tests on map process
  - See if webworkers would be useful
- Have the map in golang (figure out how to do it)
  - rewrite in golang
  - cgo
  - https://stackoverflow.com/questions/6125683/call-go-functions-from-c
  - https://www.ardanlabs.com/blog/2013/08/using-c-dynamic-libraries-in-go-programs.html
- Users names, keep user cookies, maybe have color with users, or icons.
- Better map, infinite map, and mouse-click move way of moving around. 
- Handle phone screen working properly.

- Merge the python servers into a single one.
- Figure out how to spread websockets properly.
- Have a real database (maybe sql), with fake one for local dev, and saving data for production (mabye aws rds).

Then after all that, I guess its going to be done. Maybe send an email to Simon to say how I appreciate his games.

- Better hosting and deployment :
  - https://rollout.io/blog/the-shortlist-of-docker-hosting/
  - travis ci
  - docker hub account (needed ?)
  - Use specfic account for this.

- Game in other formats :
  - http://manpages.ubuntu.com/manpages/precise/man6/slant.6.html


# Next steps :
- Filling map for the main map
- Seiing where people are playing on the main map
- Refresh content of 
- Jenkins ?
