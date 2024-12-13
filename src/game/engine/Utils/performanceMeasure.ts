type DeveloperPerformanceMeasure = {
  mark: (markName: string) => void;
  measure: (measureName: string, startMark: string, endMark: string) => void;
};

export const developerPerformanceMeasure: DeveloperPerformanceMeasure = {
  mark: (markName: string) => {
    if (process.env.NODE_ENV === "development") {
      performance.mark(markName);
    }
  },
  measure: (measureName: string, startMark: string, endMark: string) => {
    if (process.env.NODE_ENV === "development") {
      performance.measure(measureName, startMark, endMark);
    }
  },
};

if (process.env.NODE_ENV === "development") {
  console.log("Developer mode ON");
  console.log("Performance measurement available on window.performanceMeasure");
  const avgPerformanceEntry = (entries: PerformanceEntryList) => {
    return (
      entries.reduce((acc, entry) => acc + entry.duration, 0) / entries.length
    );
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.performanceMeasure = {
    clear: () => {
      performance.clearMarks();
      performance.clearMeasures();
    },
    showGameLoopStats: () => {
      console.table({
        updateTime: avgPerformanceEntry(
          performance.getEntriesByName("update-duration"),
        ),
        renderTime: avgPerformanceEntry(
          performance.getEntriesByName("render-duration"),
        ),
        loopTime: avgPerformanceEntry(
          performance.getEntriesByName("loop-duration"),
        ),
      });
    },
  };
}
