// https://observablehq.com/@thetylerwolf/day-20-animations-part-2@182
function _1(md){return(
md`
# Day 20 - Animations Part 2

Setting up basic transitions is an easy, one-line operation, but in order to have full control over element animation, we need to dive deeper into \`\`d3.transition()\`\`.
`
)}

function _2(md){return(
md `
# Transitions

Thus far, we've called \`\`.transition()\`\` on selections
`
)}

function _3(d3){return(
d3.select('thing')
    .style('fill', 'red')
  .transition()
    .style('fill', 'blue')
)}

function _4(md){return(
md `
This version of transitions applies the transition only to the selected element(s) and leaves it there. If we wanted to control three selections at once, we would have to set the same transition on each of the three selections. But that can become a lot to keep track of.

\`\`selection.transition()\`\` returns a transition object, which means that if we set a transition on a group of elements' common parent, we can coordinate animations. When we pass the newly created transition to a \`\`selection.transition()\`\`, the selection's transition will inherit the original transition's settings. We can use this to coordinate animations.

Note that you may need to re-run the code in a cell to replay the animation.
`
)}

function _5(d3)
{
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 300)

  const t = svg.transition()
      .duration(3000)
      .delay(250)

  svg.append('circle')
      .attr('cx', 50)
      .attr('cy', 20)
      .attr('r', 15)
    .transition(t)
      .attr('cy', 280)
      .style('fill', 'gray')
  
  svg.append('rect')
      .attr('x', 140)
      .attr('y', 5)
      .attr('width', 30)
      .attr('height', 30)
    .transition(t)
      .attr('y', 265)
      .style('fill', 'steelblue')
  
  svg.append('circle')
      .attr('cx', 250)
      .attr('cy', 20)
      .attr('r', 15)
    .transition(t)
      .attr('cy', 280)
      .style('fill', 'pink')

  return svg.node()

}


function _6(md){return(
md `
We can also chain transitions
`
)}

function _7(d3)
{
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 300)

  svg.append('circle')
      .attr('cx', 50)
      .attr('cy', 20)
      .attr('r', 15)
    .transition()
      .delay(500)
      .attr('cy', 280)
      .style('fill', 'gray')
    .transition()
      .attr('cy', 150)
      .attr('cx', 150)
      .style('fill', 'blue')
    .transition()
      .attr('cy', 280)
      .attr('cx', 250)
      .style('fill', 'pink')
    .transition()
    .delay(1000)
      .attr('cy', 50)
      .attr('cx', 20)
      .style('fill', 'black')

  return svg.node()
  
}


function _8(md){return(
md `
When we transition an element, we can modify its attributes and styles and how they're animated by changing the [easing function](https://github.com/d3/d3-ease#api-reference), but we can also modify it by using a custom interpolator (easing functions _are_ interpolators 🤯).

To do this, we use \`\`.attrTween()\`\` or \`\`.styleTween()\`\`
`
)}

function _9(d3)
{
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 300)

  const intX = d3.interpolateBasis([50, 50, 150, 250, 50]),
        intY = d3.interpolateBasis([20, 280, 150, 280, 20])
  
  svg.append('circle')
      .attr('cx', intX(0))
      .attr('cy', intY(0))
      .attr('r', 15)
    .transition()
      .delay(500)
      .duration(4000)
      .attrTween('cx', () => intX)
      .attrTween('cy', () => intY)
      .styleTween('fill', () => d3.interpolateInferno)

  return svg.node()
  
}


function _10(md){return(
md `
We can also transition text values
`
)}

function _11(d3)
{
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 300)

  svg.append('text')
      .attr('x', 150)
      .attr('y', 150)
      .attr('text-anchor', 'middle')
      .style('font-family', 'sans-serif')
      .style('font-size', '64')
      .style('font-weight', 'bold')
    .text('999')
    .transition()
    .delay(500)
    .duration(10000)
      .textTween(() => d3.interpolateRound('999', '0'))

  return svg.node()
  
}


function _12(md){return(
md `
Finally, we can await the end of a transition and do something after.
`
)}

async function* _13(d3)
{
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 300)

  yield svg.node()
  
  await svg.append('text')
      .attr('x', 150)
      .attr('y', 150)
      .attr('text-anchor', 'middle')
      .style('font-family', 'sans-serif')
      .style('font-size', '64')
      .style('font-weight', 'bold')
    .text('99')
    .transition()
    .delay(500)
    .duration(1000)
      .textTween(() => d3.interpolateRound('99', '0'))
    .end()

  svg.style('background-color', 'black')
  
}


function _14(md){return(
md `
# Conclusion

This covers a little more about transitions and how we can control them in our D3 compositions. They're not too complicated, but orchestrating complex interactions along with animations can require some careful programming. Familiarizing with [how transitions work and what you can do with them](https://github.com/d3/d3-transition/tree/v1.3.2) will save you a headache when the time comes.

That's it for today. See you [tomorrow](https://observablehq.com/@thetylerwolf/day-21-object-constancy)!

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
  main.variable(observer()).define(["d3"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["d3"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["d3"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["d3"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["d3"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["d3"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
