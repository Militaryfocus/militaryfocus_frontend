import React from 'react';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'yellow';
  delay?: number;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  color,
  delay = 0,
  description
}) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 bg-blue-500',
    green: 'from-green-50 to-green-100 bg-green-500',
    purple: 'from-purple-50 to-purple-100 bg-purple-500',
    orange: 'from-orange-50 to-orange-100 bg-orange-500',
    red: 'from-red-50 to-red-100 bg-red-500',
    pink: 'from-pink-50 to-pink-100 bg-pink-500',
    yellow: 'from-yellow-50 to-yellow-100 bg-yellow-500'
  };

  return (
    <div 
      className={`group bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color].split(' ')[2]} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-4xl font-bold text-gray-900 mb-2">
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          duration={2000}
        />
      </h3>
      <p className="text-gray-600 font-medium">{title}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
};

export default StatCard;