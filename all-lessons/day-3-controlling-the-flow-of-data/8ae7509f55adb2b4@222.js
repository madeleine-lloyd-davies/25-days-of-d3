// https://observablehq.com/@thetylerwolf/day-3-controlling-the-flow-of-data@222
function _1(md){return(
md `
# Day 3 - Controlling the Flow of Data

In our previous lessons, we've used a simple array of numbers as a data source to drive our rectangles. This has kept things simple, but it's obscured some of the bigger picture. Today, I'll explain how we can use more complex data structures to drive our graphics.
`
)}

function _2(md){return(
md `### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js brought to you by [Tyler Wolf](https://tylernwolf.com).*`
)}

function _container(html,d3)
{
  const svg = html `<svg width="500" height="30"/>`
    
  const colors = d3.interpolateTurbo
  
  const blocks = d3.range(0, 30)
  
  d3.select(svg).selectAll('rect')
    .data(blocks).enter()
    .append('rect')
      .attr('x', (d,i) => i * 500 / blocks.length)
      .attr('y', 0)
      .attr('height', 30)
      .attr('width', 500 / blocks.length)
      .style('fill', (d,i) => colors( i / blocks.length ))
  
  return svg
}


function _4(md){return(
md `
# Accessor functions

It's time. I've been glossing over accessor functions in our example code so far in order to stay focused on the fundamentals. But now we're ready to dig into how these functions actually work in practice.

Accessor functions are just that: functions that are used to access some piece of data. D3 relies on them heavily in much of its API. In practice, they look like this:
`
)}

function _5(d3){return(
d3.selectAll('whatever')
    .attr('width', (d) => d.value)
)}

function _6(md){return(
md `
The second argument to .attr is our accessor function. It takes a piece of data (d) and returns d.value. d.value is then used by D3 to set the 'width' attribute. The value of d, itself, is defined by the data that is bound to the element we're setting.

**note:** When you return a value from an accessor, it can be a value derived from the original. This will not modify the original value unless you do it explicitly (ex. d.value = 10)

This may seem complicated, perhaps unnecessarilly so. Why doesn't D3 just require an array of numbers or something? Well, it's for good reason. D3 is designed to be as flexible as possible, meaning it doesn't require you to provide data in a certain format in order for the library to work. Instead, **you tell D3 how to work with your data** using accessor functions.

This concept is central to D3's versatility as a library and worth appreciating. It's also convenient for us because data comes in all shapes and sizes and we can define ours to match our own conception of its structure. 

This may still seem complicated, but in the next 22 days, you'll appreciate its utility. There's a reason this entire lesson is devoted to the concept!
`
)}

function _7(md){return(
md `
# Accessors in Action

As I mentioned, accessors are used throughout D3. Here are a few examples of simple D3 utlities that use them.

Each example will use the data structure defined below:
`
)}

function _data(){return(
[
    { name: 'a', value: 1 }, 
    { name: 'b', value: 2 }, 
    { name: 'c', value: 3 },
    { name: 'd', value: 5 },
    { name: 'e', value: 8 }
  ]
)}

function _9(d3,data){return(
d3.max(data, (d) => d.value)
)}

function _10(d3,data){return(
d3.mean(data, (d) => d.value)
)}

function _11(d3,data){return(
d3.max(data, (d) => Math.random() * d.value )
)}

function _12(md){return(
md `
What happens when you remove the second argument from the above examples entirely?

## Accessor Arguments

One last detail about accessors - when it comes to D3 selections, the accessor actually receives three arguments. The first is the data bound to the current element, the second is the (zero-based) index of the current element and the third is an array of all of the elements in this selection:
`
)}

function _13(d3,container)
{
  const data = [ 3, 2, 1 ]
  
  d3.select(container)
    .selectAll('rect').data( data )
    .attr('foo', (d, i, arr) => {
      console.log( 'd',  d ) // 3, then 2, then 1
      console.log( 'i', i ) // 0, then 1, then 2
      console.log( 'arr', arr ) // [ rect, rect, rect ]
    
      return i * 10
    })
  
  // run this block and look at your browser console to see the values logged
  // Try changing the data array and see what happens
}


function _14(md){return(
md `
In practice, d and i are used quite often and arr is usually only used in special cases. As you can see in the examples, there is no need to specify all of the accessor arguments if you're not using them.

This next example shows how we can set different values on elements using the same data source, but choosing different values with our accessors. In this case, we'll use the object's value to set the radius of a circle, but the object's name to set the label.
`
)}

function _15(html,d3,data)
{
  const svgHTML = html `<svg width="160" height="160" style="border: 1px solid #ccc" />` 
  
  const svg = d3.select( svgHTML )
  
  const circles = svg.selectAll('circle').data( data )

  circles.enter().append('circle')
    // set the circles' radius
    .attr('r', (d) => d.value * 10)
    // set the circles' x position
    .attr('cx', (d) => d.value * 10)
    // set the circles' y position
    .attr('cy', 80)
    .attr('fill', 'transparent')
    .attr('stroke', 'steelblue')
  
  const text = svg.selectAll('text').data( data )
  
  text.enter().append('text')
    .attr('x', (d) => d.value * 10 * 2)
    .attr('y', 80)
    // This is a "magic number" in svg. It makes sure the text is vertically centered
    .attr('dy', '0.35em')
    // set from which direction the text expands
    .attr('text-anchor', 'end')
    // set the actual text
    .text(d => d.name)

  return svgHTML
  
}


function _16(md){return(
md `
As you can see, accessors are very helpful for dynamically setting attributes on our SVG elements. As we explore more D3 functionality in future lessons, they'll come up again and again.

In the above example, I introduced both the circle and the text SVG elements. You should be able to intuit what the code does. I'll be revisiting text elements in [day 4](https://observablehq.com/@thetylerwolf/day-4-groups-attributes-and-styles?collection=@thetylerwolf/25-days-of-d3), as well as group (g) elements. This is all in preparation for day 5 when we'll build our first real chart!

Follow me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - to stay updated when new lessons are released. Also, don't hesitate to tweet at me if you have any questions, comments or ideas!

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
  main.variable(observer("container")).define("container", ["html","d3"], _container);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["d3"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("data")).define("data", _data);
  main.variable(observer()).define(["d3","data"], _9);
  main.variable(observer()).define(["d3","data"], _10);
  main.variable(observer()).define(["d3","data"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["d3","container"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["html","d3","data"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
