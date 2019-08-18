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
      simulation: null,
      node: null,
      link: null,
      width: 0,
      height: 0
    };
  },
  mounted() {
    this.simulation = d3
      .forceSimulation(this.nodeData)
      .force(
        "link",
        d3
          .forceLink(this.linkData)
          .id(d => d.id)
          .distance(200)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      //   .force("collide", d3.forceCollide(15))
      .force("center", d3.forceCenter(200, 200));

    this.onResize();

    const svg = d3.select(this.$refs.graph);

    this.link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(this.linkData)
      .join("line")
      .attr("stroke-width", 1);

    // this.node = svg
    //   .append("g")
    //   .attr("stroke", "#fff")
    //   .attr("stroke-width", 1.5)
    //   .selectAll("circle")
    //   .data(this.nodeData)
    //   .join("circle")
    //   .attr("r", 8)
    //   .attr("fill", "red")
    //   .call(this.drag(this.simulation));

    this.node = svg
      .selectAll(".node")
      .data(this.nodeData)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(this.drag(this.simulation))
      .on("click", this.onNodeClick)
      .on("mouseover", d => {
        this.node.attr("opacity", el => (el == d ? 1 : 0.2));
      })
      .on("mouseout", () => {
        this.node.attr("opacity", 1);
      });

    this.node
      .append("text")
      .attr("dx", 12)
      .attr("dy", "0.35em")
      .attr("font-size", 16)
      .attr("color", "#0001")
      .attr("opacity", 0.8)
      .text(function(d) {
        return d.label;
      });

    this.node
      .append("circle")
      .attr("r", 10)
      .attr("fill", "orange");

    this.simulation.on("tick", () => {
      this.link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      this.node
        .attr("r", 8)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
    });
    this.onResize();
  },
  methods: {
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
      this.$emit("on-node-click", el.data);
    }
  }
};
</script>
