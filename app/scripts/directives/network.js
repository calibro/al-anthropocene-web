'use strict';

/**
 * @ngdoc directive
 * @name anthropoceneWebApp.directive:network
 * @description
 * # network
 */
angular.module('anthropoceneWebApp')
  .directive('network', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        var width = element.width(),
            height = element.height();

        var svg = d3.select(element[0]).append("svg")
          .attr("width", width)
          .attr("height", height);

        // var cross = textures.paths()
        //             .d("crosses")
        //             .stroke("white")
        //             .thicker();
        //
        // var palliniradi = textures.circles()
        //               .fill("white")
        //               .thicker();
        //
        // svg.call(cross);
        // svg.call(palliniradi);

        var lnksg = svg.append("g").attr("class","links");
        var ndsg = svg.append("g").attr("class","nodes");

        var mynodes = [];
        var mylinks = [];

        var force = d3.layout.force()
          //.distance(100)
          .gravity(0.2)
          .friction(0.5)
          .nodes(mynodes)
          .links(mylinks)
          //.linkDistance(function(d){return lineScale(d.value)})
          .linkStrength(0.5)
          //.linkStrength(1)
          .charge(-2000)
         //.chargeDistance(400)
          .size([width, height]);


        var sizeScale = d3.scale.log().range([5,50]);
        var lineScale = d3.scale.linear().range([70,20]);


        scope.$watch("netData",function(newValue,oldValue){
          if(newValue!==oldValue) {
            drawNetwork(newValue);
            console.log(newValue)
          }
        });


        // Add and remove elements on the graph object
        var addNode = function (node) {
          mynodes.push(node);
        }

        var removeNode = function (id) {
          var i = 0;
          var n = findNode(id);
          while (i < mylinks.length) {
            if ((mylinks[i]['source'] === n)||(mylinks[i]['target'] == n)) mylinks.splice(i,1);
            else i++;
          }
          var index = findNodeIndex(id);
          if(index !== undefined) {
            mynodes.splice(index, 1);
          }
        }

        var addLink = function (sourceId, targetId, val) {
          var sourceNode = findNode('id',sourceId);
          var targetNode = findNode('id',targetId);

          if((sourceNode !== undefined) && (targetNode !== undefined)) {
            //console.log({"source": sourceNode, "target": targetNode,"value":val})
            mylinks.push({"source": sourceNode, "target": targetNode,"value":val});
          }
        };

        var findNode = function (prop, id) {
          for (var i=0; i < mynodes.length; i++) {
            if (mynodes[i][prop] === id)
              return mynodes[i]
          };
        }

        var findNodeIndex = function (id) {
          for (var i=0; i < mynodes.length; i++) {
            if (mynodes[i].id === id)
              return i
          };
        }

  // draw the network
  function drawNetwork(data) {

    //set scale domains
    //------------------
    // sizeScale.domain([0,d3.max(data.nodes,function(d){
    //   return d.size
    // })]);

    sizeScale.domain(d3.extent(data.nodes,function(d){
      return d.size
    }));

    lineScale.domain(d3.extent(data.links,function(d){
      return d.size
    }));

    //add nodes to network data
    data.nodes.forEach(function(d){
      var curr = findNode('id', d.id);
      if(curr === undefined) {
        addNode(d);
      }
      else {
        curr.value = d.value;
      }
    });

    //remove nodes from network data
    for(var t = mynodes.length- 1; t>=0; t--) {
      var found = data.nodes.filter(function(d){return d.id === mynodes[t].id});
      if(found.length==0) {
        removeNode(mynodes[t].id);
      }
    }

    //add links to data
    data.links.forEach(function(d){
        addLink(d.source,d.target, d.size);
    });

    //console.log(data.links.length, force.links(), force.nodes())


    //draw
    //---------------


    // var link = lnksg.selectAll(".link")
    //   //.data(force.links(),function(d){return d.source.name + "-" + d.target.name;});
    //   .data(force.links())
    //
    //
    // link.enter().append("line")
    //   .attr("class", "link")
    //   .style("opacity",1)
    //   .style("stroke","white")
    //   //.style("stroke-width", function(d) { return Math.sqrt(d.weight); });
    //   .style("stroke-width", 1);



    //link.exit().transition().duration(400).style("opacity",0).remove();


    var node =ndsg.selectAll(".node")
      .data(force.nodes(), function(d){return d.id});

    var txts =svg.selectAll(".txts")
      .data(force.nodes(), function(d){return d.label});

    var nodeEnter = node.enter().append("circle")
      .attr("fill-opacity",0)
      .attr("stroke-width", function(d){
        if(d.attributes['Category'] == "theme"){
          return 3
        }else{
          return 1
        }
      })
      .attr("stroke",function(d){
        if(d.attributes['Category'] == "speaker"){
          return "none"
        }else{
          return "white"
        }
      })
      .attr("stroke-opacity", 0)
      .attr("stroke-dasharray", function(d){
        if(d.attributes['Category'] == "place"){
          return "1, 3"
        }else{
          return null
        }
      })
      .attr("fill", function(d){
        if(d.attributes['Category'] == "place"){
          return "none"
        }else{
          return "none"
        }
      })
      .attr("class","node")
      .attr("r",function(d){
        return sizeScale(d.size)
      })

    var nodeText = txts.enter().append("text")
      .attr("dx", 0)
      .attr("dy", ".35em")
      .attr("class","txts")
      .attr("font-size", "14px")
      .attr("text-anchor","middle")
      .attr("fill","white")
      .filter(function(d){
        return d.size > 20
      })
      .text(function(d) {
        return d.label.split(',')[0];
      })
      .style("fill-opacity",0);


    node
      .transition().duration(2000)
      .delay(function(d,i){
        return i / d.size * 2000;
      })
      .attr("stroke-opacity", 1)
      .attr("fill-opacity",1);

    txts.transition()
          .duration(4000)
          .delay(function(d,i){
            return i / d.size * 4000;
          })
          .style("fill-opacity",1);

      // .transition().duration(4000)
      // .style("fill-opacity",0)
      // .transition().duration(8000)
      // .delay(function(d,i){
      //   return i / d.size * 2000;
      // })
      // .style("fill-opacity",1)

    //
    txts
      .each(function(d){
        var bb = this.getBBox();
        if(bb.width/2 > sizeScale(d.size)) {
          d.size = bb.width/2
        }
        else {
          d.size = sizeScale(d.size);
        }
      })


    node.exit().transition().duration(400)
      .attr("r",0)
      .style("fill-opacity",0)
      .remove();

    // txts.exit().transition().duration(400).style("fill-opacity",0).remove();

    force.start();


    force.on("tick", function() {

    //  d3.selectAll("line").attr("x1", function(d) { return d.source.x; })
    //    .attr("y1", function(d) { return d.source.y; })
    //    .attr("x2", function(d) { return d.target.x; })
    //    .attr("y2", function(d) { return d.target.y; });

      var q = d3.geom.quadtree(force.nodes()),
        i = 0,
        n = force.nodes().length;

      while (++i < n) q.visit(collide(force.nodes()[i],d3.selectAll(".node")[0][i]));

      d3.selectAll(".node")
      .attr('cx', function(d) { d.x = Math.max(d.size*2, Math.min(width - d.size*2, d.x)); return d.x; })
        .attr('cy', function(d) { d.y = Math.max(d.size*2, Math.min(height - d.size*2, d.y)); return d.y;});

      d3.selectAll(".txts")//.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        .attr('x', function(d) { d.x = Math.max(d.size*2, Math.min(width - d.size*2, d.x)); return d.x; })
        .attr('y', function(d) { d.y = Math.max(d.size*2, Math.min(height - d.size*2, d.y)); return d.y;});

      if (force.alpha()<0.01){
        force.alpha(0.011)
      }


    });



    //collision detection function
    //----------------------------
  }

          drawNetwork(scope.netData);

  function collide(node,elem) {


    // var r = sizeScale(node.value) +sizeScale.domain()[1] + 20,
    var r = node.size + sizeScale.domain()[1] +10,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.size + quad.point.size +10;
        if (l < r) {
          l = (l - r) / l * 0.5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
  }


      }
    };
  });
