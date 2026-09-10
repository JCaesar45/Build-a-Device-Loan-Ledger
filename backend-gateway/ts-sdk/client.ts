export interface FractionalAllocation {
  asset_id: string;
  fraction_volume: number;
  fiat_denomination: string;
}

export interface LedgerReceipt {
  tx_hash: string;
  state_root: string;
  timestamp: number;
}

export class AureliaGateway {
  private readonly endpoint: string;
  private readonly headers: HeadersInit;

  constructor(endpoint: string, bearerToken: string) {
    this.endpoint = endpoint;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`,
      'X-Client-Version': '1.0.0-ts'
    };
  }

  public async submitAllocation(payload: FractionalAllocation): Promise<LedgerReceipt> {
    const response = await fetch(`${this.endpoint}/api/v1/ledger/allocate`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown Gateway Error' }));
      throw new Error(`Gateway Rejection [${response.status}]: ${errorData.detail}`);
    }

    return response.json() as Promise<LedgerReceipt>;
  }
}
