// https://observablehq.com/@thetylerwolf/day-11-introduction-to-animations@254
function _1(md){return(
md`
# Day 11 - Introduction to Animations


`
)}

function _2(md){return(
md `
We've made it through the fundamentals, the basic charts and even an advanced chart. Everything you've learned thus far can be used to produce static charts for the web or print. Now, we're going to take a break from laying down charts and move to a new set of basics: the building blocks of web interactions. Today we're going to learn transitions in d3, which are used to animate graphics.
`
)}

function _3(md){return(
md `
### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js is from [Tyler Wolf](https://tylernwolf.com).*`
)}

function _4(md){return(
md `
# Introduction

Animations are useful for certain types of visualizations, particularly when adding or removing data from the chart. Used skillfully, animations can also contribute to a better user experience. Setting up animations is quite simple in D3, especially if you're familiar with animation in general.

## Setting up the .transition()

When we want to animate an svg element, we first need to set its appearence:
`
)}

function _circle(d3){return(
d3.select('whatever')
  .append('circle')
    .attr('r', 15)
    .attr('cx', 20)
    .attr('cy', 20)
)}

function _6(md){return(
md `
Next, we must decide the next state we want the element to transition to. We'll send our circle to position \`\`(280, 80)\`\`. With this decided, we can set up the transition:
`
)}

function _7(circle){return(
circle
  .transition()
    .attr('cx', 280)
    .attr('cy', 80)
)}

function _8(md){return(
md `
That's it! With that simple code, our circle will instantly move to its new position over the course of 250 milliseconds with cubic-in-out easing. When we call \`\`selection.transition()\`\`, it returns not the selection like setter functions usually do, but the transition, itself.

As shown in the example above, attributes and styles can be set on the transition just like a normal selection - these are the settings the transition will transition to - but there are also additional settings unique to D3 transitions that can customize their behavior.

For example, if we want to customize the delay, duration and easing of our transition, we do it like so:
`
)}

function _9(circle,d3){return(
circle.transition()
  .delay(1200)
  .duration(1200)
  .ease(d3.easeLinear)
    .attr('cx', 280)
    .attr('cy', 80)
)}

function _10(md){return(
md `
In addition, we can chain transitions. When we chain transitions, they trigger in sequence, so the second transition will initiate only after the first one completes.

The code below waits 1.2 seconds (1200 ms), moves the circle over the course of 1.2s, then waits 1.2s before moving the circle back to \`\`(20,20)\`\` over the course of 1.2s.
`
)}

function _11(circle){return(
circle
  .transition()
  .delay(1200)
  .duration(1200)
    .attr('cx', 280)
    .attr('cy', 80)
  .transition()
  .delay(1200)
  .duration(1200)
    .attr('cx', 20)
    .attr('cy', 20)
)}

function _12(md){return(
md `
Below, I've set up transitions to animate the circle as described above.

**note:** Because this is Observable and not regular Javascript, the animation is set to repeat using the \`\`while(true)\`\` loop, which yields the svg element before each cycle of the animation is called. The \`\`transition.end()\`\` function is used for this reason as well, but we'll talk about how this works in a later lesson.
`
)}

async function* _animation1(d3)
{
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 100)
  
  const circle = svg.append('circle')
      .attr('r', 15)
      .attr('cx', 20)
      .attr('cy', 20)
  
  while(true) {
  
    yield svg.node()
    
    await circle
      .transition()
      .delay(1200)
      // try uncommenting the transitions below to see how they effect the animation
      .ease(d3.easeCubicInOut)
      // .ease(d3.easeLinear)
      // .ease(d3.easePoly.exponent(5))
      .duration(1200)
        .attr('cx', 280)
        .attr('cy', 80)
      .transition()
      .delay(1200)
        .attr('cx', 20)
        .attr('cy', 20)
      .end()

  }
  
}


function _14(md){return(
md `
Transitions have several other configurable options, which you can [read about here](https://github.com/d3/d3-transition/blob/v1.3.2/README.md#selecting-elements).

If you're not familiar with easing functions, you can read about [how easing functions work in d3 here](https://github.com/d3/d3-ease#api-reference). To give a very quick summary, easing functions define how the animation proceeds (start slow, gradually ramp up to full speed, then gradually slow to a stop vs. start at full speed, then go from full speed to complete stop). Try uncommenting the different ease settings in the example below to see what this looks like in action.

We'll revisit animations in more detail later, but this covers it for our needs for now.

Below, you'll find a couple examples of what you can do with animations. Try to understand and experiment with the code to get a better feel for how they work.

-Tyler
`
)}

async function* _animation2(d3)
{
  
  // breathing
  
  const svg = d3.create('svg')
      .attr('width', 100)
      .attr('height', 100)
  
  const circle = svg.append('circle')
      .attr('r', 15)
      .attr('cx', 50)
      .attr('cy', 50)
      .style('fill', '#4269bd')
  
  while(true) {
  
    yield svg.node()
    
    await circle
      .transition()
      .ease(d3.easeSinInOut)
      .delay(500)
      .duration(2000)
        .attr('r', 20)
        .style('fill', '#6887ca')
      .transition()
        .attr('r', 15)
        .style('fill', '#4269bd')
      .end()

  }
  
}


async function* _animation3(d3)
{
  
  const data = d3.range(0, 2 * Math.PI, 2 * Math.PI/20)
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 300)
  
  const circle = svg
    .selectAll('circle')
    .data( data )
    .join('circle')
      .attr('r', 15)
      .attr('cx', d => 150 + 130 * Math.cos(d))
      .attr('cy', d => 150 + 130 * Math.sin(d))
      .style('fill', (d,i) => d3.quantize(d3.interpolateRainbow, data.length + 1)[i])
  
  while(true) {
  
    yield svg.node()
    
    await circle
      .transition()
      .duration(5000)
        .attr('cx', (d,i,arr) => 300 - d3.select(arr[i]).attr('cx'))
        .attr('cy', (d,i,arr) => 300 - d3.select(arr[i]).attr('cy'))
      .end()

  }
  
}


function _17(md){return(
md `See you [tomorrow](https://observablehq.com/@thetylerwolf/day-12-interactions-1-click-and-hover)!`
)}

function _18(md){return(
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
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("circle")).define("circle", ["d3"], _circle);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["circle"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["circle","d3"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["circle"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("animation1")).define("animation1", ["d3"], _animation1);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("animation2")).define("animation2", ["d3"], _animation2);
  main.variable(observer("animation3")).define("animation3", ["d3"], _animation3);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
