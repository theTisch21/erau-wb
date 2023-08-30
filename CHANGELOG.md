# v3.0 Linear flow

Takes out a lot of the jank of the inner code. Everything now runs through a linear flow.
This will make future changes and bugfixes significantly easier, and will allow more people to understand the inner workings of this code.

# v2.5 Add failsafe if site cannot get proper METAR data

Sometimes, the METAR doesn't report certain data, like the temperature or altiiter. This patch changes the METAR parsing code to use a partial type and only report what it can find. The main site will then only use the data that the METAR parsing code found.

Adds a notice system to the main page, allowing code to post notices rather than throwing an error when something goes wrong. If a peice of data isn't found in a METAR, the code will post a notice rather than going to a 500 error.

# v2.4 Use winds instead of multiplier

Changes the performance multiplier to use wind speed instead

# v2.3.1 Labels for inputs

Added some labels to the input boxes to clear up confusion

# v2.3 QOL 1

A couple of quality of life features

- Button to set fuel to max allowed if overweight
- Aircraft overrides if site data is different from ETA data
- Performance multiplier for winds

# v2.2 Alert system

Added a function that allows me to post an urgent alert on the site. This is important if something is inaccurate, like an incorrect aircraft weight or if the website will go down for maintenance.

# v2.1 Live METAR

The site now pulls METAR data from the Aviation Weather Center and uses it to calculate performance data

# v2.0 Performance calculations

Added takeoff, landing, and climb performance calculations
Also added the aircraft's tail number for quick reference

# v1.2 Fix rounding

Sets it so that most numbers are rounded down to 2 decimal places

# v1.1 Pressure altitude and Va

Added pressure altitude and maneuvering speed calculators

# v1.0 First release

First full stable release, was simply the calculator and limits
