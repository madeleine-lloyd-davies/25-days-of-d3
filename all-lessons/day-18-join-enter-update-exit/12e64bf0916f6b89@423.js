// https://observablehq.com/@thetylerwolf/day-18-join-enter-update-exit@423
function _1(md){return(
md`
# Day 18 - Join, Enter, Update, Exit

If you're learning D3 for the first time through these lessons, you've got it easy! When I was learning, we had to learn the whole enter, update, exit pattern just to start using the library. You may have no idea what I'm talking about and that's ok, because today we're going to learn what \`\`selection.join()\`\` is really all about.

I've intentionally avoided getting into this topic until now. Most lessons I've seen about D3 go straight to the enter, update, exit pattern. The truth is, it's hard to understand and see how it's applied in practice, plus it's not completely necessary to make good charts (see the last 17 days of this course).

On the flip side, no D3 guide would be complete without teaching the enter, update exit pattern. It is, in fact, central to using D3 for anything beyond static charts. Understanding the pattern fully will take you very far.
`
)}

function _2(md){return(
md `
### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://observablehq.com/@thetylerwolf/25-days-of-d3), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js is from [Tyler Wolf](https://tylernwolf.com).*
`
)}

function _3(md){return(
md `
# Introduction

_**note** This lesson is adapted from Mike Bostock's [description of selection.join()](https://observablehq.com/@d3/selection-join)_

In every lesson so far, we've used the following pattern to place our elements based on data:

\`\`d3.selectAll('whatever').data( data ).join('whatever')\`\`

This lets us bind data to our elements, then place them in the DOM based on the data. It even adds new elements and removes old ones when we update the data with different values. This is quite handy and it's gotten us this far. But there's a little more to the whole thing that I haven't mentioned yet.

\`\`selection.join()\`\` also gives us fine-grained control over how we handle newly created elements, persisting elements and exiting elements.
`
)}

function _4(md){return(
md `
# selection.join('text')

As I mentioned, when we update our data, then our SVG elements using \`\`selection.join('whatever')\`\`, D3 automatically adds elements corresponding to newly added data (enter selection), re-orders elements corresponding to already-existing data (update selection) and removes elements corresponding to data that no longer exists (exit selection).

In the code below, this is exactly what we do. A list of players is sorted by their score. An array of the top 10 players is bound to a selection of \`\`text\`\` elements. We update the data every 2 seconds by randomizing player scores and again taking the top 10 players and \`\`.join()\`\`ing them.
`
)}

async function* _5(generatePlayers,d3,randomizeScores,Promises)
{
  // the data is generated from a function that returns a new data set for each example
  const players = generatePlayers()
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 300)
  
  while(true) {
  
    svg.selectAll('text')
      .data( players.slice(0,10) )
      .join('text')
        .attr('transform', (d,i) => `translate(${ 10 },${ i * 30 })`)
        .attr('x', 5)
        .attr('dy', '1.25em')
        .style('font-size', 14)
        .style('font-family', 'sans-serif')
      .text(d => d.name)
    
    // randomizeScores assigns each player's score to a random number
    randomizeScores( players )
    
    yield svg.node()
    // This loop repeats every 2 seconds
    await Promises.tick(2000)
    
  }

}


function _6(md){return(
md `
It just works! We don't have to manually remove the old data when we update. That's nice. One caveat is that elements are bound to data in the order they appear in the data array. So, for example, if we keep the same data, but change its order, the svg elements will not remember which data was on which element. We'll fix this in this next example.

Now consider this - what if we want to highlight players that have just moved into the top 10 since our last update? In order to do that, we need to look at the players that are new to our data array. Setting this up only takes a few steps.

The first thing we need to do is instruct D3 how to tell our data points apart. We do this by utilizing the second argument to \`\`selection.data()\`\` known as the key. This second argument can take an accessor function that is applied to each element of the data we're passing to the first argument. The returned value is the "key" of that element (a string) and lets D3 know that any data bearing that key in the update selection should be bound to the same \`\`text\`\` element. In this case, each \`\`player.name\`\` is unique, so we use that as the key.

The second thing we do is tell the join how to handle our enter and update elements.

When we aren't passing a single string as an argument, \`\`selection.join()\`\` takes three functions as arguments. Each function is passed the enter, update, and exit selections, respectively. If any of the three arguments doesn't receive a value, its selection is removed.

Below, I set the elements in the enter selection to their positions and color them blue. I then set the elements in the update selection to their positions and color them black. The exit selection is removed. By watching the animation, you can get a feel for what's going on with enter and update. 
`
)}

async function* _7(generatePlayers,d3,randomizeScores,Promises)
{
  
  const players = generatePlayers()
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 300)
  
  while(true) {
   
    svg.selectAll('text')
      .data( players.slice(0,10), player => player.name )
      .join(
        enter => enter.append('text')
            .attr('transform', (d,i) => `translate(${ 10 },${ i * 30 })`)
            .attr('x', 5)
            .attr('dy', '1.25em')
            .style('font-size', 14)
            .style('font-family', 'sans-serif')
            .style('fill', 'blue')
            .text(d => d.name),
        update => update
            .attr('transform', (d,i) => `translate(${ 10 },${ i * 30 })`)
            .style('fill', 'black')
      )

    yield svg.node()
    
    randomizeScores(players, 50)
    
    await Promises.tick(2000)
  }

}


function _8(md){return(
md `
Now we'll take a look at the exit selection. This time I've added a transition to the elements - enter elements now fade in, update elements now animate to their new position and exit elements turn red and slide out of the player list. Notice that the number of entering (blue) players will be the same as the number of exiting (red) players because our list is of fixed length:
`
)}

async function* _9(generatePlayers,d3,randomizeScores,Promises)
{
  
  const players = generatePlayers()
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 300)
  
  while(true) {
    
    svg.selectAll('text')
      .data( players.slice(0,10), d => d.name )
      .join(
        enter => enter.append('text')
            .attr('transform', (d,i) => `translate(${ 10 },${ i * 30 })`)
            .attr('x', 5)
            .attr('dy', '1.25em')
            .style('font-size', 14)
            .style('font-family', 'sans-serif')
            .style('fill', 'blue')
            .style('opacity', 0)
          .text(d => d.name)
          .transition().duration(1000)
            .style('opacity', 1)
            // Note that as of v6, we have to call .selection() here
            // This is because without it, we are returning the transition we've created,
            // but selection.join() requires us to return a selection for enter and update groups
            // (but not exit groups)
            .selection()
        ,
        update => update
          .transition().duration(1000)
            .attr('transform', (d,i) => `translate(${ 10 },${ i * 30 })`)
            .style('fill', 'black')
            .selection(),
        exit => exit
          .style('fill', 'red')
          .transition().duration(1000)
            .attr('transform', (d,i) => `translate(${ 100 },${ i * 30 })`)
            .remove()
      )

    yield svg.node()
    
    randomizeScores(players, 50)
    
    await Promises.tick(2000)
  }

}


function _10(md){return(
md `
# Conclusion

Hopefully, it's clear from the previous examples how changes to data produce enter, update and exit selections and how you can control them with \`\`selection.join()\`\`

A little history on this leaderboard example - One of the first enter/update/exit charts I ever made with D3 was a leaderboard for a hackathon. It took me hours to figure out how to make things work the way I wanted them to because I didn't really understand how enter/update/exit worked - I just followed examples I found online.

Now, years later, this took me less than an hour to throw together. It is my hope that this all makes sense to you so that hurdle doesn't stand in your way as you continue to learn your way through D3!

Below, I've made a more complete version of our leaderboard. I've added logic so that entering and exiting players climb up and drop out. I've also added logic so that the first 3 players are colored gold, silver and bronze.
`
)}

async function* _11(generatePlayers,color,d3,updateScores,Promises)
{
  
  const players = generatePlayers(),
        colors = color( players )
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 310)
      
  while(true) {
    
    svg.selectAll('g')
      .data( players.slice(0,11), d => d.name )
      .join(
        enter => enterRects(enter),
        update => updateRects(update),
        exit => exitRects(exit)
      )


    yield svg.node()
    updateScores(players)
    
    await Promises.tick(3000)
  }

  function enterRects(enter) {
    
    enter.append('g')
        .attr('transform', (d,i) => `translate(${ 10 },${ 350 })`)
        .style('opacity', 0)
      .call(g => g
        .transition().duration(1000)
          .attr('transform', (d,i) => `translate(${ 10 },${ 10 + i * 30 })`)
          .style('opacity', 1)
      )
      .call(g => 
        g.append('rect')
            .attr('width', 280)
            .attr('height', 25)
            .style('fill', (d,i) => {
              if( i == 0 ) return 'gold'
              else if( i == 1 ) return 'silver'
              else if ( i == 2 ) return '#cd7f32'
              else return colors( d.name )
            })
            .style('opacity', 0.8)
            .attr('rx', 3)
      )
      .call(g => 
        g.append('text')
            .attr('x', 5)
            .attr('dy', '1.2em')
            .style('font-size', 14)
            .style('font-family', 'sans-serif')
          .text(d => `${ d.name } - ${ d.score }`)
          .raise()
      )
  }
  
  function updateRects(update) {
    
    update
      .call(g => g
        .transition().duration(1000)
          .attr('transform', (d,i) => `translate(${ 10 },${ 10 + i * 30 })`)
      )
      .call(g => g.select('text')
          .text(d => `${ d.name } - ${ d.score }`)
      )
      .call(g => g.select('rect')
        .transition().duration(1000)
          .style('fill', (d,i) => {
            if( i == 0 ) return 'gold'
            else if( i == 1 ) return 'silver'
            else if ( i == 2 ) return '#cd7f32'
            else return colors( d.name )
          })
      )
  }
  
  function exitRects(exit) {
    
    exit
      .call(g =>
        g.transition().duration(1000)
            .attr('transform', (d,i) => `translate(${ 10 },${ 350 })`)
            .style('opacity', 0)
          .remove()
      )
  }
  
}


function _12(md){return(
md `
See you [tomorrow](https://observablehq.com/@thetylerwolf/day-19-interpolators)!
  
-Tyler
`
)}

function _13(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
)}

function _color(d3){return(
(players) => d3.scaleOrdinal(
  players.map(player => player.name),
  d3.quantize( d3.interpolateRdYlGn, players.length )
)
)}

function _updateScores(d3){return(
(players, stdDev) => {
  players.forEach(d => d.score += Math.floor(d3.randomNormal(100, stdDev || 10)()/10))
  players.sort((a,b) => b.score - a.score)
}
)}

function _randomizeScores(d3){return(
(players, stdDev) => {
  players.forEach(d => d.score = Math.floor(d3.randomNormal(100, stdDev || 10)()/10))
  players.sort((a,b) => b.score - a.score)
}
)}

function _generatePlayers(d3){return(
() => d3.range(30).map(d => ({
  name: `Player ${ d }`,
  score: 0
}))
)}

function _d3(require){return(
require('d3@6')
)}

function _end()
{
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id='+atob('Ry1ZSk5YRDNIUlAx');
  script.type = 'text/javascript';
  script.async = true;

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      var dataLayer = window.dataLayer;
      dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', atob('Ry1ZSk5YRDNIUlAx'));
  };
  document.body.appendChild(script);
}


export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["generatePlayers","d3","randomizeScores","Promises"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["generatePlayers","d3","randomizeScores","Promises"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["generatePlayers","d3","randomizeScores","Promises"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["generatePlayers","color","d3","updateScores","Promises"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("updateScores")).define("updateScores", ["d3"], _updateScores);
  main.variable(observer("randomizeScores")).define("randomizeScores", ["d3"], _randomizeScores);
  main.variable(observer("generatePlayers")).define("generatePlayers", ["d3"], _generatePlayers);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
