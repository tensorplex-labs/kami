export class RetryUtil {
  static async withBackoff<T>(
    operation: () => Promise<T>,
    options: {
      maxRetries: number;
      initialDelay: number;
      maxDelay: number;
      backoffFactor: number;
      retryCondition?: (error: Error) => boolean;
    },
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < options.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Check if we should retry this type of error
        if (options.retryCondition && !options.retryCondition(error)) {
          throw error;
        }
        
        if (attempt + 1 >= options.maxRetries) {
          break;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          options.initialDelay * Math.pow(options.backoffFactor, attempt),
          options.maxDelay
        );
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}
