// https://observablehq.com/@thetylerwolf/day-23-force-simulation@341
function _1(md){return(
md`
# Day 23 - Force Simulation

Force simulations are a lot of fun, but they do have require a lot of tuning to get things right.
`
)}

function _2(md){return(
md `
### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://observablehq.com/@thetylerwolf/25-days-of-d3), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js is from [Tyler Wolf](https://tylernwolf.com).*
`
)}

function _3(d3,width,height,data,rScale,xScale,margin,color,xAxis)
{
  
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)

  data.forEach(d => d.r = rScale(d.electoralVotes))

  const simulation = d3.forceSimulation( data )
              .force('x', d3.forceX().strength(0.2).x(d => xScale(d.dem/d.total)) )
              .force('y', d3.forceY().strength(0.05).y(margin.top + height / 2) )
              .force('collide', d3.forceCollide().radius(d => d.r + 1 ).strength(1) )


  const g = svg.selectAll('g.node')
      .data( simulation.nodes() )
      .join('g')
      .attr('class', 'node')
      .call( g => g
        .append('circle')
          .attr('r', d => d.r)
          .style('fill', d => color(Math.round(d.dem/d.total)))
          .style('opacity', 0.9)
      )
      .call( g => g
        .append('title')
        .text(d => `${d.state}\nDem: ${d.dem.toLocaleString()}\nRep: ${d.rep.toLocaleString()}\nTotal: ${                           d.total.toLocaleString() }\nElectoral votes: ${d.electoralVotes}\n`)
      )
     
  svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${ height/2 })`)
    .call(xAxis)
  simulation.on("tick", () => g.attr('transform', d => `translate(${ d.x },${ d.y })`) )
  
  return svg.node()
  
}


function _4(md){return(
md `
# Introduction

A force-directed graph layout is one wherein the marks on the chart are placed using a force simulation. This is why they're fun to watch - the simulation can be played out in real time and the exact results are not predictable, so interesting behavior can emerge.

Aside form being fun, force-directed graphs can reveal insights about data that would not otherwise surface from a standard scatter plot or bar chart. We can use factors of the data itself to create relationships and draw connections between data points. In D3, we have a lot of control over how the forces in our simulation work and interact with each other.

Of course, there's also a dark side to this category of chart. There are many cases where a force-direct layout is just not the right tool for the job. Heed this advice: use in good taste.

# The Data

Today's data is about the 2016 US presidential election. Each object in our array represents a state and each state contains data about how many votes were cast for the republican candidate, how many were cast for the democratic candidate, the total number of votes cast in the state and the number of electoral college votes the state has.

[Data Source](https://data.world/vcjaladi/2016-elections-data)
`
)}

async function _data(d3,FileAttachment)
{
  return d3.csvParse( await FileAttachment("1ElectionsData.csv").text(), d3.autoType).map(d => ({
    state: d.State,
    electoralVotes: d.electoralvotes,
    rep: d.votes16_trumpd,
    dem: d.votes16_clintonh,
    total: d.votes
  }))
}


function _6(md){return(
md `
# The code 

The code for this chart is quite simple. The hardest part is understanding the \`\`d3.forceSimulation\`\` api. I will explain the configuration in this example, but I'll refer you to [the \`\`d3.forceSimulation\`\` documentation](https://github.com/d3/d3-force#d3-force) for more detail.

Our simulation configuration looks like this:
`
)}

function _7(d3,data,xScale,margin,height){return(
d3.forceSimulation( data )
  .force('x', d3.forceX().strength(0.2).x(d => xScale(d.dem/d.total)) )
  .force('y', d3.forceY().strength(0.05).y(margin.top + height / 2) )
  .force('collide', d3.forceCollide().radius(d => d.r + 1 ).strength(1) )
)}

function _8(md){return(
md `
That's a lot to take in, so I'll go through it line-by-line.

**d3.forceSimulation()** 

instantiates a new simulation using the passed data array as the simulation's nodes. The simulation starts with default values and starts running immediately.

**.force('x', d3.forceX().strengh(0.2).x(d => xScale(d.dem/d.total)))**

\`\`.force()\`\` adds a new force to the simulation. The first argument is the name of the force and can be set to anything. The second argument is the force, itself.

\`\`d3.forceX()\`\` is a force that acts along the x axis and is applied to all nodes in the simulation.

\`\`.strength()\`\` sets the force's strength toward its center. This is normally within the range 0-1 and essentially sets what percentage of the way the node should move at each increment of the simulation.

\`\`.x()\`\` sets the center of this force, that is, the point at which the nodes are moving toward. As you can see, this can be set using an accessor function. In this case, the position of the force's center depends on the node's percentage of democratic voters. This places our nodes along the x-axis with 50% in the middle.

**.force('y', d3.forceY().strength(0.05).y(margin.top + height / 2) )**

This is very similar to the previous setting, but in the y-direction.

**.force('collide', d3.forceCollide().radius(d => d.r + 1 ).strength(1) )**

Here, I set a collision force on the simulation. This is the force a node has on others when they collide.

\`\`.radius()\`\` sets the radius of our nodes. I've added a pixel to make it a little easier to differentiate our nodes.

\`\`.strength()\`\` sets how forcefully collisions effect the nodes' velocities when they collide. This is affected both by this setting and the strength settings of the other forces.

In the code below, you will notice one more line:

\`\`simulation.on("tick", () => ... )\`\`

This registers a callback to run on each iteration (tick) of the simulation. We use this to update the position of our groups to correspond to the simulation's positioning of the nodes

As you can see from the result, the force settings define where we want the nodes to end up, but they don't guarantee the positions they will end up in. The nodes interact with each other, which means they can block each other from getting to their proper locations. This is where we need to fine tune our simulation. The values used here have been optimized for the data.

There are a lot more configurable settings for force-directed graph layouts, but this will leave you here with enough to get up and running with your own.

Try re-running the simulation to see the simulation run:
`
)}

function _chart(d3,width,height,data,rScale,xScale,margin,color,xAxis)
{
  
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)

  data.forEach(d => d.r = rScale(d.electoralVotes))

  const simulation = d3.forceSimulation( data )
              .force('x', d3.forceX().strength(0.2).x(d => xScale(d.dem/d.total)) )
              .force('y', d3.forceY().strength(0.05).y(margin.top + height / 2) )
              .force('collide', d3.forceCollide().radius(d => d.r + 1 ).strength(1) )


  const g = svg.selectAll('g.node')
      .data( simulation.nodes() )
      .join('g')
      .attr('class', 'node')
      .call( g => g
        .append('circle')
          .attr('r', d => d.r)
          .style('fill', d => color(Math.round(d.dem/d.total)))
          .style('opacity', 0.9)
      )
      .call( g => g
        .append('title')
        .text(d => `${d.state}\nDem: ${d.dem.toLocaleString()}\nRep: ${d.rep.toLocaleString()}\nTotal: ${                           d.total.toLocaleString() }\nElectoral votes: ${d.electoralVotes}\n`)
      )
     
  svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${ height/2 })`)
    .call(xAxis)
  
  // On each iteration (tick) of the simulation, we update the position of our groups
  simulation.on("tick", () => g.attr('transform', d => `translate(${ d.x },${ d.y })`) )
  
  return svg.node()
  
}


function _10(md){return(
md `
# Conclusion

Now you've learned the most coveted of layout in D3, the force-directed layout. Use it wisely.

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-24-making-good-data-vizualization)!

-Tyler
`
)}

function _11(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
)}

function _color(d3){return(
d3.scaleLinear(
  [ 0, 1 ],
  [ '#e91d0e', '#3E36F8' ]
)
)}

function _rScale(d3,data,maxRadius){return(
d3.scaleSqrt()
  .domain([ 0, d3.max(data, d => d.electoralVotes)])
  .range([ 0, maxRadius ])
)}

function _xScale(d3,margin,width){return(
d3.scaleLinear()
  .range([ margin.left, width - margin.right ])
)}

function _xAxis(d3,xScale){return(
d3.axisBottom( xScale )
  .tickValues([0,0.5,1])
  .tickFormat(
    d3.scaleOrdinal(
      [0,0.5,1],
      ['100% Repulican','Split','100% Democrat']
    )
  )
)}

function _margin(){return(
{
  top: 10,
  right: 50,
  bottom: 10,
  left: 50
}
)}

function _maxRadius(){return(
40
)}

function _width(){return(
900
)}

function _height(){return(
500
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
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["1ElectionsData.csv", {url: new URL("./files/b1990e42070a1083cb98933385673f74232f4838dfc0336ac27c68ff0b6aa8cac017a2243fa765cd5fd39153809b0e0eaf8e6ac247fb98ffde831f0b252e516c.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["d3","width","height","data","rScale","xScale","margin","color","xAxis"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["d3","data","xScale","margin","height"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("chart")).define("chart", ["d3","width","height","data","rScale","xScale","margin","color","xAxis"], _chart);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("rScale")).define("rScale", ["d3","data","maxRadius"], _rScale);
  main.variable(observer("xScale")).define("xScale", ["d3","margin","width"], _xScale);
  main.variable(observer("xAxis")).define("xAxis", ["d3","xScale"], _xAxis);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("maxRadius")).define("maxRadius", _maxRadius);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
