// https://observablehq.com/@thetylerwolf/day-7-a-line-chart@283
function _1(md){return(
md`
# Day 7 - A Line Chart

In case you haven't noticed, we've been walking through the basic chart types for the past couple days. We'll be continuing this today with a line chart and tomorrow with another chart. After the basics, we'll increase the complexity of our charts, introducing new ways of representing our data and how to do it all in D3.
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

If you've been following along, a line chart presents very little new to the skills we've developed thus far. The only new function we'll meet is the \`\`line\`\` generator. Otherwise, it's business as usual.

You'll notice the code is getting a little more terse as we progress. I encourage you to take the time to understand anything code that's unclear - working with D3 usually means working with data and making your code more efficient is always a good thing! Of course, you can also ask me on twitter if something doesn't make sense.
`
)}

function _4(md){return(
md `
## The Code

Our data today is the [Big Mac Index](https://www.economist.com/news/2019/07/10/the-big-mac-index), an economic indicator of purchasing power parity across economies. The data is formatted as an array of arrays. Each array corresponds to a country and holds the values for the BMI from 2000 - 2020, so, essentially, each array in our data array corresponds to a line.

I've filtered out four regions of interest for our line chart. Try adding or removing any other regions if you're interested.

For a line chart, we'll want all dates to be in order and ideally each series should have the same x values and a y value for each. Fortunately, this dataset is pretty ideal in that regard. All we need to do now is plot it.

Data source: [The Economist](https://github.com/TheEconomist/big-mac-data)
`
)}

async function _data(d3,FileAttachment)
{
  
  const allData = (d3.csvParse(await FileAttachment("big-mac-raw-index@1.csv").text(), d3.autoType))
    .map(({ date, name, dollar_price, iso_a3 }) => ({ name, iso: iso_a3, date: new Date(date), price: dollar_price }))
  
  return [
    allData.filter(({ iso }) => iso === 'USA'),
    allData.filter(({ iso }) => iso === 'SWE'),
    allData.filter(({ iso }) => iso === 'CHN'),
    allData.filter(({ iso }) => iso === 'EUZ')
  ]

}


function _width(){return(
900
)}

function _height(){return(
500
)}

function _margin(){return(
{
  top: 10,
  right: 80,
  bottom: 30,
  left: 35
}
)}

function _9(md){return(
md `
From now on, I'll use the shorthand for setting up a scale: 

\`\`d3.scaleWhatever( domain, range )\`\` 
`
)}

function _colors(data,d3)
{
  
  const countryNames =  data.map(d => d[0].name)

  return d3.scaleOrdinal( 
    countryNames,
    d3.schemeCategory10
  )
  
}


function _11(md){return(
md `
As mentioned, our data is already in order, meaning it's arranged chronologically. In additon, every line has the same x values (dates). So in order to get our start and end dates of our dataset, all we need to do is get the date of the first point on any line and the date of the last point on any line. In the code below, I used the first line in the dataset, \`\`data[0]\`\`
`
)}

function _xScale(data,d3,margin,width)
{
  
  const startDate = data[0][0].date,
        endDate = data[0][data[0].length - 1].date
  
  return d3.scaleTime(
    // domain
    [ startDate, endDate ], 
    // range
    [ margin.left, width - margin.right ]
  )
  
}


function _yScale(data,d3,height,margin)
{
  // flatten the data into a single array
  const prices = data.flat().map(d => d.price),
        // and find the max value from that array
        yMax = d3.max( [...prices, 8] )
  
  return d3.scaleLinear(
    [ 1, yMax ],
    [ height - margin.bottom, margin.top ]
  )
}


function _14(md){return(
md `
**d3.format()**

For the y axis, our units are US dollars ($), so we want to tell the axis to display its tick values with a dollar sign in front of them and two decimal places after. We don't have to write a special function to figure out the best way to do that. Instead, we can use a tick formatter, yet another helpful D3 utility.

Here's how it works:

\`\`d3.format( specifier )\`\` returns a function that, when passed a value, returns the value in the format specified by the \`\`specifier\`\` string. To put it another way, we tell the formatter how we want it to format our data with \`\`specifier\`\`, then when we pass it a value, it does it.

Below, the specifier is \`\`'$.2f'\`\`, which means return any number we pass in formatted as a dollar value with two decimal places after the zero. For example, \`\`formatter(100)\`\` will return the string \`\`$100.00\`\`.

Formatters come up often if you work with D3 a lot. They're definitely worth taking the time to understand.

The \`\`specifier\`\` formatting is not something you can easily intuit, that I can promise. However, it is documented thoroughly [here](https://github.com/d3/d3-format/blob/v1.4.2/README.md#locale_format).
`
)}

function _yAxis(d3,yScale)
{
  
  const formatter = d3.format('$.2f')
  
  return d3.axisLeft(yScale)
    .tickFormat(d => formatter(d))
  
}


function _xAxis(d3,xScale){return(
d3.axisBottom(xScale)
)}

function _17(md){return(
md `
**d3.line()**

\`\`d3.line()\`\` is a line generator. Just like \`\`d3.arc()\`\` generated path strings for an arc in our pie chart, when passed an array of values, \`\`d3.line()\`\` generates the path string for a line. We'll pass it in to generate the \`\`d\`\` attribute for our line chart's paths. That's all there is to it!

**d3.curveNatural**

\`\`d3.curveNatural\`\` is a curve generator. I won't get into this here, but passing it in to \`\`line.curve()\`\` will change how the curves of the line are rendered. Try commenting out the last line below and see how it changes the chart. You can [read about D3 curve generators here](https://github.com/d3/d3-shape/blob/v1.3.7/README.md#curves).
`
)}

function _line(d3,xScale,yScale){return(
d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.price))
    .curve(d3.curveNatural)
)}

function _container(html,d3,data,line,colors,width,margin,yScale,height,xAxis,yAxis)
{
  
  const svg = html `<svg width="900" height="500" />`
  
  d3.select(svg)
    .selectAll('path')
    .data( data )
    .join('path')
      .attr('class', 'big-mac-line')
      // Using our line generator here
      .attr('d', line)
      // Every data point in the array has a name key
      // so we just grab the one from d[0]
      .style('stroke', d => colors(d[0].name))
      .style('stroke-width', 2)
      .style('fill', 'transparent')
  
  
  // This places the labels to the right of each line
  d3.select(svg)
    .selectAll('text.label')
    .data( data )
    .join('text')
      .attr('class', 'label')
      // place the ticks to the right of the chart
      .attr('x', width - margin.right + 5)
      // Place the ticks at the same y position as
      // the last y value of the line (remember, d is our array of points)
      .attr('y', d => yScale( d[d.length - 1].price ) + (d[0].name === 'Sweden' ? -10 : 0))
      .attr('dy', '0.35em')
      .style('fill', d => colors(d[0].name))
      .style('font-family', 'sans-serif')
      .style('font-size', 12)
    .text(d => d[0].name)
  
  d3.select(svg)
    .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${ height - margin.bottom })`)
    .call(xAxis)
  
  d3.select(svg)
    .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${ margin.left },0)`)
    .call(yAxis)
    // This removes the vertical line on the axis between the ticks and the rest of the chart.
    // Purely an aesthetic choice
    .selectAll('.domain').remove()
  
  return svg
  
}


function _20(md){return(
md`
# Conclusion

That's it for line charts. Not much more to say about that one. [Tomorrow](https://observablehq.com/@thetylerwolf/day-8-scatter-plot?collection=@thetylerwolf/25-days-of-d3), we continue with another of the basic charts.

-Tyler
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
    ["big-mac-raw-index@1.csv", {url: new URL("./files/67054dc126249254af882e8d63900f9e8989e6817e8665c45c9aced2cdee6b7f031c75a94d3632cd73b764aa323b6ee2b40bc859978c6d7a8bcff02d44433bc4.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("colors")).define("colors", ["data","d3"], _colors);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("xScale")).define("xScale", ["data","d3","margin","width"], _xScale);
  main.variable(observer("yScale")).define("yScale", ["data","d3","height","margin"], _yScale);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("yAxis")).define("yAxis", ["d3","yScale"], _yAxis);
  main.variable(observer("xAxis")).define("xAxis", ["d3","xScale"], _xAxis);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("line")).define("line", ["d3","xScale","yScale"], _line);
  main.variable(observer("container")).define("container", ["html","d3","data","line","colors","width","margin","yScale","height","xAxis","yAxis"], _container);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
