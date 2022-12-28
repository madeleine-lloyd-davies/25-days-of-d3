// https://observablehq.com/@thetylerwolf/day-6-donut-chart@295
function _1(md){return(
md`
# Day 6 - Donut Chart

On [Day 5](https://observablehq.com/@thetylerwolf/day-5-our-first-bar-chart), we made our first chart. Today we continue with the basic charts by making a donut chart, a variant of a pie chart.
`
)}

function _2(md){return(
md `### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js is from [Tyler Wolf](https://tylernwolf.com).*`
)}

function _3(md){return(
md `
# Introduction to \`\`path\`\`

Everything we've built thus far has been composed of discrete shapes. This has kept things simple. With the donut chart, things will be a little different because donut and pie charts are composed of \`\`path\`\`s. \`\`path\`\`s can be thought of as lines that are not straight. They have several points along them that define their shape. We have a lot of options for how to configure them and D3 helps us with many of them.

Unlike the elements we've previously worked with, \`\`path\`\`s don't have a shape by default. Instead, we have to define the shape of the path ourselves. This is done using the \`\`d\`\` attribute.

In order to define the shape of the path, we need to build a string of commands. This can get quite complex, so I'll leave it to you to [learn more here](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths) if you're so inclined.

However, for the purposes of today's lesson, what I've explained thus far is pretty much all we need to get things working. The reason for this is that D3 handles path generation for us in a way that's sufficient for the majority of use cases.
`
)}

function _4(md){return(
md `
## A pie is composed of arcs

Arcs are subsets of the circumference of a circle, so we can think of a pie as a bunch of arcs placed together to form a circle. Using some D3 utilities, the size of each arc is defined by the values of our data. This terminology is important to remember as we go through the code below.
`
)}

function _5(md){return(
md `
## The code

We start by defining our data. I used a dataset describing the number of kilograms of each type of meat purchased in the United States in 2017 per capita. We'll use this data to build our donut chart.

*I will skip over code that we have seen in previous days*
`
)}

function _USData(){return(
[
  { type: 'Poultry', value: 48.9954 },
  { type: 'Beef', value: 25.9887 },
  { type: 'Pig', value: 22.9373 },
  { type: 'Sheep', value: 0.4869 }
]
)}

function _height(){return(
500
)}

function _width(){return(
900
)}

function _9(md){return(
md `
Here, we set up our color scale using a custom color palette. Otherwise, nothing unusual here. We won't need any other scales for this chart.
`
)}

function _colorScale(d3,USData)
{
  
  const colors = [ '#976393', '#685489', '#43457f', '#ff9b83' ]
  
  return d3.scaleOrdinal( USData.map(d => d.type), colors )
  
}


function _11(md){return(
md `
Here we define an arc shape generator. This returns a function. When the returned function is passed an object that describes an arc, it returns the path string we can use to render it.

With \`\`.innerRadius()\`\` and \`\`.outterRadius()\`\`, we're setting those parameters of the arc. I'm using \`\`height/2\`\` because the height of our SVG is the smaller dimension and we want to make sure the chart fits in the rendering area.

You can [learn more about d3 arcs here](https://github.com/d3/d3-shape/tree/v1.3.7#arc).
`
)}

function _arc(d3,height){return(
d3.arc()
    // After some trial-and-error, half (0.5) of the full radius gives a nice appearance
    // To see a pie chart, just change this to zero
    .innerRadius( 0.5 * height / 2 )
    // Outer radius is less than the full radius because our labels will sit outside of the donut
    .outerRadius( 0.85 * height / 2 )
)}

function _13(md){return(
md `
Here we define a pie shape generator. This returns a function that, when passed an array of data, returns an array of arc descriptor objects. We then pass these objects to our arc generator and BAM! Donut (or pie) slices.
`
)}

function _pie(d3){return(
d3.pie()
  // An accessor to tell the pie where to find the data values
  .value(d => d.value)
)}

function _15(md){return(
md `
Now we make one more arc generator. This one is for our labels. We want the labels to sit just outside of the donut, so we make the radius a little larger. It's important to set both inner and outer radii to the same value here (I'll explain later.)
`
)}

function _labelArcs(d3,height){return(
d3.arc()
    .innerRadius( 0.95 * height / 2 )
    .outerRadius( 0.95 * height / 2 )
)}

function _17(md){return(
md `
Here we finally generate our arcs from the data. If you look at the objects in the array, you'll notice that our original data object is in the object in addition to the arc data.
`
)}

function _pieArcs(pie,USData){return(
pie( USData )
)}

function _chart(html,d3,width,height,pieArcs,colorScale,arc,labelArcs)
{
  
  const svgHTML = html `<svg width="900" height="500" />`
  
  const svg = d3.select(svgHTML)
  
  // Append our donut container group
  svg.append('g')
      .attr('class', 'donut-container')
      // The donut arcs will be centered around this point
      .attr('transform', `translate(${ width / 2 },${ height / 2 })`)
    .selectAll('path')
    // Our data is the arcs, rather than the data object 
    // so that we have access to the arc data for rendering the paths
    .data( pieArcs )
    .join('path')
      .style('stroke', 'white')
      .style('stroke-width', 2)
      .style('fill', d => colorScale( d.data.type ))
      // here we pass the arc generator. Remember, an accessor function
      // receives the data (d) as the first argument, so rather than doing (d) => arc(d)
      // we can just pass it like below. In this case, our data is the arc descriptor object
      // so the d attribute will be set to the arc's path string. Take a minute to let that sink in
      .attr('d', arc)
  
  // The labels container will need the same setup because it uses an arc, as well
  const text = svg.append('g')
      .attr('class', 'labels-container')
      .attr('transform', `translate(${ width / 2 },${ height / 2 })`)
    .selectAll('text')
    // We use the data arcs so we have access to the label data
    .data( pieArcs )
    .join('text')
      // We use the label arcs here to get their centroid
      // a centroid is the center point of a shape (in this case the arc)
      // remember that our label arc has the same inner and outer radius
      // so the arc is centered just outside the radius of our donut.
      // Refer back to the labelArcs setup and think about that for a minute!
      .attr('transform', d => `translate(${ labelArcs.centroid(d) })`)
      .attr('text-anchor', 'middle')
  
  // This section explained below
  text.selectAll('tspan')
    // 1
    .data( d => [ 
      d.data.type, 
      d.data.value.toFixed(1) + ' kg' 
    ])
    // 2
    .join('tspan')
      .attr('x', 0)
      .style('font-family', 'sans-serif')
      .style('font-size', 12)
      .style('font-weight', (d,i) => i ? undefined : 'bold')
      .style('fill', '#222') 
    //3
      .attr('dy', (d,i) => i ? '1.2em' : 0 )
      .text(d => d)
  
  return svgHTML
}


function _20(md){return(
md `
## tspan explanation

Another SVG element?! Now is as good a time as any to introduce the \`\`tspan\`\`. What is it? It's an element used as a child of a \`\`text\`\` element. It is useful when you want to put text on separate lines or format a specific few letters or words differently.

There's a lot we haven't seen going on in the code above, so I'll explain it step-by-step:

1. First, I bound the \`\`data.type\`\` string and the \`\`data.value\`\` string (with some formatting) in an array. That's a 2-element array, so there will be two \`\`tspans\`\` as a result. How did I get access to the data object there? Well, when you call \`\`.data()\`\` on the child of an element that already has data bound, rather than passing new data in, you can pass an accessor function. The accessor's return value will be set as the bound data.

2. Next, I placed the \`\`tspan\`\` elements. and styled them to look nice.

3. Finally, I checked if this is the first (i == 0) or the second (i > 0) tspan. If it's second, push it down \`\`1.2em\`\` (that's the \`\`font-size\`\` * 1.2)

And that's it! This may be a lot to be introduced to all at once, so definitely take the time to understand what's going on in this lesson. Learning how to copy code can only get you so far, but the more comfortable with these concepts you become, the more easily you can make your own custom graphics.

I encourage you, as always, to try changing around a few values and seeing what happens as a result!

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-7-a-line-chart?collection=@thetylerwolf/25-days-of-d3)!

-Tyler
`
)}

function _21(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
)}

function _22(md){return(
md`
**Portions of this example are derived from [Mike Bostock's donut chart example](https://observablehq.com/@d3/donut-chart)*
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
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("USData")).define("USData", _USData);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("colorScale")).define("colorScale", ["d3","USData"], _colorScale);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("arc")).define("arc", ["d3","height"], _arc);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("pie")).define("pie", ["d3"], _pie);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("labelArcs")).define("labelArcs", ["d3","height"], _labelArcs);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("pieArcs")).define("pieArcs", ["pie","USData"], _pieArcs);
  main.variable(observer("chart")).define("chart", ["html","d3","width","height","pieArcs","colorScale","arc","labelArcs"], _chart);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
