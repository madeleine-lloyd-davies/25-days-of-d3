// https://observablehq.com/@thetylerwolf/day-4-groups-attributes-and-styles@257
function _1(md){return(
md `
# Day 4 - Groups, Attributes and Styles

We've learned how to place shapes and modify their attributes and styles based on data. Today, we're going to explore how we can group elements for convenience and why we sometimes use attributes vs. styles.
`
)}

function _2(md){return(
md `### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js brought to you by [Tyler Wolf](https://tylernwolf.com).*`
)}

function _container(html,d3)
{
  
  const svg = html `<svg width="780" height="130" style="border:1px solid #ccc"/>`
  
  const data = d3.range(0,8)
  
  const fib = [ 0, 1, 2, 3, 5, 8, 13 ].reverse()
  
  const colors = d3.scaleLinear(data, d3.schemeRdYlBu[6])
  
  const groups = d3.select(svg)
    .selectAll('g')
    .data( data )
    .join('g')
      .attr('transform', (d,i) => 'translate(' + (130 * i) + ',0)')
  
  groups.selectAll('rect')
    .data( fib )
    .join('rect')
      .attr('x', d => 65 - d * 5)
      .attr('y', d => 65 - d * 5)
      .attr('width', d => d * 10)
      .attr('height', d => d * 10)
      .style('fill', (d,i) => colors(i))
  
  return svg
  
}


function _4(md){return(
md `
# Groups

SVG has a huge range of element types that serve a variety of purposes. I won't get into detail on many of them in these lessons, but one that we'll use time and again is the group element.

Groups are denoted by the \`\`<g></g>\`\` element and can contain child elements like \`\`rect\`\`, \`\`circle\`\` and \`\`text\`\`, among several others. In a lot of ways, they're similar to \`\`div\`\` elements that you're probably used to or like groups in design software if that's more your domain.

The utility of the group element comes when we want to apply a transform on elements together while maintaining their relative positions. This is the most common use case with D3.

This is how it works:
`
)}

function _groups(html,d3)
{
  
  const svg = html `<svg width="300" height="130" style="border:1px solid #ccc"/>`
  
  const data = [
    { name: 'Group 1', value: 1 },
    { name: 'Group 2', value: 2 },
    { name: 'Group 3', value: 3 }
  ]
  
  const fib = [ 0, 1, 2, 3, 5, 8 ]
  
  const groups = d3.select(svg)
    .selectAll('g')
    .data( data )
    .join('g')
      // translate each group to the right based on its index
      .attr('transform', (d,i) => 'translate(' + (100 * i) + ',0)')
  
  groups
    .selectAll('rect')
    .data( fib )
    .join('rect')
      .attr('x', 10)
      .attr('y', 30)
      .attr('width', d => d * 10)
      .attr('height', d => d * 10)
      .style('fill', 'transparent')
      .style('stroke', '#ff7b57')
      .style('stroke-width', 2)
  
  groups.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .attr('dy', '0.35em')
      .style('font-family', 'sans-serif')
      .style('font-size', 12)
      .text(d => d.name)
  
  return svg
  
}


function _6(md){return(
md `
In the example, We've translated each group 100 pixels to the right of the previous group. Then, when we place our text labels and rects, we placed them right next to each other - no need to calculate their positions based on their index because the groups already did it.

There are several other types of transforms you can apply to svg elements. You can [learn more about transforms here](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform).

Also worth noting, when a style is applied to a group element, the style is applied to all of the children in the group. If a particular element has its own style applied, that setting will override the group element's style.

You can [learn more about group elements here](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g).
`
)}

function _7(md){return(
md `
# Styles and Attributes

As we've been placing our graphic elements, you may have noticed that some modifications use \`\`.attr()\`\` while others use \`\`.style()\`\`. This is as good a time as any to explain the difference.

### Styles

You can use \`\`.style\`\` to apply styles to elements - makes sense right?! To clarify what that means, styles are things that can be set with CSS. They show up on your element as an in-line style (\`\`<rect style="fill:'red'"/>\`\`).

A good rule of thumb is, if it works in CSS, set it with \`\`.style()\`\`

### Attributes

When I first learned to use D3, I just used \`\`.attr()\`\` for everything. I did this because it always seemed to work. That is, of course, until it didn't. After a couple incidents of this, I learned the hard way that \`\`.attr()\`\` does work for many styles like \`\`stroke\`\` or \`\`fill\`\`, but simply doesn't work for some settings.

You'll notice that for positioning/sizing details like x and y and height, width and radius, I use attributes, while for visual styling details like colors or opacity, I use styles. One could make the case for better code readability with this, but I'm not here to argue with anyone.

As browser compatibility evolves, there seems to be less differentiation between the two, but be wary - if something's not working as expected, a misused \`\`.attr()\`\` or \`\`.style()\`\` could be the cause.
`
)}

function _8(md){return(
md `
# Day 4 Conclusion

That's it for day 4. [Tomorrow](https://observablehq.com/@thetylerwolf/day-5-our-first-bar-chart), we build our first real chart, so make sure you're familiar with the concepts covered over the past four days and get a good night's sleep!

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
  main.variable(observer("groups")).define("groups", ["html","d3"], _groups);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
