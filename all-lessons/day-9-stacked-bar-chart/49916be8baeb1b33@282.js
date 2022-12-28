// https://observablehq.com/@thetylerwolf/day-9-stacked-bar-chart@282
function _1(md){return(
md`
# Day 9 - Stacked Bar Chart

The stacked bar chart is conceptually a simple step up from a regular bar chart, but as we'll see in today's lesson, it's a little more complicated than that when it comes to code.
`
)}

function _2(md){return(
md `### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js is from [Tyler Wolf](https://tylernwolf.com).*
`
)}

function _3(md){return(
md `
# Introduction

A stacked bar chart is great for comparing the total amount of a group of data points and the relative sizes of each of the items within the parent group. If you're not familiar with what a stacked bar chart looks like, scroll down to see today's chart in action before you continue reading.

So, what's the difference between building a stacked bar chart and building a regular bar chart? Well, there are a few differences.

First, our data needs to be structured to include each value for each segment of the stack. With a regular bar chart, it was just one value, so a simple array of numbers would suffice. Now, we need all of our values included in an object to describe the bar.

Second, we need to use a stack generator to generate the values for each layer of the stack. We could calculate how tall each stack should be and lay them on top of each other, or we could just use the D3 utility.

Finally, we'll be using a separate group for each layer of our bar stack.

I'll get into the details of each of the above as we move through the code.
`
)}

function _4(md){return(
md `
# The Code

Our data is an extension of our bar chart data. It contains the per capita meat consumption, in kilograms, of 36 countries broken down by type of animal. Meat consumption is an indicator of economic prosperity. It's also interesting to look at how the proportions differ between countries/cultures, even if you're a vegetarian.

Data source: [OECD](https://data.world/oecd/meat-consumption/workspace/project-summary?agentid=oecd&datasetid=meat-consumption)
`
)}

function _5(md){return(
md `
It took a bit of work to get the data in the right format for this chart. It's an array, but it also has a key \`\`categories\`\` on it (because [arrays are objects in javascript](http://es5.github.io/#x15.4)), which contains the keys corresponding to our layers. More on that later.

As always, I encourage you to look at how it was done because this is often part of any visualization project, whether in the browser or as prep for the chart, itself.
`
)}

async function _data(d3,FileAttachment)
{
  
  const parsed = d3.csvParse(await FileAttachment("stacked-bar-meat-consumption.csv").text(), d3.autoType)
    .filter(d => d.location != 'BRICS' && d.location != 'EU27' && d.location != 'OECD')

  const locations = Object.keys( parsed.reduce((acc, d) => {
    acc[d.location] = true
    return acc
  }, {}) )
  
  const categories = Object.keys( parsed.reduce((acc, d) => {
    acc[d.subject] = true
    return acc
  }, {}) )
  
  const allData = locations.map(location => {
    
    const locationData = parsed.filter(d => d.location === location).reduce((acc, d) => {
      acc[ d.subject ] = d.value
      return acc
    }, {})
    
    return Object.assign({
      location,
      total: d3.sum( parsed.filter(d => d.location === location), d => d.value )
    }, locationData)
    
  }).sort((a,b) => b.total - a.total)
  
  return Object.assign( allData, { categories })
}


function _7(md){return(
md `
If you haven't looked at the data, this is what any given country's data looks like:
`
)}

function _8(data){return(
data[7]
)}

function _9(md){return(
md `
  \`\`location\`\` is the country's 3-character ISO code, \`\`total\`\` is the total of all of our meat types and \`\`BEEf\`\`, \`\`PIG\`\`, \`\`POULTRY\`\`, and \`\`SHEEP\`\` represent each layer of our bar stack.

The four layer keys will be referenced in our stack generator.
`
)}

function _width(){return(
900
)}

function _height(){return(
500
)}

function _margin(){return(
{
  top: 10,
  right: 0,
  bottom: 30,
  left: 30
}
)}

function _13(md){return(
md `
We'll be coloring each layer by category, so our \`\`categories\`\` are the domain for our color scale.
`
)}

function _colors(d3,data){return(
d3.scaleOrdinal(
  data.categories,
  d3.schemeGnBu[9].slice(3)
)
)}

function _xScale(d3,data,margin,width){return(
d3.scaleBand(
  data.map(d => d.location),
  [ margin.left, width - margin.right ]
).padding(0.2)
)}

function _yScale(d3,data,height,margin){return(
d3.scaleLinear(
  [ 0, d3.max(data, d => d.total) ],
  [ height - margin.bottom, margin.top ]
)
)}

function _xAxis(d3,xScale){return(
d3.axisBottom(xScale)
    .tickSizeOuter(0)
)}

function _yAxis(d3,yScale){return(
d3.axisLeft(yScale)
)}

function _19(md){return(
md `
Here, I use \`\`d3.stack()\`\`. It's actually quite simple. It returns a function that, when passed an array of values, returns an array of series' that correspond to each layer of the stack. Of course, the stack generator needs to be told which data belongs in the stack.

Below, I pass the list of categories from our data object to the \`\`.keys()\`\` accessor function. This tells the generator that the keys in the \`\`data.categories\`\` array are the keys in each data object that should be used in each layer of the stack. There are four keys, so there will be four layers.

The \`\`.keys()\`\` accessor can also be passed a function. In addition, there are other settings for the stack generator that can be configured if the data has a different structure. You can [read about them here](https://github.com/d3/d3-shape/blob/v1.3.7/README.md#stack).
`
)}

function _stack(d3,data){return(
d3.stack()
  .keys( data.categories )
)}

function _21(md){return(
md `
Below is what the stack generator outputs when we pass in our data. Notice that it's an array of four arrays. Each array is a layer of the stack.

Each layer contains 36 arrays corresponding to the 36 countries on that layer (plus the keys \`\`index\`\` and \`\`key\`\` for convenience).

Each of the 36 arrays contains two numbers: the start value of that layer and the end value of that layer. If you compare these values between layers, you'll see overlap for corresponding countries because these are the data behind the stack positions. Finally, there's also a third item in these arrays - a reference to the data object that was used to generate this layer. It's always good to have that on hand #amirite?

This is a lot to take in, but, as always, worth taking the time to understand.
`
)}

function _22(stack,data){return(
stack( data )
)}

function _23(md){return(
md `
Finally, we're ready for the chart code. Explanations in comments inline.
`
)}

function _legend(d3,data,colors)
{
  const svg = d3.create('svg')
      .attr('width', 900)
      .attr('height', 25)
  
  svg.selectAll('g')
    .data( data.categories.slice(0).reverse() )
    .join('g')
      .attr('transform', (d,i) => `translate(${i * 80},5)`)
    .call(g => g
       .append('rect')
         .attr('width', 20)
         .attr('height', 20)
         .style('fill', d => colors(d))
     )
    .call(g => g
       .append('text')
         .attr('y', 10)
         .attr('x', 25)
         .attr('dy', '0.35em')
         .style('font-size', 12)
         .style('font-family', 'sans-serif')
       .text(d => d[0] + d.slice(1).toLowerCase())
     )
  
  return svg.node()
  
}


function _chart(d3,stack,data,colors,xScale,yScale,height,margin,xAxis,yAxis)
{

  const svg = d3.create('svg')
      .attr('width', 900)
      .attr('height', 500)

  // Pass our data to the stack to generate the layer positions
  const chartData = stack( data ) 
  
  const groups = svg.append('g')
    // Each layer of the stack goes in a group
    // the group contains that layer for all countries
    .selectAll('g')
    .data( chartData )
    .join('g')
      // rects in the same layer will all have the same color, so we can put it on the group
      // we can use the key on the layer's array to set the color
      .style('fill', (d,i) => colors(d.key))
  
  groups.selectAll('rect')
    // Now we place the rects, which are the children of the layer array
    .data(d => d)
    .join('rect')
      .attr('x', d => xScale(d.data.location))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth())

  svg.append('g')
    .attr('transform', `translate(0,${ height - margin.bottom })`)
    .call(xAxis)
  
  svg.append('g')
    .attr('transform', `translate(${ margin.left },0)`)
    .call(yAxis)
    .select('.domain').remove()

  return svg.node()
  
}


function _26(md){return(
md `
# Conclusion

That's it! A stacked area chart. Hopefully, this isn't too much of a challenge to wrap your head around. Going from data to graphics can be tricky and mentally taxing, but keep going! The more you do it, the more it starts to sink in and make sense.

Today, we coered our first "non-standard" chart. The source data is not too complicated, but you can see that we now have to think strategically about how we structure the data in order for it to flow naturally and make it easier to build graphics around it.

From now on, rather than focusing purely on new types of charts, I'm going to focus on introducing new data topologies (and charts that use them). This is because there is a lot of similarity between how we generate, for example, a stacked bar chart and a [stacked area chart](https://observablehq.com/@d3/stacked-area-chart) and we can move a little faster into less chart-specific D3 topics like building interactions and animations.

Anyway, that's all for today. See you [tomorrow](https://observablehq.com/@thetylerwolf/day-10-treemap?collection=@thetylerwolf/25-days-of-d3)!

-Tyler
`
)}

function _27(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
)}

function _28(md){return(
md`
**Portions of this example are derived from [Mike Bostock's stacked bar chart example](https://observablehq.com/@d3/stacked-bar-chart)*
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
    ["stacked-bar-meat-consumption.csv", {url: new URL("./files/14852c1af0cc188d3ac72a2b244cace41ca9135cb4d85121602b4d4770ffdba4b3c6aee932924f5aa7b109421fd82207c457563bd90e3739b18f1b82e0cab579.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["data"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("colors")).define("colors", ["d3","data"], _colors);
  main.variable(observer("xScale")).define("xScale", ["d3","data","margin","width"], _xScale);
  main.variable(observer("yScale")).define("yScale", ["d3","data","height","margin"], _yScale);
  main.variable(observer("xAxis")).define("xAxis", ["d3","xScale"], _xAxis);
  main.variable(observer("yAxis")).define("yAxis", ["d3","yScale"], _yAxis);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("stack")).define("stack", ["d3","data"], _stack);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["stack","data"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("legend")).define("legend", ["d3","data","colors"], _legend);
  main.variable(observer("chart")).define("chart", ["d3","stack","data","colors","xScale","yScale","height","margin","xAxis","yAxis"], _chart);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
