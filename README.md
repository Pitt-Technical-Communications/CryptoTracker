# CryptoTracker
Cryptocurrencies are very volatile, and an asset's value can skyrocket or plumment in the timespan of a few hours. Some complicated coin data sites are out there, but none are aimed at beginners. Our solution is an intuitive website that provides live updates on coins experiencing unusual growth or loss.

Try out [CryptoTracker](https://ericanderson2.github.io/CryptoTracker/index.html)!

Features
-------------------
* Home page with the current most volatile coins (over 24 hours)
* Pins page with user selected list of coins
* Single coin page with advanced info on any one of thousands of currencies
* Live charts and prices that update as soon as the API does (~1/minute)
* Frequently asked questions for users new to cryptocurrencies
* Responsive display that even works on mobile devices

Implementation
-------------------
The website is powered by JavaScript async functions that gather live crypto data from Coin-Gecko's API. Using JavaSript, HTML and CSS we created a simple and intuitive dashboard complete with charts, prices, and price changes of 10 trending coins. In addition, each coin has its own page containing more information such as a description of the coin and its all time low/high. In order to create the graphs, we used Chart.js and historical data with dynamic red/green coloring depending on price decrease/increase. Users can also create and manage a personalized portfolio as well as view the top 10 most volatile coins. This was accomplished using browser cookies, which will currently store your pins for about 2 days.

Original Developers
-------------------

 * Stefon Miller - [Stefon Miller](https://github.com/StefonMiller)
 * Eric Anderson - [ericanderson2](https://github.com/ericanderson2)
 * Julian Galbraith-Paul - [honest-todd](https://github.com/honest-todd)
 * Charles Lefevre - [chucklefevre55](https://github.com/chucklefevre55)

Contribute
-------------------
Any contribution is appreciated. The currently known errors are registered in the Issues tab. Feel free to take a swing at any one of them.
If you are interested in adding advanced features, try the following:
* Display every coin on a single page and refresh as the user scrolls down (~7000 coins)
* Better search functionality and response for pins page
If you want to implement something which is not on the list, feel free to do so. If you want to merge your work into the main branch, send a pull request and we will have a look at it.
This project uses the MIT license. Feel free to modify and distribute this software for personal or commercial use.
