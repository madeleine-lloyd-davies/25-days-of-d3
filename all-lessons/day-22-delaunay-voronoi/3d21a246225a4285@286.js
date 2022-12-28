// https://observablehq.com/@thetylerwolf/day-22-delaunay-voronoi@286
function _1(md){return(
md`
# Day 22 - Delaunay/Voronoi

Voronoi diagrams can be beautiful and captivating and they also have a very practical application for building interactions.
`
)}

function _2(md){return(
md `
### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://observablehq.com/@thetylerwolf/25-days-of-d3), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js is from [Tyler Wolf](https://tylernwolf.com).*
`
)}

function _3(d3,width,height,data,color)
{
  
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#1a1a1a')
  
  // Generate the delaunay triangulation of our data
  // takes data, x accessor and y accessor as arguments
  const delaunay = d3.Delaunay.from( data, d => d.x, d => d.y ),
        // Generate teh voronoi diagram from our delaunay triangulation
        // Takes the bounds of our diagram area as arguments [x0,y0,x1,y1]
        voronoi = delaunay.voronoi([ 0, 0, width, height ])
  
  svg.selectAll('path')
      // Construct a data object from each cell of our voronoi diagram
      .data( data.map((d,i) => voronoi.renderCell(i)) )
      .join('path')
        .attr('d', d => d)
        .style('fill', (d,i) => color( data[i].value ))
        .style('opacity', 0.8)
        .style('stroke', 'white')
        .style('stroke-opacity', 0.2)
 
  
  // append all of our points so that we can see how they line up with the voronoi
  svg.selectAll('circle')
    .data( data )
    .join('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 1.5)
    .style('fill', 'white')

  return svg.node()
  
}


function _4(md){return(
md `
# Introduction

Voronoi diagrams are a visualization of the areas surrounding a set of points wherein a given point is the closest to any location in its enclosing area. That's a bit dense, but I'll be illustrating how this works and how we can use it in today's lesson.

# The Data

Our data today is a randomly generated set of points within the width and height of our svg. The magnitude of each point is set by a [https://en.wikipedia.org/wiki/Perlin_noise](perlin noise function) using [https://github.com/xixixao/noisejs](noise.js). This means the values of each point are between -1 and 1. I did a little bit of tuning on the noise function to make things look nicer.
`
)}

function _data(noise,d3,width,height)
{
  const n = (new noise.Noise(Math.random()))
  
  const noiseFactor = 0.4
  
  const d = d3.range(200).map(() => { 
    const x = Math.floor(Math.random() * width),
          y = Math.floor(Math.random() * height),
          value = n.perlin2( x/(width * noiseFactor ) , y/(height * noiseFactor ))
    
    return { x, y, value }
  })
  
  return d
}


function _6(md){return(
md `
# A basic hover scenario

To demonstrate the utility of voronoi diagrams, consider the "chart" below. Each point is configured using the \`\`.on('mouseenter')\`\` function so that when the user hovers on the point, the point is highlighted with a thicker stroke.
`
)}

function _chart(d3,width,height,data,color)
{
  
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#1a1a1a')
  
  svg.selectAll('circle')
      .data( data )
      .join('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => Math.max(Math.abs(20 * d.value), 3))
        .style('fill', d => color(d.value))
        .style('fill-opacity', 0.85)
      .on('mouseenter', function(e,d) {
        d3.select(this)
          .transition()
            .style('stroke', color(d.value))
            .attr('stroke-width', 20)
            .attr('stroke-opacity', 0.7)
      })
      .on('mouseleave', function(e,d) {
        d3.select(this)
          .transition()
            .attr('stroke-width', 0)
      })
  
  return svg.node()
  
}


function _8(md){return(
md `
# Improvement using Delaunay and Voronoi

The above example is not a bad solution. It _does_ work. But it also presents some challenges. Namely, it can get tricky to hover on a really tiny point. Also, some points are really close together and even overlap, making it even harder to get to them. So, how do we fix it? We use \`\`d3.Delaunay()\`\`!

### a little history

\`\`d3.Delaunay()\`\` can be used to generate a voronoi diagram. In D3, there is a function called \`\`d3.voronoi()\`\`, which can be used for generating voronoi diagrams. This was the way to do it forever until D3 v5. \`\`d3-delaunay\`\` is new in D3 v5 and is recommended over \`\`d3.voronoi()\`\`. It is a more efficient algorithm for generating voronoi diagrams. However, it is not included when you use the D3 library. It must be included as an [additional module](https://github.com/d3/d3-delaunay).

For those interested, there is a [very thorough explanation of how the algorithm works and performs](https://observablehq.com/@mbostock/the-delaunays-dual) from Mike Bostock.

### Generating a voronoi diagram

Below, I generate a voronoi diagram from our points. While I've assigned a value to each point to set its size, the algorithm doesn't use that information - it only looks at the x and y positions of the points. When the voronoi is generated, it looks like the below - I've included our points to illustrate how the diagram works.

Remember, each polygon surrounds a single data point such that any point within the polygon is closer to that data point than any other. (code explanation inline)
`
)}

function _voronoi(d3,width,height,data,color)
{
  
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#1a1a1a')
  
  // Generate the delaunay triangulation of our data
  // takes data, x accessor and y accessor as arguments
  const delaunay = d3.Delaunay.from( data, d => d.x, d => d.y ),
        // Generate teh voronoi diagram from our delaunay triangulation
        // Takes the bounds of our diagram area as arguments [x0,y0,x1,y1]
        voronoi = delaunay.voronoi([ 0, 0, width, height ])
  
  svg.selectAll('path')
      // Construct a data object from each cell of our voronoi diagram
      .data( data.map((d,i) => voronoi.renderCell(i)) )
      .join('path')
        .attr('d', d => d)
        .style('fill', (d,i) => color( data[i].value ))
        .style('opacity', 0.8)
        .style('stroke', 'white')
        .style('stroke-opacity', 0.2)
 
  
  // append all of our points so that we can see how they line up with the voronoi
  svg.selectAll('circle')
    .data( data )
    .join('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 1.5)
    .style('fill', 'white')

  return svg.node()
  
}


function _10(md){return(
md `
# Tying it together

Now that we have an intuitive understanding of how a voronoi diagram works, we can use the voronoi algorithm to improve our mouse interaction. The way we do this is, we take a \`\`x\`\` and \`\`y\`\` positions of the user's mouse interaction and find the nearest point to it in our voronoi diagram.

The way this used to work was, you had to place the voronoi diagram and make it transparent, then match the voronoi cell to its corresponding point somehow. But that was the old days.

Today, things are much easier. We don't even have to render our voronoi diagram. Instead, we use \`\`delaunay.find()\`\` and pass the \`\`x\`\` and \`\`y\`\` coordinates of the user's mouse to it. The function returns the nearest point's index and we can use that to select our point.

Check out the example below to see this in action.
`
)}

function _hoverChart(d3,width,height,data,color)
{
  
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#1a1a1a')
  
  // Generate the delaunay to start
  const delaunay = d3.Delaunay.from( data, d => d.x, d => d.y )
  
  // Place our points as normal
  const points = svg.selectAll('circle')
      .data( data )
      .join('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => Math.max(Math.abs(20 * d.value), 3))
        .style('stroke-width', 0)
        .style('stroke-opacity', 0.7)
        .style('stroke', (d,i) => color(d.value))
        .style('fill', d => color(d.value))
        .style('fill-opacity', 0.85)
  
  // put a mousemove event on the svg (not the circles)
  svg.on('mousemove', function(e) {
    // get our mouse positions in the svg element
    const { layerX, layerY } = e
    
    // find the index of the nearest point to the mouse position 
    const pointIndex = delaunay.find( layerX, layerY )

    // Iterate through all points and set stroke-width based on whether
    // or not it's our selected point
    points
      .transition()
        .style('stroke-width', (d,i) => i == pointIndex ? 20 : 0 )
    
  })
  // When the mouse leaves the svg, set all stroke-widths to zero
  .on('mouseleave', function() {
    
    points
      .transition()
        .style('stroke-width', 0 )
    
  }) 
  
  return svg.node()
  
}


function _12(md){return(
md `
# Conclusion

Our example above could be optimized using css to set \`\`stroke-width\`\`s and classing the selected and un-selected circles appropriately. But that's a different set of lessons on optimization - this course is focused on using the D3 library. More on that later!

Voronoi is a fantastic utility for creating both creative work and improving our user interactions. I encourage you to explore what else it can be used for!

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-23-force-simulation)!

-Tyler
`
)}

function _13(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
)}

function _color(d3){return(
d3.scaleLinear()
  .domain([ -1, 1 ])
  .range([ '#309', '#ff630f' ])
)}

function _width(){return(
900
)}

function _height(){return(
500
)}

function _d3(require){return(
require('d3@6', 'd3-delaunay')
)}

function _noise(require){return(
require('https://bundle.run/noisejs@2.1.0')
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
  main.variable(observer()).define(["d3","width","height","data","color"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("data")).define("data", ["noise","d3","width","height"], _data);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("chart")).define("chart", ["d3","width","height","data","color"], _chart);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("voronoi")).define("voronoi", ["d3","width","height","data","color"], _voronoi);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("hoverChart")).define("hoverChart", ["d3","width","height","data","color"], _hoverChart);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("noise")).define("noise", ["require"], _noise);
  main.variable(observer("end")).define("end", _end);
  return main;
}
