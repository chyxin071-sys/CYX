import { RecordData } from './storage';

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getMonthStart(year: number, month: number): Date {
  return new Date(year, month - 1, 1);
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

export function getStreakCount(records: RecordData[]): number {
  if (records.length === 0) return 0;

  const sortedDates = records
    .map(r => new Date(r.date).getTime())
    .sort((a, b) => b - a);

  let streak = 1;
  const today = new Date().setHours(0, 0, 0, 0);
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Check if the most recent record is today or yesterday
  if (sortedDates[0] !== today && sortedDates[0] !== today - oneDayMs) {
    return 0;
  }

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = sortedDates[i - 1] - sortedDates[i];
    if (diff === oneDayMs) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('#8E8E93');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let r = 0, g = 0, b = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);

        resolve(`rgb(${r}, ${g}, ${b})`);
      } catch {
        resolve('#8E8E93');
      }
    };
    img.onerror = () => resolve('#8E8E93');
    img.src = imageUrl;
  });
}

export function getLocationStats(records: RecordData[]): Map<string, number> {
  const stats = new Map<string, number>();
  
  records.forEach(record => {
    if (record.location) {
      const province = record.location.split(/[市省]/)[0];
      stats.set(province, (stats.get(province) || 0) + 1);
    }
  });

  return stats;
}

export function getMoodStats(records: RecordData[]): Map<string, number> {
  const stats = new Map<string, number>();
  
  records.forEach(record => {
    if (record.mood) {
      stats.set(record.mood, (stats.get(record.mood) || 0) + 1);
    }
  });

  return stats;
}