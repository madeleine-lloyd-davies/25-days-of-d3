// https://observablehq.com/@thetylerwolf/day-1-one-shape-many-shapes@334
function _1(md){return(
md `
# Day 1 - One Shape, Many Shapes`
)}

function _2(md){return(
md `Welcome To day 1 of 25 Days of D3! All lessons will be formatted similar to this one; intermittent code samples accompanied by explanations of concepts. The lessons presume a basic knowlege of Javascript and HTML. I encourage you to read through each lesson and understand the code snippets that are shown. When you have a sense for how the code examples work, try changing them. Better yet, try breaking them! It's the best way to learn and have fun.`
)}

function _3(md){return(
md `### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js brought to you by [Tyler Wolf](https://tylernwolf.com).*`
)}

function _4(md){return(
md `# Introduction
D3 is an extremely versatile library. It has modules for basic statistics, complex physics simulations, color manipulation, and the list goes on. But at its core, D3 provides utilities for creating and manipulating Data-Driven Documents (that's what D3 means!)

So then, how do we create data-driven documents? Today we'll start with the two basic abilities we need: **DOM manipulation** (creating and modifying HTML elements) and **data binding** (connecting those HTML elements to, and modifying them based on, the data).
`
)}

function _5(md){return(
md `# Our first shape
It's a fact, D3 is a DOM manipulation library. It lets us select HTML elements in the DOM, create new ones, modify existing ones and remove old ones. Working with D3 goes the most smoothly when we work with SVG elements, so for these lessons, we'll work exclusively with SVG. (If you'd like to learn about working with canvas in 2D or 3D, get at me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and let me know!)

For the purposes of these lessons, you can think of SVG as any other HTML element like a div or a span. The key difference is that it can contain different types of graphical elements like rectangles, and circles.

Aside from the above, there's one more thing worth noting about SVG. We'll be placing pixels at x and y positions. x and y will be measured in pixels. **x goes from left to right** and **y goes from top to bottom*, so the position (0,0) is the top left corner and (0, 10) is on the left edge, 10 pixels from the top. This will come up as a consideration later on.

If you'd like to learn more about SVG, you can learn about it [here](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics).
`
)}

function _6(md){return(
md `
### How to use selectors

**d3.select** selects a DOM element. This works similarly to other DOM manipulation libraries. That means elements can be selected by passing their selector as a string or by passing in the element itself. For these lessons, I'll be creating the element, then passing it directly to d3.select, but the following are all valid:
`
)}

function _7(d3)
{
  d3.select('#myId') // select by id
  
  d3.select('.my-id')  // select by class
  
  d3.select('#containerId rect.my-rectangle')  // select children elements that match a class, etc.
  
  return 'These selectors all work'
}


function _8(md){return(
md `
Now that we've gotten that out of the way, we're going to use D3 to select an svg element, place a rectangle, then set the rectangle's appearance.

We'll work with an SVG Element like this one:
`
)}

function _9(html){return(
html `<svg height="40" width="40" style="border:1px solid #ccc"/>`
)}

function _10(md){return(
md `Simple, right? It's just an svg tag with a few attributes defining its height and width. I added the border to make it easier to see.

Now let's place a shape using d3:`
)}

function _oneShape(html,d3)
{
  
  const svgHTML = html `<svg height="40" width="40" style="border:1px solid #ccc"/>`
  
  // first, we select our svg object
  const svg = d3.select(svgHTML)
  
  // now, we append a rect (rectangle) element to the SVG
  const rect = svg.append('rect')
  
  // finally, we style and position the rect
  rect
    .style('fill', 'black') // rect's fill color
    .attr('height', 20) // rect's height (in pixels)
    .attr('width', 20) // rect's width (in pixels)
    .attr('x', 10) // x position of the top-left corner
    .attr('y', 10) // y position of the top-left corner
  
  return svgHTML
}


function _12(md){return(
md `As you can see, this worked pretty much exactly as you'd expect. Perhaps the only unexpected thing is the chaining of the style and attribute settings for the rectangle. This is a convenience of the D3 library; when an attribute or style is set on a DOM element, the function returns the element. As we'll see below, you can also chain selections. You'll see this pattern appear almost everywhere with D3, so get used to it!`
)}

function _13(md){return(
md `# Our 2nd thru 6th shapes
DOM manipulation, at its most basic, is very easy with D3. It does get more complicated, especially with the _enter, update, exit_ pattern, but that's something we'll discuss much later. For now the next most logical thing to learn is **selectAll**.

**selectAll** is like **select** in that you use it to select DOM elements. The difference is that **select** selects the first DOM element matching your selector (or in our case, just the element we pass to it) and that's the end of the story. Meanwhile, **selectAll** selects all DOM elements matching your selector across the entire DOM. But it doesn't stop there.

After selecting all matching elements with **selectAll**, you can add new elements to your selection by binding data to the selection. The bound data now represents the additional elements. This is a bit tricky to understand, so let's go for another code example:
`
)}

function _14(md){return(
md `Again, we start with a basic SVG element, this time a little wider than the last.`
)}

function _15(html){return(
html `<svg height="40" width="160" style="border: 1px solid #ccc" />`
)}

function _16(md){return(
md `Now, we select all of our rects, do the data bind and place and style the rects:`
)}

function _17(html,d3)
{
  const svgHTML = html `<svg height="40" width="160" style="border: 1px solid #ccc" />`
  
  // Select our svg element just like before
  const svg = d3.select(svgHTML)

  // Now, select all rects that are contained by the svg
  const rects = svg.selectAll('rect')

  // Define the data that we will bind to our rectangles
  // each element in the array will become a new rect
  const data = [ 0, 1, 2, 3, 4 ]
  
  rects
    // The data join - the big moment!
    // When we do this, we tell D3 to include
    // 5 additional rects in our selection, one for each element in our data array
    .data( data )
    // Now we append the rects just like before.
    // Unlike before, when we append, we're actually 
    // appending all 5 rects at once
    .join('rect')
      // ...and when we set style and attributes, we're setting them
      // for all 5 rects at once, too
      .style('fill', 'black')
      .attr('height', 20)
      .attr('width', 20)
      .attr('y', 10)
      // This positions each new rect 10 pixels to the right
      // of the last rect. We'll explain what's going on here on day 3
      .attr('x', (d,i) => { return 10 + (i * 30) })
  
  return svgHTML
}


function _18(md){return(
md `
Woo! we did it! It was easy. It may even have felt like magic. You may be confused about how and why it worked. But that's ok! We're on day 1 and D3 is notoriously difficult to learn. We'll be revisiting selections in later lessons and it will all come together within the next 24 days, so just stay with me!
`
)}

function _19(md){return(
md `# End of Day 1
We've made it through day 1, now check out [Day 2](https://observablehq.com/d/c51076498a4808c0?collection=@thetylerwolf/25-days-of-d3) of 25 days of D3. Make sure to share this series if you've found it helpful!

-Tyler
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
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["d3"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["html"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("oneShape")).define("oneShape", ["html","d3"], _oneShape);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["html"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["html","d3"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
