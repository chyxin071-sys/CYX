const STORAGE_KEY = 'life-records';
const SETTINGS_KEY = 'life-settings';

export interface Settings {
  username: string;
}

export interface RecordData {
  id: string;
  date: string; // YYYY-MM-DD format
  photo: string; // URL to photo
  text: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  primaryColor?: string;
  createdAt: number;
}

export class StorageService {
  static getRecords(): RecordData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getSettings(): Settings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : { username: '旅行者' };
    } catch {
      return { username: '旅行者' };
    }
  }

  static saveSettings(settings: Settings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  static getRecordByDate(date: string): RecordData | undefined {
    const records = this.getRecords();
    return records.find(r => r.date === date);
  }

  static saveRecord(record: RecordData): void {
    const records = this.getRecords();
    const existingIndex = records.findIndex(r => r.date === record.date);
    
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  static deleteRecord(date: string): void {
    const records = this.getRecords();
    const filtered = records.filter(r => r.date !== date);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  static getRecordsByMonth(year: number, month: number): RecordData[] {
    const records = this.getRecords();
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    return records.filter(r => r.date.startsWith(monthStr));
  }

  static getRecordsByYear(year: number): RecordData[] {
    const records = this.getRecords();
    const yearStr = `${year}`;
    return records.filter(r => r.date.startsWith(yearStr));
  }

  static initializeSampleData(): void {
    const existing = this.getRecords();
    if (existing.length > 0) return;

    // Sample images for demo
    const sampleImages = [
      'https://images.unsplash.com/photo-1697220214526-7c06c06b3c58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwbGlmZXN0eWxlfGVufDF8fHx8MTc3MTY5NDMwOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1600120616210-f0af010134e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjBuYXR1cmUlMjBtb3VudGFpbnxlbnwxfHx8fDE3NzE2OTQzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1643875402004-22631ef914aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGNpdHklMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNjU2NjY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1666079908235-5508cd2fa07f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwZWFjZWZ1bCUyMG1vcm5pbmd8ZW58MXx8fHwxNzcxNjk0MzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcxNjIwNTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1598399929533-847def01aa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBvY2VhbiUyMGJlYWNofGVufDF8fHx8MTc3MTU3ODA0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    ];

    const locations = ['北京', '上海', '深圳', '杭州', '成都', '广州'];
    const texts = [
      '今天的天气很好，心情也跟着明朗起来。',
      '在咖啡馆度过了一个安静的下午。',
      '看到了美丽的日落，觉得生活充满希望。',
      '和朋友们一起度过了愉快的时光。',
      '偶然发现一家很有特色的小店。',
      '简单的幸福就在身边。',
    ];

    // Initialize with some sample data for demo purposes
    const sampleRecords: RecordData[] = [];
    const currentDate = new Date();
    
    // Create sample records for the past few months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i * 7);
      
      sampleRecords.push({
        id: `sample-${i}`,
        date: date.toISOString().split('T')[0],
        photo: sampleImages[i % sampleImages.length],
        text: texts[i % texts.length],
        location: `${locations[i % locations.length]}市`,
        coordinates: {
          lat: 30 + (i % 10) * 1.5,
          lng: 110 + (i % 10) * 2,
        },
        primaryColor: `hsl(${i * 30}, 65%, ${50 + (i % 3) * 10}%)`,
        createdAt: date.getTime(),
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleRecords));
  }
}