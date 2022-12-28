// https://observablehq.com/@thetylerwolf/day-8-scatter-plot@347
function _1(md){return(
md`
# Day 8 - Scatter Plot


`
)}

function _2(md){return(
md `
Today we learn the scatter plot, the last of our basic charts series. After this, we'll start visualizing more complex data with more complex charts.
`
)}

function _3(md){return(
md `### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js is from [Tyler Wolf](https://tylernwolf.com).*
`
)}

function _4(md){return(
md `
# Introduction

Scatter charts are great for comparing two or more values between many different items. In D3, they're actually quite simple. Per usual, I'll only chime in when we're introducing a new concept or part of the D3 API. This one should go quickly!

Oh, and one more thing. I created a legend for today's chart. This is important if you want to make a chart that people understand! however, I won't be explaining the legend code. I encourage you to take the time to understand it. It uses functionality and concepts that we've learned in the previous days.
`
)}

function _5(md){return(
md `
## The Code

Our dataset today is a comparison of the profits vs. revenue of 36 businesses in the 2017 *Fortune* 500 companies list.

[Source](https://data.world/garyhoov/largest-food-packaged-goods-companies-2016)
`
)}

async function _data(d3,FileAttachment){return(
Object.assign(d3.csvParse(await FileAttachment("scatter_data.csv").text(), d3.autoType), { x: 'Revenue ($MM)', y: 'Profits ($MM)' })
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
  right: 100,
  bottom: 30,
  left: 50
}
)}

function _10(md){return(
md `
For both the \`\`xScale\`\` and \`\`yScale\`\`, I've used \`\`d3.extent()\`\` to generate the domain. This takes an array and an accessor and returns a two-element array with the minimum and maximum values from the array like this: \`\`[ minValue, maxValue ]\`\`.

This utility is useful in all kinds of situations.
`
)}

function _xScale(d3,data,margin,width){return(
d3.scaleLinear(
  d3.extent( data, d => d.revenues_mm ),
  [ margin.left, width - margin.right ]
)
)}

function _yScale(d3,data,height,margin){return(
d3.scaleLinear(
  d3.extent( data, d => d.profit_mm ),
  [ height - margin.bottom, margin.top ]
)
)}

function _13(md){return(
md `
For the \`\`colors\`\` scale, I'm not passing a domain. The ordinal scale will automatically assign the next range value to any new domain values it receives and that's totally sufficient for this chart.
`
)}

function _colors(d3){return(
d3.scaleOrdinal().range(d3.schemeCategory10)
)}

function _xAxis(d3,xScale){return(
d3.axisBottom(xScale)
)}

function _yAxis(d3,yScale){return(
d3.axisLeft(yScale)
)}

function _legend(d3,data,colors)
{
  const svg = d3.create('svg')
      .attr('width', 900)
      .attr('height', 25)
  
  const categories = data.reduce((acc, d) => {
    acc[d.category] = true
    return acc
  },{})
  
  svg.selectAll('g')
    .data( Object.keys(categories).sort((a,b) => a.charAt(0) == 'H' ? 1 : -1) )
    .join('g')
      .attr('transform', (d,i) => `translate(${i * 125},5)`)
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
       .text(d => d)
     )
  
  return svg.node()
  
}


function _chart(html,d3,data,xScale,yScale,colors,margin,yAxis,height,xAxis,width)
{
  
  const svg = html `<svg width="900" height="500" />`
  
  const g = d3.select(svg)
    .append('g')
      .style('font-family', 'sans-serif')
      .style('font-size', 10)
  
  g
    .selectAll('g')
    .data( data )
    // each data point is a group
    .join('g')
      .attr('class', 'scatter-point')
      .attr('transform', d => `translate(${xScale(d.revenues_mm)},${yScale(d.profit_mm)})`)
    // .call() passes in the current d3 selection
    // This is great if we want to append something
    // but still want to work with the original selection after that
    .call(g => g
      // first we append a circle to our data point
      .append('circle')
        .attr('r', 5)
        .style('stroke', d => colors( d.category ))
        .style('stroke-width', 2)
        .style('fill', 'transparent')
    )
    .call(g => g
      // then we append a text label to the data point
      .append('text')
        .attr('x', 8)
        .attr('dy', '0.35em')
      // I've filter out values too low in order to avoid label overlap
      // see what happens if you remove the condition and just return d.company
      .text(d => d.revenues_mm < 10000 ? '' : d.company)
     )
 
  d3.select(svg)
    .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${ margin.left },0)`)
    .call(yAxis)
      // remove the line between the ticks and the chart
      .select('.domain').remove()
  
  d3.select(svg)
    .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${ height - margin.bottom })`)
    .call(xAxis)
      // remove the line between the ticks and the chart
      .select('.domain').remove()
  
  // Here, I'm appending and positioning the y-axis label (Profit ($MM))
  g.append('g')
      .attr('transform', `translate(${margin.left + 6},${margin.top + 4})`)
    .append('text')
      .attr('transform', 'rotate(90)')
    .text(data.y)

  // Here, I'm appending and positioning the x-axis label (Revenue ($MM))
  g.append('text')
      .attr('x', width - margin.right - 6)
      .attr('y', height - margin.bottom - 5)
      .attr('text-anchor', 'end')
    .text(data.x)
  
  return svg
  
}


function _19(md){return(
md `
# Conclusion

Another chart down! This chart presents some design challenges that I had to resist the temptation to address in the lesson. Namely, it would be nice to be able to read all of the labels and the y-axis could use an indicator for the zero line. In order to avoid complicating things, I decided to save mouse interactions for another day.

Hopefully, the scatter plot code was easy to follow. By now, you should notice that pretty much every chart follows the same pattern: Set dimensions/margins, set up the scales and any generators, then start placing graphics and text. It's really that simple and it gets easier with time.

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-9-stacked-bar-chart?collection=@thetylerwolf/25-days-of-d3)!
`
)}

function _20(md){return(
md` 
*The chart in today's lesson pulled inspiration and was partialy derived from Mike Bostock's [Scatter Plot Example](https://observablehq.com/@d3/scatterplot)*
`
)}

function _21(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
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
    ["scatter_data.csv", {url: new URL("./files/3669d64a24bda05fa850345fa68bc7d1dc7e56f14f8cbdcd33a074d64ead1a56af88cff9ed99d57c7bdd1342f364403236071fceccc7bfdbff65f20c7a7ec081.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("xScale")).define("xScale", ["d3","data","margin","width"], _xScale);
  main.variable(observer("yScale")).define("yScale", ["d3","data","height","margin"], _yScale);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("colors")).define("colors", ["d3"], _colors);
  main.variable(observer("xAxis")).define("xAxis", ["d3","xScale"], _xAxis);
  main.variable(observer("yAxis")).define("yAxis", ["d3","yScale"], _yAxis);
  main.variable(observer("legend")).define("legend", ["d3","data","colors"], _legend);
  main.variable(observer("chart")).define("chart", ["html","d3","data","xScale","yScale","colors","margin","yAxis","height","xAxis","width"], _chart);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
