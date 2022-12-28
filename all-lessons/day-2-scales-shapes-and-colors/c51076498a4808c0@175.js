// https://observablehq.com/@thetylerwolf/day-2-scales-shapes-and-colors@175
function _1(md){return(
md `
# Day 2 - Scales, Shapes and Colors`
)}

function _2(md){return(
md `
Scales are the backbone of any chart. They're an absolute necessity and a tremendous convenience when working with D3. Today, I'll explain how they work and how to use them.
`
)}

function _3(md){return(
md `### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js brought to you by [Tyler Wolf](https://tylernwolf.com).*`
)}

function _4(md){return(
md `# Introduction to Scales

Scales in D3 are a fairly simple concept. They're essentialy a function that receives an input value in a predefined input range (called a domain) and returns an output value in a predefined output range (called a range). You may remember these terms from Algebra class.

To illustrate this concept see below:
`
)}

function _myScale(){return(
(d) => 10 * d
)}

function _6(myScale){return(
myScale(0)
)}

function _7(myScale){return(
myScale(5)
)}

function _8(myScale){return(
myScale(-100)
)}

function _9(md){return(
md `
**myScale** is a function that takes a value and returns the value multiplied by 10. This is an extremely simple version of a D3 scale. In this case, the domain is any number and the range is any number. If we wanted to set limits on the accepted input and output values or make a number correspond to something else, like a color, the code would get very messy very quickly.

Enter the D3 scale. It takes care of that messy work for us, so we can focus on setting what's relevant to what we're doing and let D3 handle the rest.
`
)}

function _10(md){return(
md `
# Creating a Scale in D3

Creating a scale in D3 is really quite easy. it looks like this:
`
)}

function _scale(d3){return(
d3.scaleLinear()
)}

function _12(md){return(
md `
That's it. We're done...kind of. Now we need to set the domain (remember, the allowed input values) and the range (the allowed output values). So let's recreate **myScale** using D3.

To do this, we set the minimum and maximum values of our scale's domain and the minimum and maximum values of our scale's range. When we set them, the minimum of our domain will output the minimum of our range and the maximum of each will correspond as well. This is how we do it:
`
)}

function _13(scale)
{
  const dMin = 0, dMax = 10
  const rMin = 0, rMax = 100
  
  scale
    .domain([ dMin, dMax ])
    .range([ rMin, rMax ])
  
  return scale(5)
}


function _14(md){return(
md `
Now that our scale is set, try passing in different values in the code above to see how it responds. If you try passing in a value outside of the domain, you'll find that the scale automatically extrapolates the range/domain relationship to infinity. Pretty convenient! This behavior can be disabled via the D3 scale API and we'll talk about it much later in this course.
`
)}

function _15(md){return(
md `
# Scales are Very Flexible

Continuous scales can be set to interpolate both numbers and colors.

In addition to continous scales like the linear scale, there are sequential, diverging, quantize, time and ordinal scales. Each one has a time and a place to be used, but for this lesson the only other scale I'll discuss is the ordinal scale.

A continuous scale returns values along a continuous range, while an ordinal scale returns values that are discretely defined. For example, you may have specific colors corresponding to a certain data series, so you can associate names or values with specific colors.

Below, I've set up a few scales and a rect to demonstrate continuous and ordinal scales. Below the rect code are a series of sliders that will change the values passed into the different scales. Those, in turn will change the position or appearance of the rect. Try it out and try changing the domains and ranges or the scale types for each.
`
)}

function _ySliderScale(d3){return(
d3.scaleLinear()
    .domain([ 0, 140 ])
    .range([ 10, 130 ])
)}

function _xSliderScale(d3){return(
d3.scaleOrdinal()
    .domain([ 0, 1, 2, 3, 4 ])
    .range([ 10, 40, 70, 100, 130 ])
)}

function _colorSliderScale(d3){return(
d3.scaleLinear()
    .domain([0,100])
    .range(['#eee', 'steelblue'])
)}

function _19(html,d3,xSliderScale,xSliderValue,ySliderScale,ySliderValue,colorSliderScale,colorSliderValue)
{
  const svg = html `<svg width="160" height="160" style="border: 1px solid #ccc"/>`
  
  d3.select(svg).selectAll('rect').remove()
  
  d3.select(svg)
    .append('rect')
      .attr('width', 20)
      .attr('height', 20)
      // Set the x value based on the slider value (passed into the x scale)
      .attr('x', xSliderScale(xSliderValue))
      // Same for y/y ccale!
      .attr('y', ySliderScale(ySliderValue))
      // Same for color/color scale!
      .style('fill', colorSliderScale(colorSliderValue))
  
  return svg
}


function _20(md){return(
md `Adjust the y value (0-140)`
)}

function _ySliderValue(html){return(
html`<input type=range min=0 max=140>`
)}

function _22(md){return(
md `Adjust the x value (0 - 4)`
)}

function _xSliderValue(html){return(
html`<input type=range min=0 max=4>`
)}

function _24(md){return(
md `Adjust the color`
)}

function _colorSliderValue(html){return(
html`<input type=range min=0 max=100>`
)}

function _26(md){return(
md `# Applying Scales
Now that we have a feel for how scales work, we can try a more practical application. We'll place 5 rects like we did on day 1, but this time, we'll set the position, size and color of the rects based on the data and we'll do it all using scales. Now we're in the big time!
`
)}

function _27(html,d3)
{
  
  const svgHTML = html `<svg height="160" width="160" style="border: 1px solid #ccc" />`
  
  // Define our data
  const data = [ 0, 1, 2, 3, 4 ]
  
  // The max height of the rects for convenience
  const maxHeight = 140
  
  // Set the x positions of our rects (ordinal)
  // The domain is our data because the data values
  // will be passed to the scale when we draw
  const xScale = d3.scaleOrdinal()
      .domain( data )
      .range([ 10, 40, 70, 100, 130 ])
  
  // The domain is the minimum value of our data
  // to the maximum value of our data (continuous)
  const yScale = d3.scaleLinear()
      .domain([ 0, 4 ])
      .range([ 10, maxHeight ])

  // Color will be set based on the value of our data
  // It's convenient to use a linear scale so we don't
  // have to define all of the colors in between by hand
  const colorScale = d3.scaleLinear()
      .domain([ 0, 4 ])
      .range(['#eee', 'steelblue'])
  
  const svg = d3.select(svgHTML)
    
  svg.selectAll('rect')
    // data bind
    .data( data )
    // append all 5 rects
    .join('rect')
      .attr('width', 20)
      .attr('y', 10)
      // pass in the bound data value to the scales
      // with an accessor function
      // so that we can set the value based on the scale
      .attr('x', (d) => xScale(d))
      .attr('height', (d) => yScale(d))
      .style('fill', (d) => colorScale(d))
  
  return svgHTML
}


function _28(md){return(
md `
After reviewing the code, you've probably noticed that this is very similar to the day 1 code. That's because it's almost exactly the same. The only difference is that we've introduced scales to set the x position, height and color of each rect rather than setting them manually (or with our own function). This is the essence of data-driven documents - the element attributes are dictated by the data. This is how we start making sophisticated data visualizations.

With time, these concepts will solidify in your mind. Remember, we're only at day 2, but you're already getting the foundations!

One last note: You may be unsure what's going on when we set the values based on the scale or you may have figured out what's going on, on your own. Whatever the case, on [Day 3](https://observablehq.com/@thetylerwolf/day-3-controlling-the-flow-of-data). I'll explain what exactly an accessor function is and how they're used throughout D3.

Follow me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - to stay updated when new lessons are released. Also, don't hesitate to tweet at me if you have any questions, comments or ideas!

-Tyler
`
)}

function _29(md){return(
md `This notebook is part of [25 Days of D3.js](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79) by [Tyler Wolf](https://tylernwolf.com).`
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
  main.variable(observer("myScale")).define("myScale", _myScale);
  main.variable(observer()).define(["myScale"], _6);
  main.variable(observer()).define(["myScale"], _7);
  main.variable(observer()).define(["myScale"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("scale")).define("scale", ["d3"], _scale);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["scale"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("ySliderScale")).define("ySliderScale", ["d3"], _ySliderScale);
  main.variable(observer("xSliderScale")).define("xSliderScale", ["d3"], _xSliderScale);
  main.variable(observer("colorSliderScale")).define("colorSliderScale", ["d3"], _colorSliderScale);
  main.variable(observer()).define(["html","d3","xSliderScale","xSliderValue","ySliderScale","ySliderValue","colorSliderScale","colorSliderValue"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("viewof ySliderValue")).define("viewof ySliderValue", ["html"], _ySliderValue);
  main.variable(observer("ySliderValue")).define("ySliderValue", ["Generators", "viewof ySliderValue"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("viewof xSliderValue")).define("viewof xSliderValue", ["html"], _xSliderValue);
  main.variable(observer("xSliderValue")).define("xSliderValue", ["Generators", "viewof xSliderValue"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("viewof colorSliderValue")).define("viewof colorSliderValue", ["html"], _colorSliderValue);
  main.variable(observer("colorSliderValue")).define("colorSliderValue", ["Generators", "viewof colorSliderValue"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _26);
  main.variable(observer()).define(["html","d3"], _27);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
