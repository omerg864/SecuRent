export interface Business {
	id: string;
	name: string;
	address: string;
	category: string;
	distance: number;
	rating: number;
	latitude: number;
	longitude: number;
}

export interface FileObject {
	uri: string;
	name: string; // or use the file name if available
	type: string; // or use asset.mimeType if available
}
