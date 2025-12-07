/**
 * Time utility functions for weather system
 */

export class TimeUtils {
  /**
   * Get current time in seconds
   */
  static getCurrentTimeSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Get current time in milliseconds
   */
  static getCurrentTimeMs(): number {
    return Date.now();
  }

  /**
   * Convert seconds to milliseconds
   */
  static secondsToMs(seconds: number): number {
    return seconds * 1000;
  }

  /**
   * Convert milliseconds to seconds
   */
  static msToSeconds(ms: number): number {
    return Math.floor(ms / 1000);
  }

  /**
   * Get elapsed time in seconds
   */
  static getElapsedSeconds(startTime: number): number {
    return Math.floor((Date.now() - startTime) / 1000);
  }

  /**
   * Format timestamp to readable date
   */
  static formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toISOString();
  }

  /**
   * Check if enough time has passed
   */
  static hasTimeElapsed(startTime: number, intervalMs: number): boolean {
    return Date.now() - startTime >= intervalMs;
  }
}
