import React, { useCallback } from 'react';
import { extent, format } from 'd3';
import { motion } from 'framer-motion';
import { AreaStack, Line, Bar } from '@visx/shape';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { AxisBottom, AxisLeft, Axis } from '@visx/axis';
import { LegendOrdinal, LegendLabel, LegendItem } from '@visx/legend';
import { localPoint } from '@visx/event';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';

interface IData {
  player: string;
  club: string;
  year: number;
  season: string;
  teamGoals: number;
  playerGoals: number;
  playerAssists: number;
  playerGoalsPercentage: number;
  playerAssistsPercentage: number;
}

interface IProps {
  data: IData[];
  height: number;
  width: number;
}

const tooltipStyles = {
  ...defaultStyles,
  border: '1px solid #a7a9be',
  color: 'black',
  fontSize: '1rem',
  margin: 0,
  padding: '0 0.5rem 0.5rem 0.5rem',
};

export default function GoalContributionsChart({
  data,
  height,
  width,
  margin = { top: 40, bottom: 30, left: 50, right: 20 },
}: IProps) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const legendGlyphSize = 10;
  const tickLabelColor = '#fff';

  const tickLabelProps = () =>
    ({
      fill: tickLabelColor,
      fontSize: 12,
      fontFamily: 'sans-serif',
      textAnchor: 'middle',
    } as const);

  // create accessor functions
  const getX = (d) => d.year;
  const getY0 = (d) => d[0] / 100;
  const getY1 = (d) => d[1] / 100;

  const keys = Object.keys(data[0]).filter(
    (k) =>
      k !== 'player' &&
      k !== 'club' &&
      k !== 'year' &&
      k !== 'season' &&
      k !== 'teamGoals' &&
      k !== 'playerGoals' &&
      k !== 'playerAssists'
  );

  // create scales
  const xScale = scaleLinear({
    range: [margin.left, innerWidth + margin.left],
    domain: extent(data, getX),
  });

  const yScale = scaleLinear({
    range: [innerHeight + margin.top, margin.top],
  });

  const fillScale = scaleOrdinal({
    domain: keys,
    range: ['#045A8D', '#F1EEF6'],
  });

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  } = useTooltip();

  // event handler
  const handleTooltip = useCallback(
    (event) => {
      const { x } = localPoint(event) || { x: 0 };
      let x0 = xScale.invert(x);
      x0 = Math.round(x0);

      // for mobile, prevents tooltip from crashing the app
      if (x0 > 2020) x0 = 2020;
      if (x0 < 2002) x0 = 2002;

      const d = data.filter((row) => row.year === x0);

      const { y } = localPoint(event) || { y: 0 };

      showTooltip({
        tooltipData: d,
        tooltipLeft: xScale(x0),
        tooltipTop: y,
      });
    },
    [data, showTooltip, xScale]
  );

  return (
    <div className="text-xs text-white">
      <LegendOrdinal scale={fillScale} direction="row" labelMargin="0 15px 0 0">
        {(labels) => (
          <>
            <h4 className="mt-4">Age</h4>
            <div className="grid grid-flow-col grid-cols-4">
              {labels.map((label, i) => (
                <LegendItem key={i} margin="0 10px">
                  <svg
                    width={legendGlyphSize}
                    height={legendGlyphSize}
                    className="fill-white text-xs"
                  >
                    <rect
                      fill={label.value}
                      width={legendGlyphSize}
                      height={legendGlyphSize}
                    />
                  </svg>
                  <LegendLabel className="ml-1" align="left">
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              ))}
            </div>
          </>
        )}
      </LegendOrdinal>

      <svg height={height} width={width} className="fill-white text-xs">
        <AreaStack
          top={margin.top}
          left={margin.left}
          data={data}
          keys={keys}
          x={(d) => xScale(getX(d.data)) ?? 0}
          y0={(d) => yScale(getY0(d)) ?? 0}
          y1={(d) => yScale(getY1(d)) ?? 0}
        >
          {({ stacks, path }) =>
            stacks.map((stack) => (
              <motion.path
                initial={false}
                animate={{ d: path(stack) }}
                key={`stack-${stack.key}`}
                stroke={fillScale(stack.key)}
                strokeWidth={0.5}
                fill={fillScale(stack.key)}
              />
            ))
          }
        </AreaStack>
        <AxisLeft
          scale={yScale}
          left={margin.left}
          tickStroke="#fff"
          stroke="#fff"
          tickFormat={format('.0%')}
          tickLabelProps={tickLabelProps}
        />
        <Axis
          orientation="top"
          scale={xScale}
          top={margin.top}
          tickFormat={format('d')}
          tickStroke="#fff"
          stroke="#fff"
          numTicks={innerWidth > 500 ? 10 : 5}
        />
        <AxisBottom
          scale={xScale}
          top={innerHeight + margin.top}
          tickFormat={format('d')}
          tickStroke="#fff"
          stroke="#fff"
          numTicks={innerWidth > 500 ? 10 : 5}
        />
        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke="black"
              opacity={0.5}
              strokeWidth={1}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop - 12}
          left={tooltipLeft + 12}
          style={tooltipStyles}
        >
          <div>
            <h5 className="m-0 p-0 text-center font-bold text-black">
              {tooltipData[0].club} {tooltipData[0].season}{' '}
            </h5>
            <h5 className="m-0 p-0 text-center text-black">
              Team goals: {tooltipData[0].teamGoals}
            </h5>
            <h5 className="m-0 p-0 text-center text-black">
              {`
              Player goal contributions: ${
                tooltipData[0].playerGoals + tooltipData[0].playerAssists
              } (${(
                tooltipData[0].playerGoalsPercentage +
                tooltipData[0].playerAssistsPercentage
              ).toFixed(1)}%)`}
            </h5>
            <h5 className="m-0 p-0 text-center text-black">
              {`
              Player goals: ${tooltipData[0].playerGoals} (
                ${tooltipData[0].playerGoalsPercentage.toFixed(1)}%)
                `}
            </h5>
            <h5 className="m-0 p-0 text-center text-black">
              {`
              Player assists: ${tooltipData[0].playerAssists} (
                ${tooltipData[0].playerAssistsPercentage.toFixed(1)}%)
                `}{' '}
            </h5>

            {/* {[...keys].reverse().map((key, i) => (
              <div
                className="grid grid-flow-row grid-cols-2 pb-1"
                key={`tooltip${i}`}
              >
                <div
                  style={{
                    background: fillScale(key),
                  }}
                />
                <div>{key}</div>
                <div className="text-right">
                  {format('.0%')(tooltipData[0][key])}
                  {tooltipData[0][key]}
                </div>
              </div>
            ))} */}
          </div>
        </TooltipWithBounds>
      )}
    </div>
  );
}
