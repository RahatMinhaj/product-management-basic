export class DateAndTime {
  static formatDate(isoDateString: string, locale: string = 'en-US'): string {
    const date = new Date(isoDateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  static formatTime(isoDateString: string, locale: string = 'en-US'): string {
    const date = new Date(isoDateString);
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  static formatDateTime(isoDateString: string, locale: string = 'en-US'): string{
    if (isoDateString != null){
      const date = new Date(isoDateString);
      return `${this.formatDate(isoDateString, locale)} at ${this.formatTime(isoDateString, locale)}`;
    }
    return '';
  }

  static getCurrentDate(locale: string = 'en-US'): string {
    return this.formatDate(new Date().toISOString(), locale);
  }

  static getCurrentTime(locale: string = 'en-US'): string {
    return this.formatTime(new Date().toISOString(), locale);
  }

  static getCurrentDateTime(locale: string = 'en-US'): string {
    return this.formatDateTime(new Date().toISOString(), locale);
  }

  static addDays(isoDateString: string, days: number): string {
    const date = new Date(isoDateString);
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  static subtractDays(isoDateString: string, days: number): string {
    return this.addDays(isoDateString, -days);
  }

  static differenceInDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
  }
}
