import axios, { AxiosInstance } from 'axios';
import { IApiResponse, SubnetMetagraphDto } from 'kami';

// Import the response and DTO types
interface IApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  data: T | null;
  error: {
    type: string;
    message: string;
    stackTrace?: string;
  } | null;
}

// Simplified version of SubnetMetagraphDto
interface SubnetMetagraphDto {
  netuid: number;
  n: number;
  neurons: Array<{
    uid: number;
    active: boolean;
    stake: string;
    rank: number;
    emission: number;
    incentive: number;
    consensus: number;
    trust: number;
    validator_trust: number;
    dividends: number;
    // Additional neuron properties
  }>;
  // Other metagraph properties
}

// Custom error classes matching the API's error structure
class KamiApiError extends Error {
  constructor(
    public readonly type: string,
    message: string,
    public readonly statusCode: number,
    public readonly stackTrace?: string,
  ) {
    super(message);
    this.name = 'KamiApiError';
  }
}

class SubnetMetagraphNotFoundError extends KamiApiError {
  constructor(subnetId: string | number) {
    super('SUBNET_METAGRAPH.NOT_FOUND', `Subnet metagraph with ID ${subnetId} not found`, 404);
    this.name = 'SubnetMetagraphNotFoundError';
  }
}

class InvalidSubnetIdError extends KamiApiError {
  constructor(subnetId: string | number) {
    super('SUBNET_METAGRAPH.INVALID_SUBNET_ID', `Invalid subnet ID: ${subnetId}`, 400);
    this.name = 'InvalidSubnetIdError';
  }
}

/**
 * Tensorplex API Client
 * A client for interacting with the Tensorplex Kami API
 */
export class KamiClient {
  private readonly client: AxiosInstance;

  /**
   * Creates a new Tensorplex API client
   *
   * @param baseUrl - Base URL of the Tensorplex API (defaults to localhost:3000)
   * @param apiKey - Optional API key for authentication
   */
  constructor(
    baseUrl: string = 'http://localhost:3000',
    private readonly apiKey?: string,
  ) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    });

    // Add response interceptor to handle errors consistently
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (axios.isAxiosError(error) && error.response) {
          const data = error.response.data as IApiResponse<any>;

          if (data?.error) {
            // Map API error types to custom error classes
            if (data.error.type === 'SUBNET_METAGRAPH.NOT_FOUND') {
              throw new SubnetMetagraphNotFoundError(error.config?.params?.netuid || 'unknown');
            } else if (data.error.type === 'SUBNET_METAGRAPH.INVALID_SUBNET_ID') {
              throw new InvalidSubnetIdError(error.config?.params?.netuid || 'unknown');
            } else {
              throw new KamiApiError(
                data.error.type,
                data.error.message,
                error.response.status,
                data.error.stackTrace,
              );
            }
          }
        }

        // Default error handling
        throw error;
      },
    );
  }

  /**
   * Get subnet metagraph information
   *
   * @param netuid - Network UID to fetch metagraph information for
   * @returns Promise resolving to subnet metagraph data
   */
  async getSubnetMetagraph(netuid: number): Promise<SubnetMetagraphDto> {
    try {
      const response = await this.client.get<IApiResponse<SubnetMetagraphDto>>(
        `/chain/subnet-metagraph/${netuid}`,
      );

      if (!response.data.success || !response.data.data) {
        throw new Error('Failed to get subnet metagraph data');
      }

      return response.data.data;
    } catch (error) {
      // Custom errors are already handled by the interceptor
      if (error instanceof KamiApiError) {
        throw error;
      }

      // For any other errors
      throw new Error(`Failed to fetch subnet metagraph: ${error.message}`);
    }
  }
}

/**
 * Example usage of the KamiClient
 */
async function main() {
  // Initialize the client
  const client = new KamiClient('http://localhost:8882');

  try {
    // Fetch subnet metagraph with netuid 1
    console.log('Fetching subnet metagraph for netuid 1...');
    const metagraph = await client.getSubnetMetagraph(1);

    console.log(`Successfully retrieved metagraph for subnet ${metagraph.netuid}`);
    console.log(`Total neurons: ${metagraph.n}`);

    // Calculate some statistics
    const activeNeurons = metagraph.neurons.filter(n => n.active).length;
    const totalStake = metagraph.neurons.reduce((sum, n) => sum + parseFloat(n.stake), 0);

    console.log(
      `Active neurons: ${activeNeurons}/${metagraph.n} (${((activeNeurons / metagraph.n) * 100).toFixed(2)}%)`,
    );
    console.log(`Total stake: ${totalStake.toFixed(2)} TAO`);

    // Find top 5 validators by stake
    const topValidators = [...metagraph.neurons]
      .sort((a, b) => parseFloat(b.stake) - parseFloat(a.stake))
      .slice(0, 5);

    console.log('\nTop 5 validators by stake:');
    topValidators.forEach((validator, index) => {
      console.log(`${index + 1}. UID ${validator.uid}: ${validator.stake} TAO`);
    });
  } catch (error) {
    if (error instanceof SubnetMetagraphNotFoundError) {
      console.error('Subnet not found! Please check if the subnet exists.');
    } else if (error instanceof InvalidSubnetIdError) {
      console.error('Invalid subnet ID! Please provide a valid numeric ID.');
    } else if (error instanceof KamiApiError) {
      console.error(`API Error (${error.statusCode}): ${error.type} - ${error.message}`);
    } else {
      console.error('Unexpected error:', error.message);
    }
  }
}

// Run the example
main().catch(console.error);
