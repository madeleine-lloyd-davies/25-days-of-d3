// https://observablehq.com/@thetylerwolf/day-16-zoomable-area-chart@458
function _1(md){return(
md `
# Day 16 - Zoomable Area Chart

Now that we've learned how to build a bunch of types of charts and how to build a bunch of types of interactions, we can combine some of our knowledge to build something a little more sophisticated.
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

Today we use brushing to create a zoom interaction on an area chart. Even though we're zooming into the chart, this chart doesn't actually use \`\`d3.zoom\`\`. Instead, we use scales and brushing in a clever way to create a zoom effect as the user selects a section of the chart to zoom into.

You'll be introduced to one new generator for this lesson - the \`\`d3.area()\`\`. Otherwise, we're working with the facilities we've learned in previous lessons. What's new about this lesson is how we combine what we've learned to build something pretty impressive. There may be some challenging components to today's code, but take the time to understand what we're doing and why - this is where engineering meets building charts.
`
)}

function _4(md){return(
md `
**Note** *Because this lesson is broken up into so many code segments, it shows buggy behavior if you change the code and don't refresh the page after. I recommend forking the notebook so you can save your changes and refresh without losing them.*
`
)}

function _5(md){return(
md `
# The Data

Today's data is showing CO2 concentration in earth's atmosphere through history until 2018. The dataset goes back over 800,000 years! Talk about big data...

Because the time series is so long, our brush-to-zoom functionality is ideal for taking a closer look at time periods throughout history. Take a look at the data and how it's shaped as we proceed through our chart design.

Data Source: [NOAA Earth System Research Laboratory](https://www.esrl.noaa.gov/gmd/ccgg/trends/data.html)
`
)}

async function _data(d3,FileAttachment){return(
d3.csvParse( await FileAttachment("co2-concentration-long-term.csv").text(), d3.autoType )
    .filter(d => d.Entity === 'World')
    .map(d => {
      const o = {}
      const newKeys = Object.entries(d).map(([key, value]) => {
        const ks = key.split(' ')
        const k = ks.length > 1 ? ks[1].toLowerCase() : ks[0].toLowerCase()
        o[k] = value
      })
      return o
    })
)}

function _7(md){return(
md `
# The Code

Because this chart is made of several parts, I'll show how each piece is built one at a time after the initial svg creation step.

Here's a quick overview of our constituent parts:

-The main chart view - the "focus" view

-The smaller chart that the user can brush on - the "context" view

-The brush itself, which is actually only a horizontal brush (\`\`d3.brushX()\`\`)

In the chart below, try clicking and dragging in the context view to see how our chart works, then continue to the code below.
`
)}

function _chart(d3,width,height){return(
d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .node()
)}

function _9(md){return(
md `
# Layout

This is our first multi-chart chart. It's composed of two charts, so we need to think a little bit about how we lay things out.

Like every chart, we'll want a margin around the charts to accomodate anything that bleeds over. Rather than a margin for each chart, we'll set a margin for the entire composition and we won't put a gap between the focus and the context views.

The focus chart goes on top and should be taller for a more detailed view of the data - I chose 400 arbitrarily.

The context chart goes on the bottom and should be shorter - it's meant to be a UI control element, so no need for high resolution in the data. For the height, I chose 150 because its proportion is nice side-by-side with the focus view and it provides a nice, big brushing area.

This is sufficient planning to move forward:
`
)}

function _margin(){return(
{
  top: 10,
  right: 10,
  bottom: 35,
  left: 30
}
)}

function _width(){return(
900
)}

function _height(height1,height2){return(
height1 + height2
)}

function _height1(){return(
400
)}

function _height2(){return(
150
)}

function _15(md){return(
md `
# Focus View

First, we set up the focus view. It's a chart like any other we've made before. The only new thing about it is that it's an area chart:
`
)}

function _xScale(d3,data,width,margin){return(
d3.scaleLinear()
  .domain(d3.extent( data.map(d => d.year) ))
  .range([ 0, width - margin.right - margin.left ])
)}

function _xAxis(d3,xScale){return(
d3.axisBottom( xScale )
  // Format differently if it's before year 0 vs after year 0
  .tickFormat(d => d < 0 ? Math.abs(d).toLocaleString() + ' BCE' : d )
)}

function _yScale(d3,data,height1,margin){return(
d3.scaleLinear()
    .domain([ d3.min(data.map(d => d.concentration)), d3.max(data.map(d => d.concentration)) ])
    .range([ height1, margin.top])
)}

function _yAxis(d3,yScale){return(
d3.axisLeft( yScale )
)}

function _20(md){return(
md `
# Area generator

I won't get into much detail on this because it's very similar to the line generator. While a line is an open path, an area is a closed path (the line loops back around to close itself). With an area, we generally add a fill so that we can get a sense of the area under the line of our data whe we look at it. Areas are best for cumulative values like stock prices.

The only difference in setting up an area generator vs. a line generator (for the purposes of this lesson) is that we set \`\`.y0()\`\` and \`\`.y1()\`\` (with the line generator, we only set \`\`.y()\`\`).

\`\`.y0()\`\` sets the y-value of the bottom of our area at each point. For this chart, it's just a constant - the y-position at zero.

\`\`.y1()\`\` sets the y-value of the top of our area at each point. For this chart, we use our yScale in an accessor to return the correct y-value.

You can [read more about area generators here](https://github.com/d3/d3-shape/blob/v1.3.7/README.md#areas)
`
)}

function _area(d3,xScale,height1,yScale){return(
d3.area()
  .curve( d3.curveMonotoneX )
  .x(d => xScale(d.year))
  .y0( height1 )
  .y1(d => yScale(d.concentration))
)}

function _22(md){return(
md `
Finally, we place the focus view. For this, we do something we've never done before - we use a \`\`clipPath\`\`. A clip path is an arbitrary shape that we define ourselves. We can use it to "clip" a layer in our SVG so that anything outside of the bounds of our \`\`clipPath\`\` will not appear in our view.

In the focus view, our \`\`clipPath\`\` is a rectangle with the same dimensions as our focus chart. We do this for good reason: When the user zooms into a subset of the chart data in the context view, we're going to stretch the range of our focus chart's \`\`xScale\`\`. This will make it so the chart is rendered over a very large width. Then, we center the selected section of the focus chart in our \`\`clipPath\`\`'s rectangle. This creates the effect of "zooming" into the data. Without the \`\`clipPath\`\`, our chart would bleed out from its scales' bounds and it would just look strange. If you're curious what that looks like, try commenting out the clipPath.

A \`\`clipPath\`\` is defined in a \`\`<defs>\`\` element in the SVG element. This is a glimpse at how SVG can be used for more than just laying out our D3-generated graphics. You can [read more abou \`\`clipPath\`\` here](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath).
`
)}

function _focusView(d3,chart,width,margin,height1,data,area,xAxis,yAxis)
{
  
  const svg = d3.select( chart )
  
  // Placing the <defs> element
  svg.append('defs')
    // placing the clipPath
    .append('clipPath')
      // we use the id to refrence the clipPath later
      .attr('id', 'clip')
    .append('rect')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height1)

  // Place the focus chart
  const focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${ margin.left },${ margin.top })`)
  
  focus.append('path')
    // datum binds the data to the pre-existing element
    // without requiring us to call .join()
    .datum( data )
      .attr('class', 'area')
      // here we set the path to be clipped
      .attr('clip-path', 'url(#clip)')
      .style('fill', '#cf5454')
      .style('stroke', '#cf5454')
      .style('stroke-width', 3)
      // set the path using our area generator
      .attr('d', area)

  focus.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${ height1 })`)
    .call( xAxis )
    // remove the horizontal line on the x axis
    .select('.domain')
    .remove()

  focus.append('g')
      .attr('class', 'y-axis')
    .call( yAxis )
    // remove the vertical line on the y axis
    .select('.domain')
    .remove()
  
  return focus.node()
  
}


function _24(md){return(
md `
# Context View

Now we set up the Context View. Less complicated than the Focus view:
`
)}

function _xScale2(d3,xScale,width,margin){return(
d3.scaleLinear()
  // re-use the domain from the other xScale
  .domain(xScale.domain())
  .range([ 0, width - margin.right - margin.left ])
)}

function _xAxis2(d3,xScale2){return(
d3.axisBottom( xScale2 )
  .tickFormat(d => d < 0 ? Math.abs(d).toLocaleString() + ' BCE' : d )
)}

function _yScale2(d3,yScale,height2,margin){return(
d3.scaleLinear()
  // re-use the y domain as well
  .domain(yScale.domain())
  .range([ height2 - margin.bottom, 0 ])
)}

function _area2(d3,xScale2,height2,margin,yScale2){return(
d3.area()
  .curve(d3.curveMonotoneX)
  .x(d => xScale2(d.year))
  .y0( height2 - margin.bottom )
  .y1(d => yScale2(d.concentration))
)}

function _contextView(d3,chart,margin,height1,data,area2,height2,xAxis2)
{

  const svg = d3.select( chart )
  
  // The context chart
  const context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', `translate(${ margin.left },${ margin.top + height1 })`)
  
  context.append('path')
    .datum( data )
      .attr('class', 'area')
      .style('fill', '#cf5454')
      .attr('d', area2)

  context.append('g')
      .attr('class', 'x-axis')
      .attr('transform',  `translate(0,${ height2 - margin.bottom })`)
    .call( xAxis2 )

  context.append('g')
      .attr('class', 'x-brush')

  return context.node()

}


function _30(md){return(
md `
# Setting up the brush

Now we do some trickery with scales to get the brush working the way we want it. Here's what's going on below.

### \`\`brushed()\`\`

First, we look at \`\`selection\`\`, which is passed into the callback function. This is an array of two values, the x position of the left edge of our brush and the x position of the right edge of our brush. This is different from yesterday because we're using \`\`d3.brushX()\`\` and not regular \`\`d3.brush()\`\`.

We pass each value of our selection's position to \`\`xScale2.intervt()\`\`. Normally, we pass a value within our scale's domain into a scale and we get the corresponding value in the scale's range. \`\`scale.invert()\'\` does the opposite. We pass in a value in the scale's range and we get back the corresponding value in the scale's domain. So, basically, we pass our selection's x-positions, which are values in the range of our \`\`xScale2\`\` and we get back the domain values that define our zoom window. Clever stuff! scale inversions are very useful for user interactions in general.

Next, we set the domain of our focus area's \`\`xScale\`\` to our newly derived \`\`extent\`\`. This is our "zoom" that spreads the focus chart out super wide. Now, we just set our focus view's path and its x axis using the updated scale. Done!

The rest of this code should be familiar to you - just setting up the brush and calling it.
`
)}

function _brush(xScale2,xScale,d3,chart,area,xAxis,width,margin,height2,contextView)
{
  
  function brushed({ selection }) {
    
    let extent = selection.map(d => xScale2.invert(d))
    
    xScale.domain( extent )
    
    d3.select( chart ).select('.area').attr('d', area)
    d3.select( chart ).select('.x-axis').call(xAxis)
    
  }
  
  const brush = d3.brushX(xScale2)
    .extent([[ 0, 20 ], [ width - margin.right - margin.left, height2 - margin.bottom ]])
    .on('brush', brushed)
  
  d3.select( contextView )
    .select('g.x-brush')
    .call(brush)
  
  return brush

}


function _32(md){return(
md `
# Conclusion

Ok, I'll admit it. Today's lesson was tough! It has a lot of moving parts and it's got some clever tricks that make it work. But it's also a great lesson because it demonstrates a couple things you should remember well on your journey to learning D3.

First, this is how it is working with D3. Lots of mathematical tricks and occasional mind-bending solutions that end up being very succint when the code is written, but take a lot of work to understand and implement correctly.

Second, this chart presents some very simple functionality, but it was not easy to make it work. This is the nature of programming and you will see it time and again.

I'll leave you with that. If you had trouble following parts of this lesson, that's no problem. It's probably the most difficult one we'll see in this series and we likely won't be revisiting many of these concepts again. As you familiarize more and more with D3, it will be worth visiting this code again to see if you finally "get it".

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-17-radial-bar-chart)!

-Tyler
`
)}

function _33(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media and click like in the top right of this page**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
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
    ["co2-concentration-long-term.csv", {url: new URL("./files/a17efa7cc0b1d1c02697ef055cc6de3ffcbac8c524785502f39bb70ef5eb6cd9d675b1b1f659c891d5fb4dd9127802e0c4c18465bd48ee7525ad2717304181d1.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("chart")).define("chart", ["d3","width","height"], _chart);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", ["height1","height2"], _height);
  main.variable(observer("height1")).define("height1", _height1);
  main.variable(observer("height2")).define("height2", _height2);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("xScale")).define("xScale", ["d3","data","width","margin"], _xScale);
  main.variable(observer("xAxis")).define("xAxis", ["d3","xScale"], _xAxis);
  main.variable(observer("yScale")).define("yScale", ["d3","data","height1","margin"], _yScale);
  main.variable(observer("yAxis")).define("yAxis", ["d3","yScale"], _yAxis);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("area")).define("area", ["d3","xScale","height1","yScale"], _area);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("focusView")).define("focusView", ["d3","chart","width","margin","height1","data","area","xAxis","yAxis"], _focusView);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("xScale2")).define("xScale2", ["d3","xScale","width","margin"], _xScale2);
  main.variable(observer("xAxis2")).define("xAxis2", ["d3","xScale2"], _xAxis2);
  main.variable(observer("yScale2")).define("yScale2", ["d3","yScale","height2","margin"], _yScale2);
  main.variable(observer("area2")).define("area2", ["d3","xScale2","height2","margin","yScale2"], _area2);
  main.variable(observer("contextView")).define("contextView", ["d3","chart","margin","height1","data","area2","height2","xAxis2"], _contextView);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("brush")).define("brush", ["xScale2","xScale","d3","chart","area","xAxis","width","margin","height2","contextView"], _brush);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
