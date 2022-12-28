// https://observablehq.com/@thetylerwolf/day-15-interactions-4-brushing@201
function _1(md){return(
md`
# Day 15 - Interactions 4 - Brushing

Today marks our fourth interaction and our last, at least for a little while. This is a big one and can get a little tricky, but it is one of the more useful and impressive behaviors in the D3 library.
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

You may not be familiar with the term "Brushing". Brushing is essentially dragging a selection area with the mouse. It's something you've been doing your entire computing life; you probably just didn't know that's what it was called. Now you know and now you can learn how to implement it in D3.

Brushing is useful if you're creating an exploratory visualization. Your users can drag to select a set of data points and filter other data based on that, for example. Scroll down to the live example and try it for yourself.

Brushing seems very complicated to implement and the truth is, it's only a little complicated to implement. Fortunately, we're in this together, so let's get started!

# What does brushing do?

Short answer: a lot. Brushing is quite robustly implemented in D3. It takes care of setting the mouse pointer to a crosshair, creates a bounding box to the drag area, lets the user resize the brush area and move it around after its been created and it even behaves differently when you hold down the ALT key or the SPACE bar. Try it out below to try out all of these features and [read more about it here](https://github.com/d3/d3-brush#d3-brush)

# What doesn't brushing do?

Brushing only provides the interface for interacting with your data. It's up to us to look at what the user is doing with the brush and use that information to do things like figure out what data points are selected or highlight selected data or update another UI element based on that selection.

Below, you'll see our working example along with the code to place the chart and color the circles. There are a few new things in the code, which are explained with comments, along with a few old things. After that, we'll get into programming the brush behavior, itself:
`
)}

function _chart(d3,width,height,color)
{

  // note: width and height are the same value
  
  // d3.randomNormal() picks normally-distributed, random numbers
  // first argument is expected value, second is std-dev
  // more here: https://github.com/d3/d3-random#randomNormal
  const randomGenerator = d3.randomNormal( 0, width / 8 )
  
  const data = d3.range(0,500).map(d => ({
    x: randomGenerator(),
    y: randomGenerator()
  }))
  
  const xScale = d3.scaleLinear([ -width/2, width/2 ], [ -width/2, width/2 ]),
        yScale = d3.scaleLinear([ -height/2, height/2 ], [ -height/2, height/2 ])
  
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
  
  // We'll be calling the brush on this <g>
  // note that it's translated to the center of the viewport
  const container = svg.append('g')
      .attr('class', 'container')
      .attr('transform', `translate(${ width/2 },${ height/2 })`)
  
  const points = container.selectAll('circle.point')
    .data( data )
    .join('circle')
      .attr('class', 'point')
      .attr('cx', d => xScale( d.x ))
      .attr('cy', d => yScale( d.y ))
      .attr('r', 8)
      .style('fill', color)
      .style('opacity', 0.8)
  
  // our axes - remember these?
  const xAxis = d3.axisBottom( xScale )
  container.append('g').call( xAxis )
  
  const yAxis = d3.axisLeft( yScale )
  container.append('g').call( yAxis )
  
  // remove all text elements on the axes (design choice)
  container.selectAll('.tick text').remove()
  
  return svg.node()
  
}


function _color(d3,width){return(
(d) => d3.interpolateViridis( Math.hypot(d.x, d.y) / Math.hypot(width/4, width/4) )
)}

function _6(md){return(
md `
# d3.brush()

The core behavior that makes brushing work in D3 is \`\`d3.brush()\`\`. It's a behavior like \`\`d3.drag()\`\` and it's activated very similarly. We'll be using three options to set up our brushing behavior today. Two of the three settings receive callback functions. I'll explain the settings first, then explain the callback functions after because they're a bit lengthy. 

The first setting is \`\`.extent()\`\`. By now, you probably have a sense for D3 terminology, so you can probably guess that this means the area (in pixels) in which the brush will function. This setting takes an array of two arrays as arguments; the first array is the coordinates of the top-left corner of the functional area and the second array is the bottom-right corner of the functional area. This should sound familar. Because the \`\`<g>\`\` we'll be using the brush in is translated, we set this to \`\`[ [ -width/2, -width/2 ], [ width/2, width/2] ]\`\`

Next, we set \`\`.on('start', brushStart)\`\`. This is a callback function for when the user starts brushing in the functional area.

Finally, we set \`\`.on('brush', brushing)\`\`. This is a callback function for any time the user moves the brush area after starting. This works very similarly to our drag behavior.

\`\`d3.brush()\`\` has many more settings to customize its behavior, including brushes that only move in the x or y directions. [You can learn much more about brushing in D3 here](https://github.com/d3/d3-brush)
`
)}

function _brush(d3,width,brushStart,brushing){return(
d3.brush()
    .extent([ [ -width/2, -width/2 ], [ width/2, width/2] ])
    .on('start', brushStart)
    .on('brush', brushing)
)}

function _8(md){return(
md `
# \`\`brushStart\`\`

This function fires when the user starts brushing. In our example, we take this opportunity to clear our selection and restore color to all circles in the chart. Here's how we do it:

-First we look at \`\`selection\`\`. Here it tells us the bounding box of the current selection area as an array of two-arrays like so: \`\`[ [ top-left coords ], [ bottom-right coords ] ]\`\`.
-We check the x position of the top-left and bottom-right coordinates and see if they're the same - \`\`sameX\`\`
-We check the same for the y position of both - \`\`sameY\`\`
-If we have \`\`sameX\`\` and \`\`sameY\`\`, we color all circles to their original value

This somewhat-complicated way of handling things is necessary because brushStart will fire not only when the brush selection is starting to be drawn, but also when it's starting to be dragged or resized. If we didn't perform the check for a zero-sized box first, we'd have a flicker of all circles being colored in before our selection updated every time. Try removing the if statement if you'd like to see what I mean.
`
)}

function _brushStart(d3,chart,color){return(
function({selection}) {
      const sameX = selection[0][0] === selection [1][0],
            sameY = selection[0][1] === selection [1][1]
      
      if(sameX && sameY) {
        const points = d3.select( chart ).selectAll('circle.point')
        points.style('fill', color)
      }
  }
)}

function _10(md){return(
md `
# \`\`brushing\`\`

In this function, as the brush is drawn, moved or resized, we check which circles are within its bounds. Circles within its bounds are colored in. Those outside are grayed out. 

This code is a little complicated, but if you followed \`\`brushStart\`\` without issue, this should be no problem. This type of code comes up a lot when programming interactions, so I encourage you to get comfortable with it! I've commented this code inline for explanation.
`
)}

function _brushing(d3,chart,color){return(
function({ selection }) {
  
    const points = d3.select( chart ).selectAll('circle.point')
  
    // If our selection is null, there's a problem, so color all of our points in
    if( selection === null ) {

      points.style('fill', color)

    } else {
      // First get the selection x coords in one array and the selection y coords in another
      const sx = [ selection[0][0], selection[1][0] ],
            sy = [ selection[0][1], selection[1][1] ]
      
      points.style('fill', d => {
        // Check whether or not each point is within the x and y coordinates of the selection area  
        const inRangeX = d.x >= sx[0] && d.x < sx[1],
              inRangeY = d.y >= sy[0] && d.y < sy[1]
        
        if(inRangeX && inRangeY) {
          // If the point is within the selection range, color it in
          return color(d)
        } else {
          // Otherwise, it's gray
          return '#ccc' 
        }
        
      })
        
    }
    
  }
)}

function _12(md){return(
md `
# Add brush behavior to the chart

This last part is easy - it works exactly like it did with dragging. We select the element we want to be able to brush over and call \`\`.call( brush )\`\` and we're done.
`
)}

function _13(d3,chart,brush){return(
d3.select( chart )
  .select('g.container')
  .call( brush )
)}

function _14(md){return(
md `
# Conclusion

Now that you know how to brush in D3, you can make some very impressive interactions in you visualizations. We'll start exploring what you can do with your new skills as we enter a new section tomorrow.

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-16-zoomable-area-chart).

-Tyler
`
)}

function _15(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
)}

function _width(){return(
500
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
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("chart")).define("chart", ["d3","width","height","color"], _chart);
  main.variable(observer("color")).define("color", ["d3","width"], _color);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("brush")).define("brush", ["d3","width","brushStart","brushing"], _brush);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("brushStart")).define("brushStart", ["d3","chart","color"], _brushStart);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("brushing")).define("brushing", ["d3","chart","color"], _brushing);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["d3","chart","brush"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
