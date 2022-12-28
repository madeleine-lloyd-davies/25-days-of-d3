// https://observablehq.com/@thetylerwolf/day-17-radial-bar-chart@459
function _1(md){return(
md`
# Day 17 - Radial Bar Chart

Like the zoomable area chart, the radial bar chart combines several skills we've learned throughout this series to create a specialized type of chart.
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

Radial bar charts are best used for displaying cyclical patterns. In today's lesson, we'll build a radial bar chart showing the temperature range for each day of 2018 in Stockholm, Sweden.

Before we begin, scroll down to see today's chart so you have a feel for what we're building.
`
)}

function _4(md){return(
md `
# The Data

Today's data is a simple series containing the date, min and max temperatures for each day of the year in Stockholm.

Data Source: [Natial Centers for Environmental Information](https://www.ncdc.noaa.gov/cdo-web/datatools/findstation)
`
)}

async function _data(d3,FileAttachment){return(
d3.csvParse( await FileAttachment("sweden_temp.csv").text(), d3.autoType )
    .map(d => {
      const maxC = (d.TMAX - 32) * 5/9,
            minC = (d.TMIN - 32) * 5/9
      
      return {
        date: d.DATE.toLocaleString(),
        max: maxC,
        min: minC,
        avg: d3.mean([ maxC, minC ])
      }
    })
)}

function _6(md){return(
md `
# The Code

Building radial bar chart is similar to a regular bar chart in many ways. However, because we're placing our bars around a circle rather than a straight line, we have to make accomodations so the bars are drawn correctly. A bar along a straight line is a regular rectangle, while a bar along a circle will have a thinner bottom edge and a thicker top edge.

Fortunately, a geometry that matches the description of our radial bar is in fact...an arc! If you've been following along, we used arcs to draw our donut chart all the way back on [day 6](https://observablehq.com/@thetylerwolf/day-6-donut-chart?collection=@thetylerwolf/25-days-of-d3).

Our only other major consideration is the axes of our chart. We'll want something drawn in a circle rather than linearly. Unfortunately, D3 doesn't provide a scale that will generate a radial axis, so we'll have to do it ourselves. I did this in the code below, but I won't take the time to explain it because it's outside of the scope of this lesson and you can figure it out if you follow the code closely.

Also note, A radial chart means our chart goes around a circle and circles mean we're going to be dealing with trigonometry! If you're not comfortable with trigonometric math, you may want to brush up on how it all works as you follow along with this lesson.

One last thing. Like yesterday, we probably won't be revisiting any of the techniques used for generating this chart, so if you're having trouble following, don't fret! You can come back later when you're feeling better about your D3 skills.
`
)}

function _width(){return(
900
)}

function _height(){return(
900
)}

function _9(md){return(
md `
For this chart, we'll need inner and outer radii for the chart. This is kind of like setting the margins on our rectangular charts. The numbers below were picked because they looked the best.
`
)}

function _innerRadius(width){return(
0.35 * width/2
)}

function _outerRadius(width){return(
0.9 * width/2
)}

function _12(md){return(
md `
Here, I create a 7-element domain for the temperatures. There is a specific reason for this. I'm using a color scheme that cycles through more than two colors. This means that we can't just set a two-element domain for our scale and expect them to match the colors from our color scheme because the domain and range arrays must have the same number of elements in order for the scale to work as expected.

So first, I create the \`\`tempDomain\`\` by finding the max and min of the average temperature values (because the average values will be used to color the bars).

Then I create an interpolator from the max and min values. This basically creates a linear scale that takes a value between 0 and 1 as the input and outputs the corresponding value from the extent I created (we'll talk about these in detail in another lesson.)

Finally, I convert the interpolator function into an array of 7 values using \`\`d3.quantize()\`\`. Again, more on this in a later lesson.
`
)}

function _colorDomain(d3,data)
{
  const extent = d3.extent( data, d => d.avg ),
        interpolated = d3.interpolate( ...extent )
  
  return d3.quantize( interpolated, 7 )
}


function _14(md){return(
md `
Now, I pass the \`\`colorDomain\`\` as the domain and the range is our colorScheme (an interpolator) quantized into its own array of 7 colors. Yes, I promise we'll talk about this in detail soon.
`
)}

function _color(d3,colorDomain){return(
d3.scaleLinear(
  colorDomain,
  d3.quantize(d3.interpolateSpectral, 7).reverse()
)
)}

function _16(md){return(
md `
This should look familiar - a band scale. You might remember that from the bar chart. The thing to notice here is that our range is set from 0 to 2 * Pi. That's the number of radians in a circle and will be useful for placing each of our arcs.
`
)}

function _xScale(d3,data){return(
d3.scaleBand(
    data.map(d => d.date),
    [ 0, 2 * Math.PI ]
  )
)}

function _yDomain(d3,data)
{
  const min = d3.min(data, d => d.min),
        max = d3.max(data, d => d.max)
  
  return [ min, max ]
}


function _yScale(d3,yDomain,innerRadius,outerRadius){return(
d3.scaleLinear()
    .domain( yDomain )
    .range([ innerRadius, outerRadius ])
)}

function _20(md){return(
md `
Here we set up an arc. This is just like our pie chart, except here, we're using accessor functions to set many of the options. These accessors will be used for each data element in our data set, so we can leave it to the arc generator place the rect on its own based on the data.
`
)}

function _arc(d3,yScale,xScale,innerRadius){return(
d3.arc()
    .innerRadius(d => yScale(d.min))
    .outerRadius(d => yScale(d.max))
    .startAngle(d => xScale(d.date))
    .endAngle(d => xScale(d.date) + xScale.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius)
)}

function _22(md){return(
md `
Finally, we place our rects. You should have no problem following this part.
`
)}

function _chart(d3,width,height,data,color,arc,xAxis,yAxis)
{
 
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
  
  const container = svg.append('g')
      .attr('class', 'container')
      .attr('transform', `translate(${ width/2 },${ height/2 })`)
      .style('font-size', 10)
      .style('font-family', 'sans-serif')
  
  container
    .selectAll('path')
    .data( data )
    .join('path')
    .style('fill', d => color(d.avg))
    .style('stroke', d => color(d.avg))
    .attr('d', arc)

  container.append('g')
    .call(xAxis)

  container.append('g')
    .call(yAxis)
  
  return svg.node()
  
}


function _24(md){return(
md `
# Conclusion

We did it! Another challenging chart complete. You'll notice that the axis code was not shown above. This is because it will require a lot of explanation, but you can probably figure it out yourself by reading the code. It's definitely worth looking at the code and getting a feel for it. It does happen somewhat frequently that you need to write your own text placement logic.

Tomorrow, we start a new section where we visit some core concepts of using D3 with data that updates in real time. This will be heavy conceptual stuff that gets to the core of D3. With our experience thus far, we can really dig in and appreciate what's going on.

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-18-join-enter-update-exit)!

Tyler
`
)}

function _25(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
)}

function _26(md){return(
md `
**This chart is derived from Mike Bostock's [Radial Stacked Bar Chart](https://observablehq.com/@d3/radial-stacked-bar-chart) example.*
`
)}

function _xAxis(innerRadius,outerRadius){return(
g => g
    .attr('text-anchor', 'middle')
    .call(g => g.selectAll('g')
      .data([ 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March' ])
      .join('g')
        .attr('transform', (d,i,arr) => `
          rotate(${ i * 360/arr.length })
          translate(${innerRadius},0)
        `)
        .call(g => g.append('line')
            .attr('x1', -5)
            .attr('x2', outerRadius - innerRadius + 10)
            .style('stroke', '#aaa'))
        .call(g => g.append('text')
            .attr('transform', (d,i,arr) => ((i * 360/arr.length) % 360 > 180
                ? "rotate(90)translate(0,16)"
                : "rotate(-90)translate(0,-9)"))
            .style('font-family', 'sans-serif')
            .style('font-size', 10)
            .text(d => d)))
)}

function _yAxis(yScale){return(
g => g
    .attr('text-anchor', 'middle')
    .call(g => g.append('text')
        .attr('text-anchor', 'end')
        .attr('x', '-0.5em')
        .attr('y', d => -yScale(yScale.ticks(5).pop()) - 10)
        .attr('dy', '-1em')
        .style('fill', '#1a1a1a')
        .text('Temperature (°C)')
    )
    .call(g => g.selectAll('g')
      .data(yScale.ticks(5))
      .join('g')
        .attr('fill', 'none')
        .call(g => g.append('circle')
            .style('stroke', '#aaa')
            .style('stroke-opacity', 0.5)
            .attr('r', yScale))
        .call(g => g.append('text')
            .attr('y', d => -yScale(d))
            .attr('dy', '0.35em')
            .style('stroke', '#fff')
            .style('stroke-width', 5)
            .style("fill",'#1a1a1a')
            .text(yScale.tickFormat(6, 's'))
         .clone(true)
            .style('stroke', 'none')))
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
    ["sweden_temp.csv", {url: new URL("./files/0b7c1df1bdfe6a61db6dcc6135ad1b25780d321e935db3d14f2a8eaad545015e88fbd3da0150ff82808bbbe61eeef596b126c51e2dd56c04cef216dca35dab7b.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("innerRadius")).define("innerRadius", ["width"], _innerRadius);
  main.variable(observer("outerRadius")).define("outerRadius", ["width"], _outerRadius);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("colorDomain")).define("colorDomain", ["d3","data"], _colorDomain);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("color")).define("color", ["d3","colorDomain"], _color);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("xScale")).define("xScale", ["d3","data"], _xScale);
  main.variable(observer("yDomain")).define("yDomain", ["d3","data"], _yDomain);
  main.variable(observer("yScale")).define("yScale", ["d3","yDomain","innerRadius","outerRadius"], _yScale);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("arc")).define("arc", ["d3","yScale","xScale","innerRadius"], _arc);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("chart")).define("chart", ["d3","width","height","data","color","arc","xAxis","yAxis"], _chart);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("xAxis")).define("xAxis", ["innerRadius","outerRadius"], _xAxis);
  main.variable(observer("yAxis")).define("yAxis", ["yScale"], _yAxis);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
