"use client";

interface TimelineEvent {
  timestamp: string;
  description: string;
}

interface TimelinePanelProps {
  events?: TimelineEvent[];
  isLoading?: boolean;
}

export default function TimelinePanel({ events, isLoading = false }: TimelinePanelProps) {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Timeline</h2>
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <span>Analyzing video...</span>
        </div>
      ) : events && events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                {index < events.length - 1 && (
                  <div className="mt-1 h-12 w-0.5 bg-gray-300"></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="font-mono text-sm text-gray-500">{event.timestamp}</p>
                <p className="mt-1 text-gray-700">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No timeline data yet. Upload a video to get started.</p>
      )}
    </div>
  );
}
