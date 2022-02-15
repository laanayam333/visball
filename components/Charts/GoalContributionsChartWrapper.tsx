import { useState } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

import { goalContributions } from '@/data/goalContributions';

import GoalContributionsChart from '@/components/Charts/GoalContributionsChart';
import ButtonFilter from '@/components/Shared/ButtonFilter';

let keys = goalContributions.map((row) => row.player);
keys = [...new Set(keys)];

const GoalContributionsChartWrapper = () => {
  const [active, setActive] = useState('Messi');

  console.log(active);

  return (
    <div className="mb-20 w-full">
      <h2>Club goals vs. player goals in local league</h2>
      <h4 className="my-3">Select a player</h4>
      <div className="flex flex-wrap">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className="relative m-1 cursor-pointer rounded-sm border-2 border-gray-600 bg-none px-2 py-4 text-xl hover:text-blue-500 focus:outline-none"
          >
            {key}
          </button>
        ))}
      </div>
      <div className="relative h-[720px] w-[1270px]">
        <ParentSize>
          {({ width, height }) => (
            <GoalContributionsChart
              data={goalContributions.filter((row) => row.player === active)}
              width={width}
              height={height}
            />
          )}
        </ParentSize>
      </div>
    </div>
  );
};

export default GoalContributionsChartWrapper;
