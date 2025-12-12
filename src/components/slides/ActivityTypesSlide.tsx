import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getActivityEmoji } from '../../services/dataProcessing';

interface ActivityTypesSlideProps {
  activityTypes: Record<string, number>;
}

const COLORS = ['#fc4c02', '#00d4aa', '#a855f7', '#3b82f6', '#ffd93d', '#ff7f6e', '#10b981', '#f472b6'];

export function ActivityTypesSlide({ activityTypes }: ActivityTypesSlideProps) {
  const sortedTypes = Object.entries(activityTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const total = sortedTypes.reduce((sum, [, count]) => sum + count, 0);
  
  const chartData = sortedTypes.map(([name, value]) => ({
    name,
    value,
    percentage: ((value / total) * 100).toFixed(1),
  }));

  const topActivity = sortedTypes[0];

  return (
    <SlideWrapper className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-700">
      <div className="relative z-10 w-full max-w-sm">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/80 text-lg mb-4 uppercase tracking-wider text-center"
        >
          Your favorite activities
        </motion.p>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
          className="h-48 mb-6"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                animationBegin={400}
                animationDuration={1000}
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center -mt-2">
              <span className="text-4xl">{getActivityEmoji(topActivity[0])}</span>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-2"
        >
          {chartData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="flex items-center justify-between glass-card px-4 py-2 bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-lg">{getActivityEmoji(item.name)}</span>
                <span className="text-white font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-white font-bold">{item.value}</span>
                <span className="text-white/60 text-sm ml-2">({item.percentage}%)</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

