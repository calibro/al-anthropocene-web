'use strict';

/**
 * @ngdoc directive
 * @name anthropoceneWebApp.directive:network
 * @description
 * # network
 */
angular.module('anthropoceneWebApp')
  .directive('network', function (apiService) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        var width = element.width(),
            height = element.height();

        var svg = d3.select(element[0]).append("svg")
          .attr("width", width)
          .attr("height", height);

        var lnksg = svg.append("g").attr("class","links");
        var ndsg = svg.append("g").attr("class","nodes");
        var txtsg = svg.append("g").attr("class","txt");

        var polesPosition = [
          [{x:width/2, y:height/2}],
          [{x:(width/3), y:height/2}, {x:(width/3)*2, y:height/2}],
          [{x:(width/3), y:height/3}, {x:(width/3)*2, y:height/3}, {x:(width/2), y:(height/3)*2}],
        ]

        var filter = svg.append("defs")
          .append("filter")
            .attr("id", "outlineFilter")

          filter.append("feMorphology")
            .attr("in", "SourceAlpha")
            .attr("operator", "dilate")
            .attr("radius", 5)
            .attr("result", "morphed")

          filter.append("feColorMatrix")
            .attr("in", "morphed")
            .attr("type", "matrix")
            //.attr("values", "-1 0 0 0 1, 0 -1 0 0 1, 0 0 -1 0 1, 0 0 0 1 0")
            .attr("values", "1 0 0 0 -1, 0 1 0 0 -1,  0 0 1 0 -1,0 0 0 1 0")
            .attr("result", "recolored")

          var merge = filter.append("feMerge")

          merge.append("feMergeNode")
            .attr("in", "recolored")

          merge.append("feMergeNode")
            .attr("in", "SourceGraphic")

        var mynodes = [];
        var mylinks = [];

        var force = d3.layout.force()
          //.distance(100)
          .gravity(0.2)
          .friction(0.5)
          .nodes(mynodes)
          .links(mylinks)
          .linkDistance(function(d){return lineScale(d.value)})
          .linkStrength(0.4)
          //.linkStrength(1)
          .charge(-2000)
          //.chargeDistance(2000)
          .size([width, height]);


        var sizeScale = d3.scale.log().range([5,50]);
        var lineScale = d3.scale.linear().range([70,10]);
        var opacityScale = d3.scale.log().range([0.1,1]);

        sizeScale.domain(d3.extent(scope.netData.nodes,function(d){
          return d.size
        }));

        lineScale.domain(d3.extent(scope.netData.links,function(d){
          return d.size
        }));

        opacityScale.domain(d3.extent(scope.netData.nodes,function(d){
          return d.size
        }));

        //add nodes to network data
        scope.netData.nodes.forEach(function(d){
          var curr = findNode('id', d.id);
          if(curr === undefined) {
            addNode(d);
          }
          else {
            curr.value = d.value;
          }
        });

    //add links to data
    scope.netData.links.forEach(function(d){
        addLink(d.source,d.target, d.size);
    });

    var node =ndsg.selectAll(".node")
      .data(force.nodes(), function(d){return d.id});

    var txts =txtsg.selectAll(".txts")
      .data(force.nodes(), function(d){return d.label});

    var nodeText = txts.enter().append("text")
      .attr("dx", 0)
      .attr("dy", ".35em")
      .attr("class","txts")
      .attr("font-size", "14px")
      .attr("text-anchor","middle")
      .attr("fill","white")
      .attr("filter", "url(#outlineFilter)")
      .filter(function(d){
        return d.size > 20
      })
      .text(function(d) {
        return d.label.split(',')[0];
      })
      .attr("fill-opacity",0);

      txts
        .each(function(d){
          var bb = this.getBBox();
          if(bb.width/2 > sizeScale(d.size)) {
            d.size = bb.width/2
          }
          else {
            d.size = d.size;
          }
        })

    var nodeEnter = node.enter().append("circle")
      .attr("fill", "black")
      .attr("fill-opacity",0)
      .attr("stroke-width", 2)
      .attr("stroke", "white")
      .attr("stroke-opacity", 0)
      .attr("class","node")
      .attr("r",function(d){
        return sizeScale(d.size)
      })
      .on("click", function(d){
        var index = scope.nodeSelected.indexOf(d.id)
        if(index >-1){
          scope.nodeSelected.splice(index,1)
        }else{
          scope.nodeSelected.push(d.id);
          scope.nodeSelected.push('christiana-figueres-executive-secretary-of-the-united-nations-framework-convention-on-climate-change');
        }

        //scope.nodeSelected.push('dr-martin-frick');
        //scope.nodeSelected.push('anthropocene');
        //scope.nodeSelected.push('christiana-figueres-executive-secretary-of-the-united-nations-framework-convention-on-climate-change');
        if(!scope.$$phase) {
            scope.$apply()
          }
      })



    node
      .transition().duration(2000)
      .delay(function(d,i){
        return i / force.nodes().length * 2000;
      })
      .attr("stroke-opacity", function(d){
        return opacityScale(d.size)
      })
      .attr("fill-opacity",1);

    txts.transition()
          .duration(4000)
          .delay(function(d,i){
            return i / force.nodes().length * 4000;
          })
          .attr("fill-opacity",1);



    // node.exit().transition().duration(400)
    //   .attr("r",0)
    //   .style("fill-opacity",0)
    //   .remove();


    force.start();


    force.on("tick", function() {

      var q = d3.geom.quadtree(force.nodes()),
        i = 0,
        n = force.nodes().length;

      while (++i < n) q.visit(collide(force.nodes()[i]));

      if(!scope.nodeSelected.length){
      d3.selectAll(".node")
      .attr('cx', function(d) { d.x = Math.max(d.size*2, Math.min(width - d.size*2, d.x)); return d.x; })
        .attr('cy', function(d) { d.y = Math.max(d.size*2, Math.min(height - d.size*2, d.y)); return d.y;})


      d3.selectAll(".txts")
        .attr('x', function(d) { d.x = Math.max(d.size*2, Math.min(width - d.size*2, d.x)); return d.x; })
        .attr('y', function(d) { d.y = Math.max(d.size*2, Math.min(height - d.size*2, d.y)); return d.y;});
    }else{
        node
        .attr('cx', function(d) {  return d.x; })
          .attr('cy', function(d) {  return d.y;})

        txts
          .attr('x', function(d) {  return d.x; })
          .attr('y', function(d) {  return d.y;});
        }
    });

    force.on('end', function(d){
      force.alpha(0.0075)
    })

    scope.$watch('nodeSelected', function(newValue, oldValue) {
      if(newValue != oldValue){
        updateNetwork(newValue)
      }

    }, true);

    function updateNetwork(selected){

      //if(selected.length){
        var file
        if(selected.length == 0){
          file = 'data/test1.json'
        }else if(selected.length>1){
          file = 'data/duevicini.json'
        }else{
          file='data/bl.json'
        };

        apiService.getFile(file).then(
          function(data){

            node.each(function(d){
              if(scope.nodeSelected.indexOf(d.id)>-1){
                d.fixed = true;
              }else{
                d.fixed = false;
              }

            })

            data.links.forEach(function(d){
              var st = d.source + "_" + d.target;
              var found = mylinks.filter(function(e,i){

                var st2 = e.source.id + "_" + e.target.id;
                return st == st2?true:false;
              })
              if(found.length > 0){
              }else{
                addLink(d.source, d.target, d.size)
              }
            });


            var nodesMap = data.nodes.map(function(d){return d.id});

            for(var t = mynodes.length- 1; t>=0; t--) {
              var found = data.nodes.filter(function(d){return d.id === mynodes[t].id});
              if(found.length==0) {
                var id = mynodes[t].id;
                var i = 0;
                while (i < mylinks.length) {
                  if ((mylinks[i]['source'].id == id)||(mylinks[i]['target'].id == id)) mylinks.splice(i,1);
                  else i++;
                }
            }
          }

            node.filter(function(d) { return d.fixed; }).transition().duration(2000)
              .attr("fill", "white")
              .attr("stroke-opacity", function(d){
                return opacityScale(d.size)
              })
              .tween("x", function(d) {
                          var i = d3.interpolate(d.x, polesPosition[scope.nodeSelected.length-1][scope.nodeSelected.indexOf(d.id)].x);
                          return function(t) {
                            d.x = i(t);
                            d.px = i(t);
                          };
               }).tween("y", function(d) {
                          var i = d3.interpolate(d.y, polesPosition[scope.nodeSelected.length-1][scope.nodeSelected.indexOf(d.id)].y);
                          return function(t) {
                            d.y = i(t);
                            d.py = i(t);
                          };
               })

            node.filter(function(d) { return !d.fixed; }).transition().duration(2000)
                .attr("fill", "black")
                .attr("stroke-opacity", function(d){
                  return opacityScale(d.size)
                })
                .attr("r",function(d){
                  return sizeScale(d.size);
                })
                .filter(function(d){
                  return nodesMap.indexOf(d.id)<0?true:false;
                })
                .attr("r",5)
                .attr("fill", "gray")
                .attr("stroke-opacity", 0)

            txts.transition().duration(2000)
            .attr("fill-opacity", 1)
            .filter(function(d){
              return nodesMap.indexOf(d.id)<0?true:false;
              })
            .attr("fill-opacity", 0)



          },
          function(error){
            console.log("ciaooo")
          }
        )

    }

    // Add and remove elements on the graph object
    function addNode(node) {
      mynodes.push(node);
    }

    function removeNode(id) {
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

    function addLink(sourceId, targetId, val) {
      var sourceNode = findNode('id',sourceId);
      var targetNode = findNode('id',targetId);

      if((sourceNode !== undefined) && (targetNode !== undefined)) {
        mylinks.push({"source": sourceNode, "target": targetNode,"value":val});
      }
    };

    function findNode(prop, id) {
      for (var i=0; i < mynodes.length; i++) {
        if (mynodes[i][prop] === id)
          return mynodes[i]
      };
    }

    function findNodeIndex(id) {
      for (var i=0; i < mynodes.length; i++) {
        if (mynodes[i].id === id)
          return i
      };
    }

    function findEgoNetwork(searchNode, egoNetworkDegree, isDirected, searchType) {
      var egoNetwork = {};
      for (var x in force.nodes()) {
        if (force.nodes()[x].id == searchNode || searchType == "aggregate") {
          egoNetwork[force.nodes()[x].id] = [force.nodes()[x].id];
          var z = 0;
          while (z < egoNetworkDegree) {
            var thisEgoRing = egoNetwork[force.nodes()[x].id].slice(0);
            for (var y in force.links()) {
              if (thisEgoRing.indexOf(force.links()[y].source.id) > -1 && thisEgoRing.indexOf(force.links()[y].target.id) == -1) {
                egoNetwork[force.nodes()[x].id].push(force.links()[y].target.id)
              }
              else if (isDirected == false && thisEgoRing.indexOf(force.links()[y].source.id) == -1 && thisEgoRing.indexOf(force.links()[y].target.id) > -1) {
                egoNetwork[force.nodes()[x].id].push(force.links()[y].source.id)
              }
            }
            z++;
          }
        }
      }
      if (searchType == "aggregate") {
        //if it's checking the entire network, pass back the entire object of arrays
        console.log(egoNetwork)
        return egoNetwork;
      }
      else {
        //Otherwise only give back the array that corresponds with the search node
        console.log(egoNetwork[searchNode])
        return egoNetwork[searchNode];
      }
    }

  function collide(node) {

    //var r = sizeScale(node.size)+10,
    var r = node.size + 9,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.size + quad.point.size + 9 ;
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
