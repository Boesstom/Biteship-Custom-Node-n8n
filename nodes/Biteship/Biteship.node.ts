import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

export class Biteship implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Biteship',
		name: 'biteship',
		icon: 'file:biteship.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Integrasi dengan layanan pengiriman Biteship',
		defaults: {
			name: 'Biteship',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'biteshipApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.environment === "production" ? "https://api.biteship.com" : "https://api.biteship.com"}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Courier',
						value: 'courier',
					},
					{
						name: 'Rate',
						value: 'rate',
					},
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Tracking',
						value: 'tracking',
					},
				],
				default: 'courier',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['courier'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						action: 'Get all couriers',
						description: 'Dapatkan daftar semua kurir yang tersedia',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['rate'],
					},
				},
				options: [
					{
						name: 'Check Rates',
						value: 'checkRates',
						action: 'Check shipping rates',
						description: 'Cek tarif pengiriman',
					},
				],
				default: 'checkRates',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['order'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create an order',
						description: 'Buat pesanan pengiriman baru',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get an order',
						description: 'Dapatkan detail pesanan',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['tracking'],
					},
				},
				options: [
					{
						name: 'Track',
						value: 'track',
						action: 'Track a shipment',
						description: 'Lacak status pengiriman',
					},
				],
				default: 'track',
			},
			// Rate check parameters
			{
				displayName: 'Origin Postal Code',
				name: 'originPostalCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['rate'],
						operation: ['checkRates'],
					},
				},
				default: '',
				description: 'Kode pos asal pengiriman',
			},
			{
				displayName: 'Destination Postal Code',
				name: 'destinationPostalCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['rate'],
						operation: ['checkRates'],
					},
				},
				default: '',
				description: 'Kode pos tujuan pengiriman',
			},
			{
				displayName: 'Couriers',
				name: 'couriers',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['rate'],
						operation: ['checkRates'],
					},
				},
				options: [
					{ name: 'JNE', value: 'jne' },
					{ name: 'TIKI', value: 'tiki' },
					{ name: 'POS Indonesia', value: 'pos' },
					{ name: 'J&T', value: 'jnt' },
					{ name: 'SiCepat', value: 'sicepat' },
					{ name: 'AnterAja', value: 'anteraja' },
					{ name: 'Lion Parcel', value: 'lion' },
					{ name: 'Ninja Xpress', value: 'ninja' },
				],
				default: ['jne'],
				description: 'Pilih kurir yang ingin dicek tarifnya',
			},
			{
				displayName: 'Items',
				name: 'items',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['rate'],
						operation: ['checkRates'],
					},
				},
				default: {},
				options: [
					{
						name: 'item',
						displayName: 'Item',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Nama item',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								description: 'Deskripsi item',
							},
							{
								displayName: 'SKU',
								name: 'sku',
								type: 'string',
								default: '',
								description: 'SKU item',
							},
							{
								displayName: 'Category',
								name: 'category',
								type: 'string',
								default: '',
								description: 'Kategori item',
							},
							{
								displayName: 'Mass (gram)',
								name: 'mass',
								type: 'number',
								default: 100,
								description: 'Berat item dalam gram',
							},
							{
								displayName: 'Quantity',
								name: 'quantity',
								type: 'number',
								default: 1,
								description: 'Jumlah item',
							},
						],
					},
				],
			},
			// Tracking parameters
			{
				displayName: 'Waybill ID',
				name: 'waybillId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['tracking'],
						operation: ['track'],
					},
				},
				default: '',
				description: 'ID waybill atau nomor resi pengiriman',
			},
			{
				displayName: 'Courier Code',
				name: 'courierCode',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['tracking'],
						operation: ['track'],
					},
				},
				options: [
					{ name: 'JNE', value: 'jne' },
					{ name: 'TIKI', value: 'tiki' },
					{ name: 'POS Indonesia', value: 'pos' },
					{ name: 'J&T', value: 'jnt' },
					{ name: 'SiCepat', value: 'sicepat' },
					{ name: 'AnterAja', value: 'anteraja' },
					{ name: 'Lion Parcel', value: 'lion' },
					{ name: 'Ninja Xpress', value: 'ninja' },
				],
				default: 'jne',
				description: 'Kode kurir untuk tracking',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'courier') {
					if (operation === 'getAll') {
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'biteshipApi',
							{
								method: 'GET',
								url: '/v1/couriers',
							},
						);
					}
				} else if (resource === 'rate') {
					if (operation === 'checkRates') {
						const originPostalCode = this.getNodeParameter('originPostalCode', i) as string;
						const destinationPostalCode = this.getNodeParameter('destinationPostalCode', i) as string;
						const couriers = this.getNodeParameter('couriers', i) as string[];
						const items = this.getNodeParameter('items', i) as any;

						const body: any = {
							origin_postal_code: originPostalCode,
							destination_postal_code: destinationPostalCode,
							couriers: couriers.join(','),
							items: items.item || [],
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'biteshipApi',
							{
								method: 'POST',
								url: '/v1/rates/couriers',
								body,
							},
						);
					}
				} else if (resource === 'tracking') {
					if (operation === 'track') {
						const waybillId = this.getNodeParameter('waybillId', i) as string;
						const courierCode = this.getNodeParameter('courierCode', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'biteshipApi',
							{
								method: 'GET',
								url: `/v1/trackings/${waybillId}/couriers/${courierCode}`,
							},
						);
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map(item => ({ json: item })));
				} else {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error);
			}
		}

		return [returnData];
	}
}
