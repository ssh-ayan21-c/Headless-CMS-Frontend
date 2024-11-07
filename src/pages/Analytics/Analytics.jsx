import * as React from "react";
import { Link } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

import { useTheme } from "../../contexts/theme";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { chartsGridClasses } from "@mui/x-charts/ChartsGrid";

import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

import "./Analytics.css";
import StatCard from "../../components/StatCard/StatCard";
import { useUserContext } from "../../contexts/user";
import { RiAddCircleFill } from "@remixicon/react";
import Loader from "../../components/Loader/Loader";

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];

const mData = Array.from({ length: 30 }, () =>
  Math.floor(Math.random() * 10000)
);

const xLabels = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
});

const data = [
  { label: "Group A", value: 400, color: "#E43D11" },
  { label: "Group B", value: 300, color: "#ff724b" },
  { label: "Group C", value: 300, color: "#ffa991" },
  { label: "Group D", value: 200, color: "#ffd4c8" },
];

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0.1} />
      </linearGradient>
    </defs>
  );
}

const StyledText = styled("text")(() => ({
  fill: "#737373",
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function Analytics() {
  const { theme } = useTheme();
  const { userData } = useUserContext();
  if (!userData) return <Loader />;
  return (
    <div id="analytics" className={`analytics-${theme}`}>
      <div className="new-blog-card">
        <p>Hi, {userData?.full_name} </p>
        <p>Grow your portfolio by uploading new blogs.</p>
        <div className="new-blog-card-btns">
          <Link className="new-blog-btn" to="/editor">
            <RiAddCircleFill />
            New Blog
          </Link>
        </div>
      </div>
      <div className="stat-cards">
        <StatCard
          color={"green"}
          data={mData}
          header={"Total Views"}
          desc={"Views in the last 7 days"}
          value={"14K"}
        />
        <StatCard
          color={"red"}
          data={mData}
          header={"Followers"}
          desc={"Current followers count"}
          value={"2000"}
        />
      </div>
      <div className="plots">
        <div className="line-chart" style={{ width: "60%" }}>
          <p className="chart-header">Top Performing Blogs</p>
          <p className="chart-desc">Comparative Analysis of Last 7 Days</p>
          <LineChart
            height={300}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
            series={[
              {
                id: "first",
                stack: "views",
                data: pData,
                curve: "natural",
                label: "How to get 1000 views on youtube",
                color: "#E43D11",
                area: true,
              },
              {
                id: "second",
                stack: "views",
                data: uData,
                curve: "natural",
                label: "How to get 1000 views on youtube",
                color: "#ffa991",
                area: true,
              },
            ]}
            xAxis={[
              {
                scaleType: "point",
                data: xLabels,
                tickLabelStyle: {
                  fontSize: 12,
                  fill: `${"#727272"}`,
                },
              },
            ]}
            leftAxis={null}
            sx={() => ({
              "& .MuiAreaElement-series-first": {
                fill: "url('#first')",
              },
              "& .MuiAreaElement-series-second": {
                fill: "url('#second')",
              },
              [`.${axisClasses.root}`]: {
                [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                  stroke: "#727272",
                  strokeWidth: 3,
                },
              },
              [`& .${chartsGridClasses.line}`]: {
                strokeDasharray: "5 3",
                strokeWidth: 1,
                stroke: "#72727244",
              },
            })}
          >
            <AreaGradient color="#E43D11" id="first" />
            <AreaGradient color="#ffa991" id="second" />
          </LineChart>
        </div>
        <div className="pie-chart" style={{ width: "40%" }}>
          <p className="chart-header">Performace by View Share</p>
          <p className="chart-desc">Views Share in the Last 365 Days</p>
          <PieChart
            series={[
              {
                paddingAngle: 3,
                cornerRadius: 5,
                innerRadius: 85,
                outerRadius: 110,
                data,
                highlightScope: { faded: "global", highlighted: "item" },
              },
            ]}
            height={300}
            slotProps={{
              legend: {
                itemGap: 10,
                itemMarkHeight: 3,
                itemMarkWidth: 15,
                labelStyle: {
                  fontSize: 14,
                  fill: "#727272",
                },
              },
            }}
          >
            <PieCenterLabel>Total Views</PieCenterLabel>
          </PieChart>
        </div>
      </div>
    </div>
  );
}
