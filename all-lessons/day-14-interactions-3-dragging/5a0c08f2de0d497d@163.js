// https://observablehq.com/@thetylerwolf/day-14-interactions-3-dragging@163
function _1(md){return(
md`
# Day 14 - Interactions 3 - Dragging

Next up in our list of interactions, dragging!
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

The ability to drag and drop elements can be useful with certain types of exploratory tools. I've probably only used this functionality once in a professional context - there's usually a better way to handle interactions in a visualization. However, if you're building an analytical tool or an educational tool, for example, drag-and-drop can be a big part of the experience. \`\`d3.brush()\`\` has a wider application and we'll learn about that tomorrow.

As with other behaviors in D3, setting up the drag behavior is pretty straightforward, though it does require a little understanding to do it right.

For this example, I've placed a matrix of rects colored in a spectral gradient. There's one rect out of place. You can use your mouse to drag the rect (or any other rect) into the right position. I'll explain how I used \`\`d3.drag()\`\` to set this up below.

Note that understanding the code for placing and coloring the elements is not necessary for this lesson - there's nothing new other than the algorithm I used for coloring the rects smoothly. Otherwise, it's just a bunch of \`\`rect\`\`s!
`
)}

function _chart(d3,width,height,rectWidth)
{
  
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
  
  const rects = d3.range( Math.ceil(height/rectWidth) * Math.ceil(width/rectWidth)  )
  
  svg.selectAll('rect')
    .data( rects )
    .join('rect')
      .attr('class', d => 'rect-' + d)
      .attr('width', rectWidth)
      .attr('height', rectWidth)
      .attr('x', (d,i) => rectWidth * (i % (width/rectWidth)))
      .attr('y', (d,i) => Math.floor( i/(width/rectWidth) ) * rectWidth)
      .style('stroke', 'white')
      .style('cursor', 'pointer')
      .style('fill', (d,i) => {
        const x = rectWidth * (i % (width/rectWidth)),
              y = Math.floor( i/(width/rectWidth) ) * rectWidth,
              dist = Math.hypot( x, y )
        
        return d3.interpolateSpectral( dist / Math.hypot( width, height ) )
      })
  
  // The code for moving a single rect out of place is at the bottom of the lesson
  
  return svg.node()

}


function _5(md){return(
md `
# d3.drag()

Above, we placed all of our rects, but now we set up the drag behavior.

\`\`d3.drag()\`\` instantiates a new drag behavior. In order for the drag behavior to work the way it does above, we have to tell it three things:

-What to do when the user starts dragging
-What to do while the user is dragging
-What to do when the user finishes dragging

As you can imagine, during each of these events, we can use the position of the dragged element and the other elements in our chart to decide what to do with it. Maybe we'd like to highlight a dropzone when the element is dragged over it or something similar.

In the code below, we start by defining the functions that tell it those things. You'll notice that each function is defined the old-fashioned (ES5) way by actually writing \`\`function\`\` rather than with arrow functions like we've used thus far. This is because arrow functions bind the \`\`this\`\` context to the context in which the function was called. If you're not sure what that means, that's ok ([you can learn about it here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)). The important takeaway here is one thing: When we define our functions like below, the \`\`this\`\` keyword references the element that the event is being called on. To put it another way, when we are dragging a rectangle, in our function, \`\`this\`\` is the rectangle's element; using an arrow function (\`\`() => {}\`\`) does not work that way.

This is what is going on with each function:
\`\`dragStart()\`\` - What to do when the user first starts dragging. We select the rect being dragged then call \`\`.raise\`\` - this moves the rect in front of all other elements (try removing \`\`.raise()\`\` and see what happens.) We then set the stroke of the rect to black.

\`\`dragging()\`\` - What we do while the user is dragging the element. We set the \`\`x\`\` and \`\`y\`\` positions of the rect so that it is centered on the position of the drag event (note that every time the mouse moves during the drag, a drag event fires.) I'm subtracting \`\`rectWidth/2\`\` from both positions because, remember, x and y positions reference the top-left corner of the rect.

\`\`dragEnd()\`\` - What we do when the user drops the rect. We set the stroke back to white and that's it.

Finally, we instantiate the drag behavior and set our callback functions for the appropriate drag events.

\`\`d3.drag()\`\` has a few extra customizable settings that give finer control over drag and drop behavior. [You can learn more about drag behavior here](https://github.com/d3/d3-drag/blob/v1.2.5/README.md#drag)

`
)}

function _drag(d3,rectWidth)
{

  function dragStart(d) {
    d3.select( this )
        .raise()
        .style('stroke', 'black')
  }
  
  function dragging(d) {
    d3.select( this )
        .attr('x', d3.event.x - rectWidth/2)
        .attr('y', d3.event.y - rectWidth/2)
        // If you uncomment below, the color of the rect will change as you drag :D
        // .style('fill', () => {
        //   return d3.interpolateSpectral( Math.hypot(d3.event.x, d3.event.y) / Math.hypot( width, height ) )
        // })
  }
  
  function dragEnd(d) {
    d3.select( this ).style('stroke', 'white')
  }

  return d3.drag()
      .on('start', dragStart)
      .on('drag', dragging)
      .on('end', dragEnd)
  
}


function _7(md){return(
md `
# Add drag behavior to the chart

Finally, we have to tell our rects to respond to the drag behavior. We do this the same way we set up zoom behavior yesterday. Just select the elements we'd like to be draggable, in our case all \`\`rect\`\` elements, and call \`\`.call(drag)\`\` and it works! Easy, right?
`
)}

function _8(d3,chart,drag){return(
d3.select( chart )
    .selectAll('rect')
    .call( drag )
)}

function _9(md){return(
md `
Below is the cude I used to randomly pick a rect and move it out of place so that you could drag it home in the example. If you want to try modifying the code and that single rect bugs you, just remove the block below.
`
)}

function _10(height,rectWidth,width,d3,chart)
{
 
  const randomRectNumber = Math.floor(Math.random() * Math.ceil(height/rectWidth) * Math.ceil(width/rectWidth))
  
  d3.select(chart)
    .select('.rect-' + randomRectNumber)
      .raise()
      .attr('x', Math.random() * (width - 30))
      .attr('y', Math.random() * (height - 30))
      .style('stroke', 'black')

}


function _11(md){return(
md `
# Conclusion

That's it for drag behaviors. We'll finish our exploration of interactions tomorrow with brush behavior. This is a big one so make sure you're ready!

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-15-interactions-4-brushing).

-Tyler
`
)}

function _12(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
)}

function _rectWidth(){return(
30
)}

function _height(){return(
480
)}

function _width(){return(
900
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
  main.variable(observer("chart")).define("chart", ["d3","width","height","rectWidth"], _chart);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("drag")).define("drag", ["d3","rectWidth"], _drag);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["d3","chart","drag"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["height","rectWidth","width","d3","chart"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("rectWidth")).define("rectWidth", _rectWidth);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
