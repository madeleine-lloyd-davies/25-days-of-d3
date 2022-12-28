// https://observablehq.com/@thetylerwolf/day-13-interactions-2-zooming@143
import define1 from "./3e6b7fdcd9434fd9@413.js";

function _1(md){return(
md`
# Day 13 - Interactions 2 - Zooming

Today we move on to another D3 utility for building interactions: Zooming
`
)}

function _2(md){return(
md `### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js is from [Tyler Wolf](https://tylernwolf.com).*`
)}

function _3(md){return(
md `
# Introduction

For the uninitiated, zooming is when we expand the content of our screen to get a closer look (zooming in) or shrink it (zooming out). Programming zooming behavior from scratch would be a lot of work. Fortunately, D3 implements zooming for us and, as we'll see, makes it very easy to implement in our charts.

For this lesson, we'll be re-using the [treemap from Day 6](https://observablehq.com/@thetylerwolf/day-10-treemap?collection=@thetylerwolf/25-days-of-d3). You may want to revisit that chart for a refresher on how it was built.

The default zoom behavior in D3 will trigger a zoom in when the mouse wheel scrolls up or the user double-clicks. Conversely, it will trigger a zoom out when the mouse wheel scrolls down. In addition, when the user clicks and drags, it will pan the view with the user's drag. This is a lot of useful functionality for surprisingly little effort.

### Re-using the Treemap

The first block of code below imports the treemap chart and its height and width data. This is an Observable functionality that would work differently in regular Javascript, which means, unfortunately, that you can't reuse charts quite so easily in code.

The important takeaway here is that \`\`treemap\`\` imported here is the chart svg fully built from the Day 6 lesson.
`
)}

function _chart(treemap){return(
treemap
)}

function _6(md){return(
md `
# d3.zoom()

In order to set up zooming and panning on a chart, we need to initialize the zoom behavior and configure a few details to make it work the way we want it to:
`
)}

function _zoom(d3,width,height,chart,revealText){return(
d3.zoom()
  .translateExtent([[ 0, 0 ],[ width, height ]])
  .scaleExtent([ 1, 20 ])
  .on('zoom', (d,i) => {

    d3.select( chart )
      .select('.treemap-container')
      .attr('transform', d3.event.transform)

    revealText()
  
  })
)}

function _8(md){return(
md `
As you can see above, first we call \`\`d3.zoom()\`\` to create a new behavior.

Next, we call \`\`.translateExtent()\`\`. This function sets the extent of how far we can pan (translate) the chart. It's useful to keep it from getting panned out of the viewport, at which point it can't be clicked on and becomes unretrievable to the user. In order to set this up, we pass in an array of two arrays. The first array is the coordinates of the top-left corner of our zoomable element and the second is the coordinates of the bottom-left corner. If this is not set, it is infinity in all directions.

Then we call \`\`.scaleExtent()\`\`. This sets how far we can zoom in and out from our chart through an array of two values: the min zoom and max zoom. \`\`1\`\` is no zoom in or out. Below, we set max zoom to 20, that is at full zoom, things are 20x larger than at no zoom. Zooming in or out beyond the extent will do nothing. By default, scale extent is \`\`[0,Infinity]\`\`.

The last thing we have to do to initialize our zoom behavior is tell it what to actually do when the user zooms. In our case, we're not doing anything too complicated - we just want it to zoom in to our chart. In order to activate this, we set the \`\`transform\`\` of our zoomable element to that specified by \`\`d3.event.transform\`\`. This will automatically set the zoom (\`\`scale(z)\`\`) and pan (\`\`translate(x,y)\`\`) of the element to create the zoom effect.

**d3.event**

\`\`d3.event\`\` is a wrapper for the html event that corresponds to the mouse wheel scroll or drag by the user. It contains data in a format that works smoothly with other d3 utilities. It's present on any event that's called (including \`\`click\`\`, \`\`mouseover\`\`, etc.)

In this case, \`\`d3.event.transform\`\` contains exactly the data we need to set the transform of our zoomed element. Nothing else required!

**revealText()**

Below the transform setting, I call the \`\`revealText()\`\` function. You can find the definition for this function below. What does it do? It checks the size of every rect in the chart. If the rect is now large enough to contain text, it will reveal the text for that rectangle's data. If not, it will hide the text.

The function is mostly the same code used in the treemap code for initializing these values. The results are not perfect - the text still overlaps - but it's readable when you're zoomed in enough and eliminates clutter when you zoom out. It's a springboard for you to think about how this type of functionality can be applied in your own work.


# Applying the zoom behavior to the chart itself

This last part is easy. We select the element we'll let the user zoom into, then just \`\`.call( zoom )\`\`. Our entire chart is wrapped in a \`\`g\`\` with the class \`\`treemap-container\`\`, so we apply the zoom behavior to that (it can't be applied to the \`\`svg\`\` element) and we're done!
`
)}

function _9(d3,chart,zoom){return(
d3.select( chart )
    .select('g.treemap-container')
    .call( zoom )
)}

function _revealText(d3,treemap){return(
() => {
  
  const leaf = d3.select(treemap).selectAll('g.leaf')

  leaf.each((d, i, arr) => {

    // The current leaf element
    const current = arr[i]

    const left = d.x0,
          right = d.x1,
          // calculate its width from the data
          width = (right - left) * d3.event.transform.k,
          top = d.y0,
          bottom = d.y1,
          // calculate its height from the data
          height = (d.y1 - d.y0) * d3.event.transform.k

    // Check if it's too small for text
    const tooSmall = width < 34 || height < 25

    d3.select( current ).select('text')
      .attr('opacity', tooSmall ? 0 : 0.9)

  })

}
)}

function _11(md){return(
md `
# Conclusion

Can you believe it? We're halfway through! We're steadily building our repertoire of tools for working with charts in d3. With everything you've learned thus far, you can probably do some pretty incredible stuff. I recommend reflecting on all of the things you've learned so far and start thinking of ways you can combine them for other types of visualization.

We'll be continuing with interactions a bit more before moving on to some intermediate D3 techniques.

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-14-interactions-3-dragging)!

-Tyler
`
)}

function _12(md){return(
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
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  const child1 = runtime.module(define1);
  main.import("chart", "treemap", child1);
  main.import("width", child1);
  main.import("height", child1);
  main.variable(observer("chart")).define("chart", ["treemap"], _chart);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("zoom")).define("zoom", ["d3","width","height","chart","revealText"], _zoom);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["d3","chart","zoom"], _9);
  main.variable(observer("revealText")).define("revealText", ["d3","treemap"], _revealText);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
