<template>
  <div v-resize="onResize">
    <svg ref="graph" :width="width" :height="height" />
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: {
    nodeData: Array,
    linkData: Array
  },
  data: function() {
    return {
      svg: null,
      simulation: null,
      node: null,
      link: null,
      width: 0,
      height: 0
    };
  },
  mounted() {
    this.svg = d3.select(this.$refs.graph);

    this.simulation = d3
      .forceSimulation(this.nodeData)
      .force(
        "link",
        d3
          .forceLink(this.linkData)
          // @ts-ignore
          .id(d => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("colide", d3.forceCollide().radius(25))
      .force("center", d3.forceCenter(200, 200));
    // .force("size", [200, 200]);

    this.link = this.svg.append("g").selectAll(".link");

    this.node = this.svg.append("g").selectAll(".node");

    this.simulation.on("tick", () => {
      this.link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      this.node
        .attr("r", 8)
        .attr("cx", d => {
          return (d.x = Math.max(0, Math.min(d.x, this.width)));
        })
        .attr("cy", d => {
          return (d.y = Math.max(0, Math.min(d.y, this.height)));
        })
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
    });
    this.onDataChange();
    this.onResize();
  },
  watch: {
    nodeData() {
      this.onDataChange();
    },
    linkData() {
      this.onDataChange();
    }
  },
  methods: {
    onDataChange() {
      this.node = this.node.data(this.nodeData, d => d.id);

      this.node.exit().remove();

      var tmpNode = this.node
        .enter()
        .append("g")
        .attr("class", "node")
        .call(this.drag(this.simulation))
        .on("click", d => this.onNodeClick(d))
        .on("mouseover", d => {
          this.node.attr("opacity", el => (el == d ? 1 : 0.2));
        })
        .on("mouseout", () => {
          this.node.attr("opacity", 1);
        });

      tmpNode
        .append("text")
        .attr("dx", 12)
        .attr("dy", "0.35em")
        .attr("font-size", 16)
        .attr("color", "#0001")
        .attr("opacity", 0.8)
        .text(function(d) {
          return d.label;
        });

      tmpNode
        .append("circle")
        .attr("r", 10)
        .attr("fill", "orange");

      this.node = tmpNode.merge(this.node);

      // @ts-ignore
      this.link = this.link.data(this.linkData, d => d.source + "-" + d.target);

      this.link.exit().remove();

      var tmpLink = this.link
        .enter()
        .append("line")
        .attr("stroke-width", 1)
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.4);
      // @ts-ignore
      // .merge(this.link!);

      this.link = tmpLink.merge(this.link);

      this.simulation.nodes(this.nodeData);
      this.simulation.force("link").links(this.linkData);
      this.simulation.alpha(1).restart();
      // this.simulation!.tick()
    },
    getNeighbors(node) {
      return this.linkData.reduce(
        (neighbors, link) => {
          if (link.target.id == node.id) {
            neighbors.push(link.source.id);
          } else if (link.source.id == node.id) {
            neighbors.push(link.target.id);
          }
          return neighbors;
        },
        [node.id]
      );
    },
    drag(simulation) {
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    },
    onResize() {
      this.width = this.$el.offsetWidth;
      this.height = this.$el.offsetHeight;
      this.recenter();
    },
    recenter() {
      if (this.simulation) {
        this.simulation.force(
          "center",
          d3.forceCenter(this.width / 2, this.height / 2)
        );
        this.simulation.tick();
      }
    },
    onNodeClick(el) {
      this.$emit("on-node-click", el.id);
    }
  }
};
</script>
