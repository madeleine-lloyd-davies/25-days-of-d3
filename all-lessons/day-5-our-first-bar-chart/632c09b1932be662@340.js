// https://observablehq.com/@thetylerwolf/day-5-our-first-bar-chart@340
function _1(md){return(
md`
# Day 5 - Our First Bar Chart

Today we're going to apply all of the concepts we've learned thus far to build our first bar chart. I'll also introduce D3 axes. By the end of this lesson, bar charts will be a snap.
`
)}

function _2(md){return(
md `### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js brought to you by [Tyler Wolf](https://tylernwolf.com).*`
)}

function _container(d3)
{
  
  const data = d3.range(0,150)
  
  const svg = d3.create('svg')
    .attr('width', 900)
    .attr('height', 125)
  
  const color = d3.scaleOrdinal().range(d3.schemeSet2.slice(0,6))
  
  svg.selectAll('rect')
    .data( data )
    .join('rect')
      .attr('width', 30)
      .attr('height', 30)
      .style('opacity', '0.7')
      .style('fill', color)
      .style('rx', 3)
      // .style('mix-blend-mode', 'multiply')
      .each(function() {
    
        const x = -30 + Math.random() * (900 + 30),
              y = -30 + Math.random() * (125 + 30)
      
        d3.select(this)
            .attr('x', x)
            .attr('y', y)
            .attr('transform', `rotate(${ Math.random() * 90 } ${ x + 15 } ${ y + 15 })`)
    
      })
      
    
  
  return svg.node()
}


function _4(md){return(
md `
# Introduction

We're all familiar with bar charts, so I won't spend much time on introducing them. The code for this lesson is structured the same way you would want it to be in your actual implementation. I'll walk through the code step by step, explaining the purpose and function of each piece. There are a few new concepts, which I'll make sure to explain.
`
)}

function _5(md){return(
md `
# The Chart

  The first thing we need to do with any chart is get the data. Last Friday was Black Friday, so I was inspired to use data about the shopping frenzy. We'll use this as the basis for our bar chart. We'll draw a bar for each year along the x-axis. The height of each bar will be based on the amount spent (\`\`value\`\`) for each year.
`
)}

function _data(){return(
[
  { year: 2005, value: 734.69 },
  { year: 2006, value: 750.70 },
  { year: 2007, value: 755.13 },
  { year: 2008, value: 694.19 },
  { year: 2009, value: 681.83 },
  { year: 2010, value: 718.98 },
  { year: 2011, value: 740.57 },
  { year: 2012, value: 752.24 },
  { year: 2013, value: 767.24 },
  { year: 2014, value: 802.45 },
  { year: 2015, value: 805.65 },
  { year: 2016, value: 935.58 },
  { year: 2017, value: 967.13 },
  { year: 2018, value: 1007.24 },
]
)}

function _7(md){return(
md `
Next, we need to establish some details about our chart. We'll be placing it an \`\`900\`\` x \`\`500\`\` SVG, so we're defining that here. We'll be using these variables to bound our chart graphics.
`
)}

function _height(){return(
500
)}

function _width(){return(
900
)}

function _10(md){return(
md `
Here we define the chart margins. This is the whitespace around the chart. As we place axes and labels, we'll want to add margin around the bars to make sure everything fits tidily within the rendering area.
`
)}

function _margin(){return(
{
  top: 10,
  right: 10,
  bottom: 20,
  left: 35
}
)}

function _12(md){return(
md `
Next, we find the maximum value from our dataset. We'll need this to correctly set the domain of our y-axis.
`
)}

function _yMax(d3,data){return(
d3.max(data, d => d.value)
)}

function _14(md){return(
md `
Our x-axis is defined by our x scale. The x scale is a \`\`scaleBand\`\`, something we haven't seen before. This is an ordinal scale. Given an array of values as the domain, this scale will divide the defined range of pixels (a minimum and maximum value) into evenly-sized segments. The segments correspond to the domain values, respectively.

\`\`.padding(0.5)\`\` defines how much space in a segment is devoted to the bars vs. how much is for padding between the bars. This scale saves us a lot of trouble when aligning and placing bars.
`
)}

function _xDomain(data){return(
data.map(d => d.year)
)}

function _xScale(d3,xDomain,margin,width){return(
d3.scaleBand()
    .domain( xDomain )
    .range([ margin.left, width - margin.right - margin.left ])
    .padding(0.5)
)}

function _17(md){return(
md `
Our y scale is a simple linear scale. Its range is defined by our chart height and padding. Note that zero corresponds to the bottom of the chart area and the max value corresponds to the the top of the chart area.
`
)}

function _yScale(d3,yMax,height,margin){return(
d3.scaleLinear()
    .domain([ 0, yMax ])
    .range([ height - margin.bottom, margin.top ])
)}

function _19(md){return(
md `
Finally, we define our x and y axes. Axes in D3 serve a simple purpose: they are used to render an axis and they're made to work seamlessly with scales.

First, we choose where we want the axis placed (bottom, left, etc.). This will decide how the axis is oriented. Then, we pass a scale to the axis - this will define the size of the axis and the range of tick values that it renders. Later on, we'll use the axes to actually render themselves on the chart.

Axes are quite configurable. For example, \`\`.tickSizeOuter(0)\`\` makes it so that the outermost ticks on the chart don't render visibly. Try removing that line and see what happens on the chart below. You can [read about the many axis configurations available here](https://github.com/d3/d3-axis/tree/v1.0.12).
`
)}

function _xAxis(d3,xScale){return(
d3.axisBottom(xScale)
    .tickSizeOuter(0)
)}

function _yAxis(d3,yScale){return(
d3.axisLeft(yScale)
    .tickSizeOuter(0)
)}

function _22(md){return(
md `
Below is the code to finally render the chart. Most of this should be familiar, so it won't require much explanation. You'll see comments where anything new comes up.
`
)}

function _bars(html,d3,data,xScale,yScale,height,margin,xAxis,yAxis)
{
  
  const container = html `<svg width="900" height="500"/>`
  
  const svg = d3.select(container)
  
  svg.append('g')
    .attr('class', 'bars')
    .selectAll('rect')
    .data( data )
    .join('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.year))
      .attr('y', d => yScale(d.value))
      // bandwidth is a special function of scaleBand
      // it returns the width of the band (bar) based on the configuration
      // we set up earlier
      .attr('width', xScale.bandwidth())
      // remember that yScale(0) is the height of the entire chart
      // so we subtract the y position of the top of the bar yScale(d.value)
      // from it to get the total height of the bar.
      .attr('height', d => yScale(0) - yScale(d.value))
      .style('fill', '#7472c0')
  
  // Here we render the x axis
  svg.append('g')
      .attr('class', 'x-axis')
      // First set its container's (g) position to the 
      // bottom of the chart
      .attr('transform', `translate(0,${ height - margin.bottom })`)
      // then just call this to render it
      .call( xAxis )

  // it works the same for the y axis
  svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${ margin.left },0)`)
      .call( yAxis )
  
  return container
  
}


function _24(md){return(
md `
And we're done! This chart is far from publication-ready; I've left out a lot of details like dollar signs ($) on the y axis ticks, a title, etc. Data visualization is not just about using code, but there's a large element of design and visual communication that goes into crafting great visualizations. But that's not what this lesson is about!

From this lesson, you should have a much better understanding of how all of the elements and functionality you've learned about thus far work together to make an actual chart - that is, how data is used to drive graphics in D3.

[Tomorrow](https://observablehq.com/@thetylerwolf/day-6-donut-chart?collection=@thetylerwolf/25-days-of-d3), we'll step our game up by using SVG paths to draw a pie chart. See you then!

-Tyler
`
)}

function _25(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
)}

function _26(md){return(
md`
**There are many ways to make a bar chart in D3 and some are much better than others. This lesson uses more or less the same method as [Mike Bostock's bar chart example](https://observablehq.com/@d3/bar-chart)*
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
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("container")).define("container", ["d3"], _container);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("data")).define("data", _data);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("yMax")).define("yMax", ["d3","data"], _yMax);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("xDomain")).define("xDomain", ["data"], _xDomain);
  main.variable(observer("xScale")).define("xScale", ["d3","xDomain","margin","width"], _xScale);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("yScale")).define("yScale", ["d3","yMax","height","margin"], _yScale);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("xAxis")).define("xAxis", ["d3","xScale"], _xAxis);
  main.variable(observer("yAxis")).define("yAxis", ["d3","yScale"], _yAxis);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("bars")).define("bars", ["html","d3","data","xScale","yScale","height","margin","xAxis","yAxis"], _bars);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
